// controllers/order/OrderUpdateRequest.java
package com.uade.tpo.demo.controllers.order;

import lombok.Data;

@Data
public class OrderUpdateRequest {
    private Integer cantidadProducto;
    private String envio_a;
}
