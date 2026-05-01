package com.shopflow.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI shopflowOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("ShopFlow API")
                        .version("1.0")
                        .description("ShopFlow e-commerce backend API"))
                .servers(java.util.List.of(new Server().url("http://localhost:8080")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")))
                .security(java.util.List.of(new SecurityRequirement().addList("bearerAuth")));
    }
}
