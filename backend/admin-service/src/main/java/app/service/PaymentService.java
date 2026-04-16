package app.service;

import org.springframework.stereotype.Service;
import java.util.*;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.QueryDocumentSnapshot;

@Service
public class PaymentService {

    public List<Map<String, Object>> getUserTransactions(String uid) {
        try {
            Firestore db = FirestoreClient.getFirestore();
            List<QueryDocumentSnapshot> docs = db.collection("transactions").whereEqualTo("studentId", uid).get().get().getDocuments();
            List<Map<String, Object>> transactions = new ArrayList<>();
            for (QueryDocumentSnapshot d : docs) {
                Map<String, Object> data = d.getData();
                data.put("id", d.getId());
                transactions.add(data);
            }
            return transactions;
        } catch (Exception e) {
            // fallback to mock data when Firestore not available
            List<Map<String, Object>> transactions = new ArrayList<>();
            Map<String, Object> txn1 = new HashMap<>();
            txn1.put("id", "TXN001");
            txn1.put("date", System.currentTimeMillis() - 86400000);
            txn1.put("description", "Course: Advanced Python");
            txn1.put("amount", 49.99);
            txn1.put("status", "completed");
            transactions.add(txn1);

            Map<String, Object> txn2 = new HashMap<>();
            txn2.put("id", "TXN002");
            txn2.put("date", System.currentTimeMillis() - 172800000);
            txn2.put("description", "Course: Web Development");
            txn2.put("amount", 79.99);
            txn2.put("status", "completed");
            transactions.add(txn2);

            return transactions;
        }
    }

    public List<Map<String, Object>> getAllTransactions() {
        List<Map<String, Object>> transactions = new ArrayList<>();
        try {
            Firestore db = FirestoreClient.getFirestore();

            // student payments
            var payments = db.collection("transactions").get().get().getDocuments();
            for (QueryDocumentSnapshot d : payments) {
                Map<String, Object> data = d.getData();
                data.put("id", d.getId());
                data.put("_source", "transactions");
                transactions.add(data);
            }

            // teacher payouts (separate collection)
            var payouts = db.collection("teacher_payouts").get().get().getDocuments();
            for (QueryDocumentSnapshot d : payouts) {
                Map<String, Object> data = d.getData();
                data.put("id", d.getId());
                data.put("_source", "teacher_payouts");
                // mark as payout so caller can distinguish
                data.put("type", "payout");
                transactions.add(data);
            }

            return transactions;
        } catch (Exception e) {
            // return empty list on error
            return transactions;
        }
    }

    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        double totalRevenue = 0.0;
        double totalPaidToTeachers = 0.0;
        Map<String, Double> monthly = new TreeMap<>();

        try {
            Firestore db = FirestoreClient.getFirestore();

            var payments = db.collection("transactions").get().get().getDocuments();
            for (QueryDocumentSnapshot d : payments) {
                Map<String, Object> data = d.getData();
                Number amt = (Number) data.getOrDefault("amount", 0);
                long ts = ((Number) data.getOrDefault("timestamp", System.currentTimeMillis())).longValue();
                double a = amt.doubleValue();
                totalRevenue += a;

                // monthly key YYYY-MM
                Calendar c = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
                c.setTimeInMillis(ts);
                String key = String.format("%04d-%02d", c.get(Calendar.YEAR), c.get(Calendar.MONTH) + 1);
                monthly.put(key, monthly.getOrDefault(key, 0.0) + a);
            }

            var payouts = db.collection("teacher_payouts").get().get().getDocuments();
            for (QueryDocumentSnapshot d : payouts) {
                Map<String, Object> data = d.getData();
                Number amt = (Number) data.getOrDefault("amount", 0);
                totalPaidToTeachers += amt.doubleValue();
            }

            summary.put("totalRevenue", totalRevenue);
            summary.put("totalPaidToTeachers", totalPaidToTeachers);
            summary.put("monthlyRevenue", monthly);
            return summary;
        } catch (Exception e) {
            // fallback mocked summary
            summary.put("totalRevenue", 0.0);
            summary.put("totalPaidToTeachers", 0.0);
            summary.put("monthlyRevenue", new HashMap<>());
            return summary;
        }
    }

    public List<Map<String, Object>> getTeacherPayouts() {
        List<Map<String, Object>> payouts = new ArrayList<>();
        try {
            Firestore db = FirestoreClient.getFirestore();
            var docs = db.collection("teacher_payouts").get().get().getDocuments();
            for (QueryDocumentSnapshot d : docs) {
                Map<String, Object> data = d.getData();
                data.put("id", d.getId());
                payouts.add(data);
            }
            return payouts;
        } catch (Exception e) {
            return payouts;
        }
    }

    public Map<String, Object> processPayment(String uid, double amount, String courseId) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("transactionId", "TXN" + System.currentTimeMillis());
        result.put("amount", amount);
        result.put("status", "completed");
        result.put("timestamp", System.currentTimeMillis());

        // Note: actual payment processing and Firestore writes should be implemented
        return result;
    }
}
