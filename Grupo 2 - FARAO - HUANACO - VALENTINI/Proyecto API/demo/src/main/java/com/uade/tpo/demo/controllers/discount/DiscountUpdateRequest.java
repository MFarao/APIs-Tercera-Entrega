package com.uade.tpo.demo.controllers.discount;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class DiscountUpdateRequest {
    private List<Long> productsId;
    private List<Long> categoriesId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double percentage; // en formato 10.0 para 10%
}

