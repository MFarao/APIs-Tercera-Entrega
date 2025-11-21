package com.uade.tpo.demo.service.Order;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.tpo.demo.controllers.order.OrderDTO;
import com.uade.tpo.demo.controllers.order.OrderStatusRequest;
import com.uade.tpo.demo.controllers.order.OrderUpdateRequest;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.exceptions.CambioInvalidoException;
import com.uade.tpo.demo.exceptions.CantidadExedenteException;
import com.uade.tpo.demo.exceptions.OrderNotExistsException;
import com.uade.tpo.demo.exceptions.ProductNotExistsException;
import com.uade.tpo.demo.exceptions.UserNotExistsException;

public interface OrderService {
    public Page<Order> getOrder(PageRequest pageRequest);

    public Optional<Order> getOrderById(Long categoryId);

    public Order createOrder(Long idUser, Long idProducto, int cantidadProducto, String envio_a) throws UserNotExistsException, ProductNotExistsException, CantidadExedenteException;

    public Order updateStatus(Long orderId, OrderStatusRequest orderStatusRequest) throws OrderNotExistsException, CambioInvalidoException;

    public OrderDTO cargarOrderDTO(Order order);

    public List<OrderDTO> getOrdersByUserId(Long userId) throws UserNotExistsException;
}