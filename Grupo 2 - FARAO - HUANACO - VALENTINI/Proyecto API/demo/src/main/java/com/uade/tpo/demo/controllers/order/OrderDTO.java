package com.uade.tpo.demo.controllers.order;

import java.time.LocalDate;

import lombok.Data;

@Data
public class OrderDTO {
    private Long id;
    private Long idUser;
    private Long idProducto;
    private String nombreProducto;
    private int cantidadProducto;
    private double total;
    private String envio_a;
    private LocalDate fecha;
    private String status;
}