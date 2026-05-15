package app.filter;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class FirebaseTokenFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Public endpoints bypass
        if (path.startsWith("/api/health") || 
            path.startsWith("/api/teacher-requests") && "POST".equals(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // Internal service calls bypass
        if ("true".equals(request.getHeader("X-Internal-Call"))) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        String token = header.substring(7);

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);

            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();

            request.setAttribute("uid", uid);
            request.setAttribute("email", email);

            // Role aur status fetch karo (yeh part error cause kar raha tha)
            loadUserRoleAndStatus(request, uid);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid Firebase token");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void loadUserRoleAndStatus(HttpServletRequest request, String uid) {
        try {
            Firestore db = FirestoreClient.getFirestore();
            DocumentSnapshot doc = db.collection("users").document(uid).get().get();

            if (doc.exists()) {
                String role = doc.getString("role");
                String status = doc.getString("status");

                if ("BLOCKED".equalsIgnoreCase(status)) {
                    // Optional: block logic
                }

                if (role != null) {
                    request.setAttribute("role", role);
                }
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not load user role/status: " + e.getMessage());
            // Non-blocking — allow request to proceed even if Firestore fails
        }
    }
}