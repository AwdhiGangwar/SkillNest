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
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
<<<<<<< HEAD
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class FirebaseTokenFilter extends OncePerRequestFilter {

    // ✅ Cache - uid -> [role, status, timestamp]
    private static final Map<String, String[]> userCache = new ConcurrentHashMap<>();
    private static final long CACHE_TTL = 5 * 60 * 1000; // 5 minutes

=======

public class FirebaseTokenFilter extends OncePerRequestFilter {

>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

<<<<<<< HEAD
        // 🔥 INTERNAL SERVICE CALL BYPASS
        String internalHeader = request.getHeader("X-Internal-Call");
        if ("true".equals(internalHeader)) {
=======
        // allow public endpoints (for now)
        if (path.equals("/health") || path.equals("/users") || path.equals("/me")) {
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
            filterChain.doFilter(request, response);
            return;
        }

<<<<<<< HEAD
        // ✅ PUBLIC ENDPOINTS
        boolean isPublic =
            path.startsWith("/api/health") ||
            (path.startsWith("/api/teacher-requests") && request.getMethod().equals("POST"));

        if (isPublic) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🔒 PROTECTED ENDPOINTS
=======
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb
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
<<<<<<< HEAD
            String email = decodedToken.getEmail();

            request.setAttribute("uid", uid);
            request.setAttribute("email", email);

            // ✅ Cache check karo
            String[] cached = userCache.get(uid);
            boolean cacheValid = cached != null &&
                (System.currentTimeMillis() - Long.parseLong(cached[2])) < CACHE_TTL;

            if (cacheValid) {
                // ✅ Cache se role aur status lo
                String cachedStatus = cached[1];
                if ("BLOCKED".equalsIgnoreCase(cachedStatus)) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("Account is blocked");
                    return;
                }
                request.setAttribute("role", cached[0]);
            } else {
                // ✅ Firestore se fetch karo aur cache karo
                try {
                    Firestore db = FirestoreClient.getFirestore();
                    DocumentSnapshot doc = db.collection("users").document(uid).get().get();

                    if (doc.exists()) {
                        String status = doc.getString("status");
                        String role = doc.getString("role");

                        // ✅ Cache mein save karo
                        userCache.put(uid, new String[]{
                            role != null ? role : "",
                            status != null ? status : "",
                            String.valueOf(System.currentTimeMillis())
                        });

                        if ("BLOCKED".equalsIgnoreCase(status)) {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write("Account is blocked");
                            return;
                        }

                        request.setAttribute("role", role);
                    }
                } catch (Exception e) {
                    System.err.println("Warning: failed to verify user status: " + e.getMessage());
                }
            }
=======

            request.setAttribute("uid", uid);
>>>>>>> ca9e6a8546d45fdcb2d8dbf6b42011e2c1e874cb

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid Firebase token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}