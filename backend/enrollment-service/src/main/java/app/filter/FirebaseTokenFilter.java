package app.filter;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
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

        // ✅ PUBLIC ENDPOINTS (no auth required)
        boolean isPublic =
                path.startsWith("/api/health") ||
                path.startsWith("/api/users") ||
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

            // ✅ Extract useful info
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();

            // Attach to request (you can use in controllers/services)
            request.setAttribute("uid", uid);
            request.setAttribute("email", email);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid Firebase token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}