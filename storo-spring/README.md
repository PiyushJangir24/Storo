# Storo Backend - Spring Boot

This is the Spring Boot 3.x implementation of the Storo backend, migrated from Node.js/Express.

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- MongoDB (running locally or Atlas)

## Configuration
Update `src/main/resources/application.properties` with your configuration:

```properties
# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/storo

# Server Port
server.port=5000

# JWT
jwt.secret=your_super_secret_key_at_least_32_bytes_long
jwt.expiration=86400000

# Razorpay
razorpay.key.id=your_razorpay_key
razorpay.key.secret=your_razorpay_secret

# Email (Gmail example)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

## Build and Run

### Build
```bash
mvn clean install
```

### Run
```bash
mvn spring-boot:run
```

## API Documentation
Once running, access Swagger UI at:
http://localhost:5000/swagger-ui/index.html

## Key Endpoints
- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Partners**: `/api/partners`, `/api/partners/nearby`
- **Bookings**: `/api/bookings`
- **Payments**: `/api/payments/create-order`
- **Support**: `/api/support`
- **Admin**: `/api/admin/stats`

## Migration Notes
- **Database**: The application uses the same MongoDB collections (`users`, `partners`, `bookings`, `tickets`). Ensure your existing data is compatible or start fresh.
- **GeoJSON**: Partners must have `location` stored as GeoJSON Point for geospatial queries to work.
- **Security**: JWT tokens are signed with `HS256`. Ensure the secret matches if you want to reuse tokens (unlikely due to different signing implementation details, better to re-login).
