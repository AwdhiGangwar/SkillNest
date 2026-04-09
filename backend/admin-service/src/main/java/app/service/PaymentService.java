package app.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class PaymentService {

    public List<Map<String, Object>> getUserTransactions(String uid) {
        List<Map<String, Object>> transactions = new ArrayList<>();
        
        // Mock data - in production, fetch from Firestore
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

    public Map<String, Object> processPayment(String uid, double amount, String courseId) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("transactionId", "TXN" + System.currentTimeMillis());
        result.put("amount", amount);
        result.put("status", "completed");
        result.put("timestamp", System.currentTimeMillis());
        
        return result;
    }
}
