package com.storo.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@Service
public class EmailService {

  @Autowired
  private JavaMailSender emailSender;

  @Value("${email.from}")
  private String fromEmail;

  public void sendBookingConfirmation(String userEmail, String userName, Map<String, Object> bookingDetails) {
    try {
      MimeMessage message = emailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      String bookingId = (String) bookingDetails.get("bookingId");
      String partnerName = (String) bookingDetails.get("partnerName");
      String partnerCity = (String) bookingDetails.get("partnerCity");
      Date startDate = (Date) bookingDetails.get("startDate");
      Date endDate = (Date) bookingDetails.get("endDate");
      Double weightKg = (Double) bookingDetails.get("weightKg");
      Double totalAmount = (Double) bookingDetails.get("totalAmount");
      String status = (String) bookingDetails.get("status");
      String paymentStatus = (String) bookingDetails.get("paymentStatus");

      SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");

      String htmlMsg = String.format(
          """
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #1e3a8a 0%%, #1e40af 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                  .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1e40af; }
                  .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
                  .detail-label { font-weight: bold; color: #6b7280; }
                  .detail-value { color: #1a202c; }
                  .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                  .button { background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0; font-size: 28px;">🧳 Booking Confirmed!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for choosing Storo</p>
                  </div>
                  <div class="content">
                    <p>Hi %s,</p>
                    <p>Great news! Your luggage storage booking has been confirmed. Here are your booking details:</p>

                    <div class="booking-details">
                      <h3 style="margin-top: 0; color: #1e40af;">Booking Details</h3>
                      <div class="detail-row">
                        <span class="detail-label">Booking ID:</span>
                        <span class="detail-value">#%s</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value" style="color: #10b981; font-weight: bold;">%s</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Payment:</span>
                        <span class="detail-value" style="color: %s; font-weight: bold;">%s</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Partner:</span>
                        <span class="detail-value">%s</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">%s</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Storage Period:</span>
                        <span class="detail-value">%s - %s</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Weight:</span>
                        <span class="detail-value">%s kg</span>
                      </div>
                      <div class="detail-row" style="border-bottom: none;">
                        <span class="detail-label">Total Amount:</span>
                        <span class="detail-value" style="font-size: 18px; font-weight: bold; color: #1e40af;">₹%s</span>
                      </div>
                    </div>

                    <p><strong>What's Next?</strong></p>
                    <ul>
                      <li>Visit the partner location during your storage period</li>
                      <li>Present your Booking ID: <strong>#%s</strong></li>
                      <li>Drop off or pick up your luggage as scheduled</li>
                    </ul>

                    <center>
                      <a href="http://localhost:3000/dashboard" class="button">View My Bookings</a>
                    </center>

                    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                      Need help? Contact us at <a href="mailto:support@storo.com" style="color: #1e40af;">support@storo.com</a>
                    </p>
                  </div>
                  <div class="footer">
                    <p>© 2025 Storo. All rights reserved.</p>
                    <p>Secure Luggage Storage Solutions</p>
                  </div>
                </div>
              </body>
              </html>
              """,
          userName,
          bookingId,
          status.toUpperCase(),
          "paid".equals(paymentStatus) ? "#10b981" : "#f59e0b",
          "paid".equals(paymentStatus) ? "PAID" : "PAY LATER",
          partnerName,
          partnerCity,
          sdf.format(startDate),
          sdf.format(endDate),
          weightKg,
          totalAmount,
          bookingId);

      helper.setFrom(fromEmail != null ? fromEmail : "noreply@storo.com");
      helper.setTo(userEmail);
      helper.setSubject("Booking Confirmation - Storo #" + bookingId);
      helper.setText(htmlMsg, true);

      emailSender.send(message);
    } catch (MessagingException e) {
      e.printStackTrace();
    }
  }

  public void sendSupportTicketConfirmation(String userEmail, String userName, Map<String, Object> ticketDetails) {
    try {
      MimeMessage message = emailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      String ticketId = (String) ticketDetails.get("ticketId");
      String subject = (String) ticketDetails.get("subject");
      String msgContent = (String) ticketDetails.get("message");
      String status = (String) ticketDetails.get("status");

      String htmlMsg = String.format(
          """
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #1e3a8a 0%%, #1e40af 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                  .ticket-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
                  .detail-row { padding: 10px 0; }
                  .detail-label { font-weight: bold; color: #6b7280; display: block; margin-bottom: 5px; }
                  .detail-value { color: #1a202c; }
                  .message-box { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 10px 0; }
                  .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0; font-size: 28px;">💬 Support Ticket Received</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">We're here to help!</p>
                  </div>
                  <div class="content">
                    <p>Hi %s,</p>
                    <p>Thank you for contacting Storo Support. We've received your support request and our team will get back to you shortly.</p>

                    <div class="ticket-details">
                      <h3 style="margin-top: 0; color: #1e40af;">Ticket Information</h3>
                      <div class="detail-row">
                        <span class="detail-label">Ticket ID:</span>
                        <span class="detail-value">#%s</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value" style="color: #10b981; font-weight: bold;">%s</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Subject:</span>
                        <span class="detail-value">%s</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Your Message:</span>
                        <div class="message-box">%s</div>
                      </div>
                    </div>

                    <p><strong>What Happens Next?</strong></p>
                    <ul>
                      <li>Our support team will review your request</li>
                      <li>You'll receive a response within 24-48 hours</li>
                      <li>Keep your Ticket ID handy for reference: <strong>#%s</strong></li>
                    </ul>

                    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                      <strong>Need immediate assistance?</strong><br>
                      Email: <a href="mailto:support@storo.com" style="color: #1e40af;">support@storo.com</a><br>
                      Phone: +91 1800-XXX-XXXX
                    </p>
                  </div>
                  <div class="footer">
                    <p>© 2025 Storo. All rights reserved.</p>
                    <p>Secure Luggage Storage Solutions</p>
                  </div>
                </div>
              </body>
              </html>
              """,
          userName, ticketId, status.toUpperCase(), subject, msgContent, ticketId);

      helper.setFrom(fromEmail != null ? fromEmail : "noreply@storo.com");
      helper.setTo(userEmail);
      helper.setSubject("Support Ticket Received - #" + ticketId);
      helper.setText(htmlMsg, true);

      emailSender.send(message);
    } catch (MessagingException e) {
      e.printStackTrace();
    }
  }

  public void sendPasswordResetEmail(String userEmail, String userName, String resetUrl) {
    try {
      MimeMessage message = emailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      String htmlMsg = String.format(
          """
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #1e3a8a 0%%, #1e40af 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                  .button { background: #1e40af; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-weight: bold; }
                  .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                  .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset Request</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Storo Account Security</p>
                  </div>
                  <div class="content">
                    <p>Hi %s,</p>
                    <p>We received a request to reset your password for your Storo account. Click the button below to create a new password:</p>

                    <center>
                      <a href="%s" class="button">Reset Password</a>
                    </center>

                    <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
                    <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px;">%s</p>

                    <div class="warning">
                      <p style="margin: 0; font-weight: bold; color: #92400e;">⚠️ Important Security Information</p>
                      <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #92400e;">
                        <li>This link will expire in <strong>1 hour</strong></li>
                        <li>If you didn't request this, please ignore this email</li>
                        <li>Never share this link with anyone</li>
                      </ul>
                    </div>

                    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                      If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
                    </p>
                  </div>
                  <div class="footer">
                    <p>© 2025 Storo. All rights reserved.</p>
                    <p>Secure Luggage Storage Solutions</p>
                  </div>
                </div>
              </body>
              </html>
              """,
          userName, resetUrl, resetUrl);

      helper.setFrom(fromEmail != null ? fromEmail : "noreply@storo.com");
      helper.setTo(userEmail);
      helper.setSubject("Password Reset Request - Storo");
      helper.setText(htmlMsg, true);

      emailSender.send(message);
    } catch (MessagingException e) {
      e.printStackTrace();
    }
  }
}
