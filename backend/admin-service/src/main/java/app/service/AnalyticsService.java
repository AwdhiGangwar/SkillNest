package app.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    public Map<String, Object> getUserAnalytics(String uid) {
        Map<String, Object> analytics = new HashMap<>();
        
        // These would be calculated from Firestore data
        analytics.put("totalRevenue", 1250.50);
        analytics.put("activeStudents", 45);
        analytics.put("totalCourses", 8);
        analytics.put("avgRating", 4.8);
        analytics.put("completionRate", 78);
        analytics.put("enrollmentGrowth", 15.5);
        
        return analytics;
    }

    public Map<String, Object> getAdminAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        analytics.put("totalUsers", 2500);
        analytics.put("totalCourses", 450);
        analytics.put("totalEnrollments", 12000);
        analytics.put("activeTeachers", 280);
        analytics.put("totalRevenue", 125000.00);
        analytics.put("platformGrowth", 25.3);
        
        return analytics;
    }
}
