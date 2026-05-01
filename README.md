# ShopFlow - E-commerce Platform

A full-stack e-commerce platform built with Spring Boot 3 (backend) and Angular 17 (frontend), featuring JWT authentication, role-based access control, and comprehensive product management.

## Prerequisites

- **Java 21** - Backend runtime
- **Maven 3.8+** - Build tool
- **Node.js 18+** - Frontend runtime
- **PostgreSQL 15+** - Production database (optional, H2 for development)

## Quick Start

### Backend (Spring Boot)

#### Development (H2 Database)
```bash
cd backend
./mvnw spring-boot:run
```

#### Production (PostgreSQL)
Set environment variables:
```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/shopflow
export SPRING_DATASOURCE_USERNAME=your_username
export SPRING_DATASOURCE_PASSWORD=your_password
export APP_JWT_SECRET=your_jwt_secret_key_here
```

Then run:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

### Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

Navigate to `http://localhost:4200`

## API Documentation

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **H2 Console**: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:shopflow`, user: `sa`)

## Default Credentials

After running with sample data initialization:

- **Admin**: email `admin@shopflow.com`, password `admin123`
- **Seller 1**: email `seller1@shopflow.com`, password `seller123`
- **Seller 2**: email `seller2@shopflow.com`, password `seller123`

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, SELLER, CUSTOMER)
- Secure password hashing

### Product Management
- CRUD operations for products and variants
- Category management with hierarchical structure
- Product search and filtering
- Image management

### Shopping Cart
- Add/remove items
- Quantity management
- Coupon application
- Persistent cart state

### Order Management
- Place orders from cart
- Order status tracking
- Role-based order access

### Reviews & Ratings
- Customer product reviews
- Admin review approval
- Rating aggregation

### Dashboard Analytics
- Admin: System-wide statistics
- Seller: Sales and product performance
- Customer: Order history and preferences

## Project Structure

```
shopflow/
├── backend/                          # Spring Boot application
│   ├── src/main/java/com/shopflow/
│   │   ├── config/                   # Configuration classes
│   │   ├── controller/               # REST controllers
│   │   ├── dto/                      # Data transfer objects
│   │   ├── entity/                   # JPA entities
│   │   ├── exception/                # Custom exceptions
│   │   ├── mapper/                   # MapStruct mappers
│   │   ├── repository/               # JPA repositories
│   │   ├── security/                 # Security configuration
│   │   └── service/                  # Business logic
│   └── src/main/resources/
│       ├── application.yml           # Application configuration
│       └── data.sql                  # Sample data (optional)
├── frontend/                         # Angular application
│   ├── src/app/
│   │   ├── core/                     # Core services and models
│   │   ├── features/                 # Feature modules
│   │   ├── pages/                    # Page components
│   │   └── shared/                   # Shared components
│   └── environments/                 # Environment configurations
└── README.md                         # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (Seller/Admin)
- `PUT /api/products/{id}` - Update product (Seller/Admin)
- `DELETE /api/products/{id}` - Delete product (Seller/Admin)
- `GET /api/products/search` - Search products
- `GET /api/products/top-selling` - Top selling products

### Categories
- `GET /api/categories` - List categories (tree structure)
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/{id}` - Update category (Admin)
- `DELETE /api/categories/{id}` - Delete category (Admin)

### Cart
- `GET /api/cart` - Get cart (Customer)
- `POST /api/cart/items` - Add item to cart (Customer)
- `PUT /api/cart/items/{itemId}` - Update item quantity (Customer)
- `DELETE /api/cart/items/{itemId}` - Remove item (Customer)
- `POST /api/cart/coupon` - Apply coupon (Customer)
- `DELETE /api/cart/coupon` - Remove coupon (Customer)

### Orders
- `POST /api/orders` - Place order (Customer)
- `GET /api/orders/my` - Get my orders (Customer)
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/{id}` - Get order by ID
- `PUT /api/orders/{id}/status` - Update order status (Seller/Admin)
- `PUT /api/orders/{id}/cancel` - Cancel order (Customer)

### Reviews
- `POST /api/reviews` - Post review (Customer)
- `GET /api/reviews/product/{productId}` - Get product reviews
- `PUT /api/reviews/{reviewId}/approve` - Approve review (Admin)

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard
- `GET /api/dashboard/seller` - Seller dashboard
- `GET /api/dashboard/customer` - Customer dashboard

### Coupons
- `POST /api/coupons` - Create coupon (Admin)
- `PUT /api/coupons/{id}` - Update coupon (Admin)
- `DELETE /api/coupons/{id}` - Delete coupon (Admin)
- `GET /api/coupons/validate/{code}` - Validate coupon (Public)

## Development

### Running Tests

#### Backend
```bash
cd backend
./mvnw test
```

#### Frontend
```bash
cd frontend
npm test
```

### Building for Production

#### Backend
```bash
cd backend
./mvnw clean package -DskipTests
```

#### Frontend
```bash
cd frontend
npm run build --prod
```

## Configuration

### Application Properties

Key configuration in `backend/src/main/resources/application.yml`:

```yaml
spring:
  profiles:
    active: dev  # or prod
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:h2:mem:shopflow}
    username: ${SPRING_DATASOURCE_USERNAME:sa}
    password: ${SPRING_DATASOURCE_PASSWORD:}
  jpa:
    hibernate:
      ddl-auto: create-drop  # Use 'validate' in production
  security:
    jwt:
      secret: ${APP_JWT_SECRET:defaultSecretKey}
      expiration: 86400000  # 24 hours
```

### Environment Variables

For production deployment:

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/shopflow
SPRING_DATASOURCE_USERNAME=shopflow_user
SPRING_DATASOURCE_PASSWORD=secure_password

# JWT
APP_JWT_SECRET=your_very_secure_jwt_secret_key_here

# Email (if implemented)
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your_email@gmail.com
SPRING_MAIL_PASSWORD=your_app_password
```

## Security

- **JWT Tokens**: Bearer token authentication
- **Password Hashing**: BCrypt
- **CORS**: Configured for frontend origin
- **Role-based Access**: Method-level security with `@PreAuthorize`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

** using Spring Boot 3 and Angular 17**
