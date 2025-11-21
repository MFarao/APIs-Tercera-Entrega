package com.uade.tpo.demo.controllers.product;

import java.util.List;

import lombok.Data;
@Data
public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private Long categoryId;
    private List<String> imageUrls; // URLs de las imágenes
    private Integer stock;
}
