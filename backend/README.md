# ShopFlow - Backend

This module contains the ShopFlow e-commerce backend (Spring Boot 3 / Java 21 / Maven).

Features included in this skeleton:
- Java 21, Maven
- Spring Boot starter dependencies: web, data-jpa, security, validation
- JWT authentication (jjwt 0.11.5)
- MapStruct mapper
- SpringDoc OpenAPI UI
- H2 (dev) and PostgreSQL (prod) profiles

Getting started (development / H2):

1. Build

```powershell
mvn -f backend clean package
```

2. Run (dev profile uses H2 in-memory database and is default)

```powershell
mvn -f backend spring-boot:run
```

3. API docs

Open http://localhost:8080/swagger-ui.html or http://localhost:8080/swagger-ui/index.html

4. H2 console

Open http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:shopflow`, user: `sa`)

Authentication (demo):
- A default in-memory user is configured: username `user`, password `password`.
- Obtain a token:

```powershell
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"username":"user","password":"password"}'
```

The response will contain a JWT token. Use it in Authorization header: `Authorization: Bearer <token>`.

Running with PostgreSQL (production profile):

Set environment variables or edit `application.yml`:

- SPRING_DATASOURCE_URL (e.g. jdbc:postgresql://localhost:5432/shopflow)
- SPRING_DATASOURCE_USERNAME
- SPRING_DATASOURCE_PASSWORD
- APP_JWT_SECRET

Then run with `prod` profile:

```powershell
mvn -f backend spring-boot:run -Dspring-boot.run.profiles=prod
```

Notes:
- Replace the JWT secret before deploying to production.
- This is a minimal skeleton to jump-start development; expand user management, roles, tests and other production concerns as needed.

