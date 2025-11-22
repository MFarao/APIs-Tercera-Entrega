package com.uade.tpo.demo.controllers.order;

import java.util.List;

import lombok.Data;

@Data
public class OrdersRequest {
    private List<OrderRequest> ordenes;
}
