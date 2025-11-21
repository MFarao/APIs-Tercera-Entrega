package com.uade.tpo.demo.entity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class Discount {
    public Discount() {
    }

    public Discount(Double percentage, LocalDate startDate, LocalDate endDate) {
        this.percentage = percentage;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación opcional: si aplica a un producto específico
    @OneToMany(mappedBy = "discount")
    @JsonIgnoreProperties({"discount"})
    private List<Product> product;

    // Varias categorias pueden tener el mismo descuento
    @OneToMany(mappedBy = "discount")
    @JsonIgnoreProperties({"discount"})
    private List<Category> category;

    private Double percentage; // 0.10 = 10%
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean active = true;
}