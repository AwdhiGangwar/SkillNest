package app.filter;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class FirebaseTokenFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();
        logger.debug("Processing request: {} {}", method, path);

        if (path.equals("/health") || path.equals("/users") || path.equals("/me")) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Missing or invalid Authorization header\"}");
            return;
        }

        String token = header.substring(7);

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            String uid = decodedToken.getUid();
            logger.info("Token verified for UID: {}", uid);
            request.setAttribute("uid", uid);

            // ✅ Role fetch karo
            try {
                com.google.cloud.firestore.Firestore db = 
                    com.google.firebase.cloud.FirestoreClient.getFirestore();
                com.google.cloud.firestore.DocumentSnapshot userDoc = 
                    db.collection("users").document(uid).get().get();
                
                if (userDoc.exists()) {
                    String role = userDoc.getString("role");
                    request.setAttribute("role", role);
                    logger.info("Role set for UID: {} -> {}", uid, role);
                }
            } catch (Exception roleEx) {
                logger.warn("Could not fetch role for UID: {}", uid);
            }

        } catch (Exception e) {
            logger.error("Invalid Firebase token: {}", e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid Firebase token\"}");
            return;
        }

        filterChain.doFilter(request, response); // ✅ Yeh missing tha
    }
}