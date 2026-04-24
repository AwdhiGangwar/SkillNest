package app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendClassNotification(String toEmail, String studentName,
                                       String classTitle, String startTime, 
                                       String meetingLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
          MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("📚 New Live Class Scheduled: " + classTitle);
            helper.setText(buildEmailHtml(studentName, classTitle, 
                                          startTime, meetingLink), true);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Email failed: " + e.getMessage());
        }
    }

    private String buildEmailHtml(String name, String title, 
                                   String time, String link) {
        return """
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
                <h2 style="color:#6366f1">New Class Scheduled! 🎓</h2>
                <p>Hi %s,</p>
                <p>A new live class has been scheduled:</p>
                <div style="background:#f3f4f6;padding:20px;border-radius:10px">
                    <p><b>📌 Topic:</b> %s</p>
                    <p><b>🕐 Time:</b> %s</p>
                </div>
                <a href="%s" style="display:inline-block;margin-top:20px;
                   padding:12px 24px;background:#6366f1;color:white;
                   border-radius:8px;text-decoration:none">
                   Join Class 🚀
                </a>
            </div>
        """.formatted(name, title, time, link);
    }
}
