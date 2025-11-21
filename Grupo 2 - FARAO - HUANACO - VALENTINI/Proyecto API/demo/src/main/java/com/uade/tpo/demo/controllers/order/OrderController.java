package com.uade.tpo.demo.controllers.order;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.controllers.order.OrderDTO;
import com.uade.tpo.demo.controllers.product.ProductRequest;
import com.uade.tpo.demo.controllers.user.UserDTO;
import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.exceptions.CambioInvalidoException;
import com.uade.tpo.demo.exceptions.CantidadExedenteException;
import com.uade.tpo.demo.exceptions.CategoryDuplicateException;
import com.uade.tpo.demo.exceptions.OrderNotExistsException;
import com.uade.tpo.demo.exceptions.ProductNotExistsException;
import com.uade.tpo.demo.exceptions.UserNotExistsException;
import com.uade.tpo.demo.service.Category.CategoryService;
import com.uade.tpo.demo.service.Order.OrderService;
import com.uade.tpo.demo.service.Product.ProductService;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getOrder(
        @RequestParam(required = false) Integer page,
        @RequestParam(required = false) Integer size) {

        int p = (page == null) ? 0 : page;
        int s = (size == null) ? Integer.MAX_VALUE : size;

        List<OrderDTO> dtoList = new ArrayList<>();
        for (Order order : orderService.getOrder(PageRequest.of(p, s))) {
            OrderDTO dto = orderService.cargarOrderDTO(order);
            dtoList.add(dto);
        }

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        Optional<Order> result = orderService.getOrderById(orderId);
        if (result.isPresent()){
            OrderDTO dto = orderService.cargarOrderDTO(result.get());
            return ResponseEntity.ok(dto);
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByUserId(@PathVariable Long userId) throws UserNotExistsException {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }
    

    @PostMapping
    public ResponseEntity<Object> createOrder(@RequestBody OrderRequest orderRequest)
            throws UserNotExistsException, ProductNotExistsException, CantidadExedenteException {
        Order result = orderService.createOrder(orderRequest.getIdUser(),orderRequest.getIdProducto(),orderRequest.getCantidadProducto(),orderRequest.getEnvio_a());
        return ResponseEntity.created(URI.create("/order/" + result.getId())).body(result);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateStatus(@PathVariable Long orderId,@RequestBody OrderStatusRequest orderStatusRequest) throws OrderNotExistsException, CambioInvalidoException {
        Order updated = orderService.updateStatus(orderId, orderStatusRequest);
        OrderDTO dto = orderService.cargarOrderDTO(updated);
        return ResponseEntity.ok(dto);
    }
}
