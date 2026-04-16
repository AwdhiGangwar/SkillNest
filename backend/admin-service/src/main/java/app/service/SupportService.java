package app.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import app.client.UserServiceClient;
import app.dto.UserDTO;

@Service
public class SupportService {

    @Autowired
    private UserServiceClient userClient;

    public List<Map<String, Object>> getUserTickets(String uid) {
        List<Map<String, Object>> tickets = new ArrayList<>();
        try {
            Firestore db = FirestoreClient.getFirestore();
            List<QueryDocumentSnapshot> docs;
            if (uid == null || uid.isEmpty()) {
                docs = db.collection("support_tickets").get().get().getDocuments();
            } else {
                docs = db.collection("support_tickets").whereEqualTo("userId", uid).get().get().getDocuments();
            }

            for (QueryDocumentSnapshot d : docs) {
                Map<String, Object> data = d.getData();
                data.put("id", d.getId());

                // Enrich with user details when available
                try {
                    Object uidObj = data.get("userId");
                    if (uidObj != null && uidObj instanceof String && !((String) uidObj).isEmpty()) {
                        String raiserId = (String) uidObj;
                        try {
                            UserDTO user = userClient.getUserById(raiserId);
                            if (user != null) {
                                Map<String, Object> raiser = new HashMap<>();
                                raiser.put("id", user.getId());
                                raiser.put("name", user.getName());
                                raiser.put("email", user.getEmail());
                                raiser.put("role", user.getRole());
                                data.put("raiser", raiser);
                            }
                        } catch (Exception e) {
                            // ignore user lookup failures, leave raiser absent
                        }
                    }
                } catch (Exception ignore) {}

                tickets.add(data);
            }
        } catch (Exception e) {
            // fallback: return empty list on error
        }
        return tickets;
    }

    public Map<String, Object> createTicket(String uid, Map<String, String> ticketData) {
        Map<String, Object> ticket = new HashMap<>();
        try {
            Firestore db = FirestoreClient.getFirestore();
            Map<String, Object> doc = new HashMap<>();
            doc.put("userId", uid == null ? "" : uid);
            doc.put("subject", ticketData.getOrDefault("subject", ""));
            doc.put("message", ticketData.getOrDefault("message", ""));
            doc.put("status", "open");
            doc.put("createdAt", System.currentTimeMillis());
            doc.put("updatedAt", System.currentTimeMillis());
            if (ticketData.get("userEmail") != null) doc.put("userEmail", ticketData.get("userEmail"));

            var ref = db.collection("support_tickets").document();
            ref.set(doc).get();
            doc.put("id", ref.getId());
            System.out.println("[SupportService] Ticket written to Firestore id=" + ref.getId());
            return doc;
        } catch (Exception e) {
            System.err.println("[SupportService] Failed to write ticket to Firestore: " + e.getMessage());
            e.printStackTrace();
            ticket.put("id", "TKT" + System.currentTimeMillis());
            ticket.put("userId", uid == null ? "" : uid);
            ticket.put("subject", ticketData.get("subject"));
            ticket.put("message", ticketData.get("message"));
            ticket.put("status", "open");
            ticket.put("createdAt", System.currentTimeMillis());
            ticket.put("updatedAt", System.currentTimeMillis());
            ticket.put("_fallback", true);
            return ticket;
        }
    }

    public Map<String, Object> updateTicket(String id, Map<String, Object> updates) {
        Map<String, Object> result = new HashMap<>();
        try {
            Firestore db = FirestoreClient.getFirestore();
            var ref = db.collection("support_tickets").document(id);
            updates.put("updatedAt", System.currentTimeMillis());
            ref.update(updates).get();
            var doc = ref.get().get();
            if (doc.exists()) {
                result = doc.getData();
                result.put("id", doc.getId());
            }
        } catch (Exception e) {
            result.put("error", "Failed to update ticket");
        }
        return result;
    }

    public Map<String, Object> deleteTicket(String id) {
        Map<String, Object> result = new HashMap<>();
        try {
            Firestore db = FirestoreClient.getFirestore();
            var ref = db.collection("support_tickets").document(id);
            ref.delete().get();
            result.put("ok", true);
            result.put("id", id);
        } catch (Exception e) {
            result.put("ok", false);
            result.put("error", e.getMessage());
        }
        return result;
    }

    public Map<String, Object> syncTicket(Map<String, Object> ticketData) {
        Map<String, Object> result = new HashMap<>();
        try {
            Firestore db = FirestoreClient.getFirestore();

            String id = null;
            if (ticketData.get("id") != null) {
                id = ticketData.get("id").toString();
            }

            Map<String, Object> doc = new HashMap<>();
            doc.put("userId", ticketData.getOrDefault("userId", ""));
            doc.put("subject", ticketData.getOrDefault("subject", ""));
            doc.put("message", ticketData.getOrDefault("message", ""));
            doc.put("status", ticketData.getOrDefault("status", "open"));
            doc.put("createdAt", ticketData.getOrDefault("createdAt", System.currentTimeMillis()));
            doc.put("updatedAt", ticketData.getOrDefault("updatedAt", System.currentTimeMillis()));
            if (ticketData.get("userEmail") != null) doc.put("userEmail", ticketData.get("userEmail"));

            if (id != null && !id.isEmpty()) {
                var ref = db.collection("support_tickets").document(id);
                ref.set(doc).get();
                doc.put("id", ref.getId());
            } else {
                var ref = db.collection("support_tickets").document();
                ref.set(doc).get();
                doc.put("id", ref.getId());
            }

            // Enrich with raiser if possible
            try {
                Object uidObj = doc.get("userId");
                if (uidObj != null && uidObj instanceof String && !((String) uidObj).isEmpty()) {
                    UserDTO user = userClient.getUserById((String) uidObj);
                    if (user != null) {
                        Map<String, Object> raiser = new HashMap<>();
                        raiser.put("id", user.getId());
                        raiser.put("name", user.getName());
                        raiser.put("email", user.getEmail());
                        raiser.put("role", user.getRole());
                        doc.put("raiser", raiser);
                    }
                }
            } catch (Exception ignore) {}

            result = doc;
        } catch (Exception e) {
            result.put("error", "Failed to sync ticket: " + e.getMessage());
        }
        return result;
    }

    public Map<String, Object> getSupportHealth() {
        Map<String, Object> health = new HashMap<>();
        try {
            Firestore db = FirestoreClient.getFirestore();
            var query = db.collection("support_tickets").get().get();
            var docs = query.getDocuments();
            int count = docs.size();
            long latest = 0L;
            for (QueryDocumentSnapshot d : docs) {
                Object v = d.get("createdAt");
                if (v instanceof Number) {
                    long ts = ((Number) v).longValue();
                    if (ts > latest) latest = ts;
                }
            }
            health.put("count", count);
            health.put("latestCreatedAt", latest);
            health.put("ok", true);
        } catch (Exception e) {
            health.put("ok", false);
            health.put("error", e.getMessage());
            System.err.println("[SupportService] getSupportHealth failed: " + e.getMessage());
            e.printStackTrace();
        }
        return health;
    }
}
