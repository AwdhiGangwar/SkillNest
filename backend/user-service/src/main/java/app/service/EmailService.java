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
        message.setSubject("Welcome to CodeCat - Set Your Password");

        message.setText(
            "Hi,\n\n" +
            "Your teacher account has been approved!\n\n" +
            "Click below to set your password:\n" +
            resetLink + "\n\n" +
            "Regards,\nCodeCat Team"
        );

        mailSender.send(message);
    }

    // ✅ SEND REJECTION EMAIL
    public void sendRejectionEmail(String to) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("CodeCat Application Update");

        message.setText(
            "Hi,\n\n" +
            "We regret to inform you that your teacher application was not approved.\n\n" +
            "You may apply again later.\n\n" +
            "Regards,\nCodeCat Team"
        );

        mailSender.send(message);
    }

    // ✅ SEND TEACHER ACCOUNT CREATED EMAIL
    public void sendTeacherAccountCreatedEmail(String to, String teacherName) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Welcome to CodeCat - Your Account is Ready!");

        message.setText(
            "Hi " + teacherName + ",\n\n" +
            "Your teacher account has been approved and created!\n\n" +
            "You can now login to CodeCat with your email and password.\n" +
            "Visit: https://codecat.com or your local instance\n\n" +
            "If you have any issues, please contact support.\n\n" +
            "Happy teaching!\n\n" +
            "Regards,\nCodeCat Team"
        );

        mailSender.send(message);
    }
}