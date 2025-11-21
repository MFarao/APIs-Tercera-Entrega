package com.uade.tpo.demo.controllers.product;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;
@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Double priceDescuento;
    private LocalDate discountEndDate;
    private Long categoryId;
    private String categoryName;
    private List<String> imageUrls; // URLs de las imágenes
    private Integer stock;
    private Boolean active;
}
