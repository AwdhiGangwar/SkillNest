package app.filter;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class FirebaseTokenFilter extends OncePerRequestFilter {

    // ✅ Cache - uid -> [role, status, timestamp]
    private static final Map<String, String[]> userCache = new ConcurrentHashMap<>();
    private static final long CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // 🔥 INTERNAL SERVICE CALL BYPASS
        String internalHeader = request.getHeader("X-Internal-Call");
        if ("true".equals(internalHeader)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ PUBLIC ENDPOINTS
        boolean isPublic =
            path.startsWith("/api/health") ||
            (path.startsWith("/api/teacher-requests") && request.getMethod().equals("POST"));

        if (isPublic) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🔒 PROTECTED ENDPOINTS
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

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid Firebase token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}