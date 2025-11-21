package com.uade.tpo.demo.controllers.product;

import java.util.List;

import lombok.Data;
@Data
public class ProductImageRequest {
    private String url;
    private List<String> urls;
}
