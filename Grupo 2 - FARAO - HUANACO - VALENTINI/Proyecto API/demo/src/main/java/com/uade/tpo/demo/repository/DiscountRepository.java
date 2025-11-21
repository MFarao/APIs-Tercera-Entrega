package com.uade.tpo.demo.repository;

import java.util.List;
import java.util.Locale.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.entity.Discount;
import com.uade.tpo.demo.entity.Product;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {

    @Query("SELECT p FROM Discount d JOIN d.product p WHERE d.id = ?1")
    List<Product> findProductsByDiscountIds(Long discountIds);

    @Query("SELECT p FROM Discount d JOIN d.product p WHERE d.id = ?1")
    List<Category> findCategoriesByDiscountIds(Long discountIds);
}
