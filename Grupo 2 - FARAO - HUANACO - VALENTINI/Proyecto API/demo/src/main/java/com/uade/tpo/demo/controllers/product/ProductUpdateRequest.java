package com.uade.tpo.demo.controllers.product;

import java.util.List;

import lombok.Data;
@Data
public class ProductUpdateRequest {
    private String name;
    private String description;
    private Double price;
    private Long categoryId;
    private Integer stock;
    private List<String> imageUrls;
}
