package com.uade.tpo.demo.controllers.order;

import lombok.Data;

@Data
public class OrderRequest {
    private Long idUser;
    private Long idProducto;
    private int cantidadProducto;
    private String envio_a;
}
