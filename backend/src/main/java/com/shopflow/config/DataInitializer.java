package com.shopflow.config;

import com.shopflow.entity.*;
import com.shopflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SellerProfileRepository sellerProfileRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        // Create Admin
        User admin = User.builder()
                .email("admin@shopflow.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .active(true)
                .build();
        userRepository.save(admin);

        // Create Sellers
        User seller1 = User.builder()
                .email("seller1@shopflow.com")
                .password(passwordEncoder.encode("seller123"))
                .role(Role.SELLER)
                .active(true)
                .build();
        userRepository.save(seller1);

        SellerProfile seller1Profile = SellerProfile.builder()
                .user(seller1)
                .businessName("TechHub Electronics")
                .description("Premium electronics and gadgets")
                .phone("+1-555-0101")
                .address("123 Tech Street, Silicon Valley, CA")
                .build();
        sellerProfileRepository.save(seller1Profile);

        User seller2 = User.builder()
                .email("seller2@shopflow.com")
                .password(passwordEncoder.encode("seller123"))
                .role(Role.SELLER)
                .active(true)
                .build();
        userRepository.save(seller2);

        SellerProfile seller2Profile = SellerProfile.builder()
                .user(seller2)
                .businessName("Fashion Forward")
                .description("Trendy clothing and accessories")
                .phone("+1-555-0102")
                .address("456 Fashion Ave, New York, NY")
                .build();
        sellerProfileRepository.save(seller2Profile);

        // Create Categories
        Category electronics = Category.builder()
                .name("Electronics")
                .description("Electronic devices and accessories")
                .build();
        categoryRepository.save(electronics);

        Category clothing = Category.builder()
                .name("Clothing")
                .description("Fashion and apparel")
                .build();
        categoryRepository.save(clothing);

        Category smartphones = Category.builder()
                .name("Smartphones")
                .description("Mobile phones and accessories")
                .parent(electronics)
                .build();
        categoryRepository.save(smartphones);

        // Create Products with Variants
        // Product 1: iPhone 15
        Product iphone15 = Product.builder()
                .name("iPhone 15")
                .description("Latest iPhone with advanced features")
                .seller(seller1Profile)
                .price(new BigDecimal("999.99"))
                .stock(50)
                .active(true)
                .build();
        iphone15.getCategories().add(smartphones);
        productRepository.save(iphone15);

        ProductVariant iphone15Black = ProductVariant.builder()
                .product(iphone15)
                .attribute("Color")
                .value("Black")
                .extraStock(25)
                .build();
        productVariantRepository.save(iphone15Black);

        ProductVariant iphone15White = ProductVariant.builder()
                .product(iphone15)
                .attribute("Color")
                .value("White")
                .extraStock(25)
                .build();
        productVariantRepository.save(iphone15White);

        // Product 2: MacBook Pro
        Product macbook = Product.builder()
                .name("MacBook Pro 16\"")
                .description("Professional laptop for creators")
                .seller(seller1Profile)
                .price(new BigDecimal("2499.99"))
                .stock(20)
                .active(true)
                .build();
        macbook.getCategories().add(electronics);
        productRepository.save(macbook);

        ProductVariant macbookVariant = ProductVariant.builder()
                .product(macbook)
                .attribute("Model")
                .value("M3 Pro")
                .extraStock(20)
                .build();
        productVariantRepository.save(macbookVariant);

        // Product 3: T-Shirt
        Product tshirt = Product.builder()
                .name("Cotton T-Shirt")
                .description("Comfortable cotton t-shirt")
                .seller(seller2Profile)
                .price(new BigDecimal("19.99"))
                .stock(100)
                .active(true)
                .build();
        tshirt.getCategories().add(clothing);
        productRepository.save(tshirt);

        ProductVariant tshirtSmall = ProductVariant.builder()
                .product(tshirt)
                .attribute("Size")
                .value("Small")
                .extraStock(25)
                .build();
        productVariantRepository.save(tshirtSmall);

        ProductVariant tshirtMedium = ProductVariant.builder()
                .product(tshirt)
                .attribute("Size")
                .value("Medium")
                .extraStock(50)
                .build();
        productVariantRepository.save(tshirtMedium);

        ProductVariant tshirtLarge = ProductVariant.builder()
                .product(tshirt)
                .attribute("Size")
                .value("Large")
                .extraStock(25)
                .build();
        productVariantRepository.save(tshirtLarge);

        // Product 4: Wireless Headphones
        Product headphones = Product.builder()
                .name("Wireless Headphones")
                .description("High-quality wireless headphones")
                .seller(seller1Profile)
                .price(new BigDecimal("149.99"))
                .stock(75)
                .active(true)
                .build();
        headphones.getCategories().add(electronics);
        productRepository.save(headphones);

        ProductVariant headphonesVariant = ProductVariant.builder()
                .product(headphones)
                .attribute("Color")
                .value("Black")
                .extraStock(75)
                .build();
        productVariantRepository.save(headphonesVariant);

        // Product 5: Jeans
        Product jeans = Product.builder()
                .name("Slim Fit Jeans")
                .description("Stylish slim fit jeans")
                .seller(seller2Profile)
                .price(new BigDecimal("79.99"))
                .stock(75)
                .active(true)
                .build();
        jeans.getCategories().add(clothing);
        productRepository.save(jeans);

        ProductVariant jeans32 = ProductVariant.builder()
                .product(jeans)
                .attribute("Size")
                .value("32")
                .extraStock(40)
                .build();
        productVariantRepository.save(jeans32);

        ProductVariant jeans34 = ProductVariant.builder()
                .product(jeans)
                .attribute("Size")
                .value("34")
                .extraStock(35)
                .build();
        productVariantRepository.save(jeans34);

        // Create Coupons
        Coupon welcomeCoupon = Coupon.builder()
                .code("WELCOME10")
                .type(CouponType.PERCENT)
                .value(new BigDecimal("10.00"))
                .maxUsages(100)
                .active(true)
                .expiresAt(LocalDateTime.now().plusMonths(6))
                .build();
        couponRepository.save(welcomeCoupon);

        Coupon saveCoupon = Coupon.builder()
                .code("SAVE20")
                .type(CouponType.FIXED)
                .value(new BigDecimal("20.00"))
                .maxUsages(50)
                .active(true)
                .expiresAt(LocalDateTime.now().plusMonths(3))
                .build();
        couponRepository.save(saveCoupon);

        System.out.println("Sample data initialized successfully!");
        System.out.println("Admin credentials: admin@shopflow.com / admin123");
        System.out.println("Seller1 credentials: seller1@shopflow.com / seller123");
        System.out.println("Seller2 credentials: seller2@shopflow.com / seller123");
    }
}
