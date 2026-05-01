package com.shopflow.repository;

import com.shopflow.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

	Page<Product> findByActiveTrue(Pageable pageable);

	List<Product> findTop10ByOrderBySoldCountDesc();

	@Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%'))")
	Page<Product> searchByNameOrDescription(@Param("q") String q, Pageable pageable);

	@Query("SELECT p FROM Product p WHERE p.seller.id = :sellerId AND p.stock < 5")
	List<Product> findLowStockProductsBySeller(@Param("sellerId") Long sellerId);

}



