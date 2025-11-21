package com.uade.tpo.demo.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "orders")
public class Order {
    public Order(){}

    public Order(Product product,int cantidadProducto,double total,User user,String envio_a){
        this.product = product;
        this.cantidadProducto = cantidadProducto;
        this.total = total;
        this.user = user;
        this.envio_a = envio_a;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private int cantidadProducto;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"orders"})
    private Product product;

    @Column
    private double total;

    @Column
    private String envio_a;

    @Column
    private LocalDate fecha = LocalDate.now();

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PAGO;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"order"})
    private User user;
}
