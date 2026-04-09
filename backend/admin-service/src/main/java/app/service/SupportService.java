package app.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SupportService {

    public List<Map<String, Object>> getUserTickets(String uid) {
        List<Map<String, Object>> tickets = new ArrayList<>();
        
        // Mock data
        Map<String, Object> ticket1 = new HashMap<>();
        ticket1.put("id", "TKT001");
        ticket1.put("subject", "Cannot enroll in course");
        ticket1.put("message", "I'm getting an error when trying to enroll in the Python course");
        ticket1.put("status", "open");
        ticket1.put("createdAt", System.currentTimeMillis() - 172800000);
        ticket1.put("updatedAt", System.currentTimeMillis());
        tickets.add(ticket1);

        Map<String, Object> ticket2 = new HashMap<>();
        ticket2.put("id", "TKT002");
        ticket2.put("subject", "Course refund request");
        ticket2.put("message", "Would like to request a refund for the Java course");
        ticket2.put("status", "resolved");
        ticket2.put("createdAt", System.currentTimeMillis() - 604800000);
        ticket2.put("updatedAt", System.currentTimeMillis() - 86400000);
        tickets.add(ticket2);
        
        return tickets;
    }

    public Map<String, Object> createTicket(String uid, Map<String, String> ticketData) {
        Map<String, Object> ticket = new HashMap<>();
        ticket.put("id", "TKT" + System.currentTimeMillis());
        ticket.put("userId", uid);
        ticket.put("subject", ticketData.get("subject"));
        ticket.put("message", ticketData.get("message"));
        ticket.put("status", "open");
        ticket.put("createdAt", System.currentTimeMillis());
        ticket.put("updatedAt", System.currentTimeMillis());
        
        return ticket;
    }
}
