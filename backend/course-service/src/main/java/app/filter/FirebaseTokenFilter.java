package app.filter;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
<<<<<<< HEAD
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
=======
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
<<<<<<< HEAD
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class FirebaseTokenFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseTokenFilter.class);

    // ✅ Cache
    private static final Map<String, String[]> userCache = new ConcurrentHashMap<>();
    private static final long CACHE_TTL = 5 * 60 * 1000; // 5 minutes

=======
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class FirebaseTokenFilter extends OncePerRequestFilter {

>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
<<<<<<< HEAD
        String method = request.getMethod();
        logger.debug("Processing request: {} {}", method, path);

        // ✅ Public endpoints
=======

        // allow public endpoints (for now)
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
        if (path.equals("/health") || path.equals("/users") || path.equals("/me")) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
<<<<<<< HEAD
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Missing or invalid Authorization header\"}");
=======
            response.getWriter().write("Missing or invalid Authorization header");
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
            return;
        }

        String token = header.substring(7);

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
<<<<<<< HEAD
            String uid = decodedToken.getUid();
            logger.info("Token verified for UID: {}", uid);
            request.setAttribute("uid", uid);

            // ✅ Cache check karo
            String[] cached = userCache.get(uid);
            boolean cacheValid = cached != null &&
                (System.currentTimeMillis() - Long.parseLong(cached[2])) < CACHE_TTL;

            if (cacheValid) {
                // ✅ Cache se lo
                if ("BLOCKED".equalsIgnoreCase(cached[1])) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Account is blocked\"}");
                    return;
                }
                request.setAttribute("role", cached[0]);
                logger.info("Role from cache for UID: {} -> {}", uid, cached[0]);
            } else {
                // ✅ Firestore se fetch karo
                try {
                    Firestore db = FirestoreClient.getFirestore();
                    DocumentSnapshot userDoc = db.collection("users")
                            .document(uid).get().get();

                    if (userDoc.exists()) {
                        String role = userDoc.getString("role");
                        String status = userDoc.getString("status");

                        // ✅ Cache mein save karo
                        userCache.put(uid, new String[]{
                            role != null ? role : "",
                            status != null ? status : "",
                            String.valueOf(System.currentTimeMillis())
                        });

                        if ("BLOCKED".equalsIgnoreCase(status)) {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Account is blocked\"}");
                            return;
                        }

                        request.setAttribute("role", role);
                        logger.info("Role set for UID: {} -> {}", uid, role);
                    }
                } catch (Exception roleEx) {
                    logger.warn("Could not fetch role for UID: {}", uid);
                }
            }

        } catch (Exception e) {
            logger.error("Invalid Firebase token: {}", e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid Firebase token\"}");
=======

            String uid = decodedToken.getUid();

            request.setAttribute("uid", uid);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid Firebase token");
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
            return;
        }

        filterChain.doFilter(request, response);
    }
}