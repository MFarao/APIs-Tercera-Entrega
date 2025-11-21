package com.uade.tpo.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{

    @Query(value = "select pi.image_url from product_images pi where pi.product_id = ?1 order by pi.position", nativeQuery = true)
    List<String> findImageUrlsByProductId(Long productoId); // nos traemos todas las fotos desde product images

    @Modifying
    @Query(value = "update product set activo = false where id = ?1", nativeQuery = true)
    void inactivarProductoById(Long productoId);

    @Modifying
    @Query(value = "update product set activo = true where id = ?1", nativeQuery = true)
    void activarProductoById(Long productoId);

    @Query(value = "select p from Product p where p.category.id = ?1")
    List<Product> findAllByCategoryId(Long categoryId);

    @Query("select p from Product p where lower(p.name) like lower(concat('%', ?1, '%'))")
    List<Product> findAllByName(String name);

    @Query("select p from Product p where lower(p.description) like lower(concat('%', ?1, '%'))")
    List<Product> findAllByDescription(String description);

    @Query(value = "select p from Product p where p.precio >= ?1 or p.precioDescuento >= ?1")
    List<Product> findAllByPrecioMayorQue(Double precio);

    @Query(value = "select p from Product p where p.precio <= ?1 or p.precioDescuento <= ?1")
    List<Product> findAllByPrecioMenorQue(Double precio);
}
