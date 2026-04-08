package app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ✅ SEND WELCOME EMAIL
    public void sendTeacherWelcomeEmail(String to, String resetLink) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Welcome to SkillNest - Set Your Password");

        message.setText(
            "Hi,\n\n" +
            "Your teacher account has been approved!\n\n" +
            "Click below to set your password:\n" +
            resetLink + "\n\n" +
            "Regards,\nSkillNest Team"
        );

        mailSender.send(message);
    }

    // ✅ SEND REJECTION EMAIL
    public void sendRejectionEmail(String to) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("SkillNest Application Update");

        message.setText(
            "Hi,\n\n" +
            "We regret to inform you that your teacher application was not approved.\n\n" +
            "You may apply again later.\n\n" +
            "Regards,\nSkillNest Team"
        );

        mailSender.send(message);
    }
}