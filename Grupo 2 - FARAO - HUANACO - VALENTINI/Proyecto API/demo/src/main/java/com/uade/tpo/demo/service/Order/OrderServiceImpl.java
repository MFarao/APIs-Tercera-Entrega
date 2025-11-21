package com.uade.tpo.demo.service.Order;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import com.uade.tpo.demo.service.Product.ProductServiceImpl;
import org.hibernate.query.results.complete.CompleteResultBuilderBasicValuedConverted;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.controllers.order.OrderDTO;
import com.uade.tpo.demo.controllers.order.OrderStatusRequest;
import com.uade.tpo.demo.controllers.order.OrderUpdateRequest;
import com.uade.tpo.demo.controllers.product.ProductController;
import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.OrderStatus;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.exceptions.CambioInvalidoException;
import com.uade.tpo.demo.exceptions.CantidadExedenteException;
import com.uade.tpo.demo.exceptions.OrderNotExistsException;
import com.uade.tpo.demo.exceptions.ProductNotExistsException;
import com.uade.tpo.demo.exceptions.UserNotExistsException;
import com.uade.tpo.demo.repository.CategoryRepository;
import com.uade.tpo.demo.repository.OrderRepository;
import com.uade.tpo.demo.repository.ProductRepository;
import com.uade.tpo.demo.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderServiceImpl implements OrderService{

    @Autowired
    private ProductController productController;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderRepository orderRepository;


    @Override
    public Page<Order> getOrder(PageRequest pageRequest) {
        return orderRepository.findAll(pageRequest);
    }

    @Override
    public Optional<Order> getOrderById(Long categoryId) {
        return orderRepository.findById(categoryId);
    }

    @Transactional(rollbackFor = Throwable.class)
    public Order createOrder(Long idUser, Long idProducto, int cantidadProducto, String envio_a) throws UserNotExistsException,ProductNotExistsException, CantidadExedenteException{
        Optional<User> user = userRepository.findById(idUser);
        Optional<Product> product = productRepository.findById(idProducto);

        if (user.isEmpty()) {
            throw new UserNotExistsException();
        }
        if (product.isEmpty()) {
            throw new ProductNotExistsException();
        }
        Product p = product.get();
        if(p.getStock() < cantidadProducto){
            throw new CantidadExedenteException();
        }if (p.getStock() == cantidadProducto) {
            productController.in_activarProductoById(idProducto);
        }
        Order order; //Para hacer el return de orden
        if (p.getPrecioDescuento() != null && p.getDiscount() != null &&
        ((LocalDate.now().isAfter(p.getDiscount().getStartDate()) || LocalDate.now().isEqual(p.getDiscount().getStartDate())) &&
        (LocalDate.now().isBefore(p.getDiscount().getEndDate()) || LocalDate.now().isEqual(p.getDiscount().getEndDate()))))  //hoy es antes de la fecha final o igual
         {
            p.setStock(p.getStock() - cantidadProducto); // actualizamos Stock y calculamos el total con el precioDescuento
            order = new Order(p,cantidadProducto,cantidadProducto * p.getPrecioDescuento(),user.get(),envio_a);
            orderRepository.save(order);
            return order;
        }else{
            p.setStock(p.getStock() - cantidadProducto); // actualizamos Stock y calculamos el total con el precioBase
            order = new Order(p,cantidadProducto,cantidadProducto * p.getPrecio(),user.get(),envio_a);
            orderRepository.save(order);
            return order;
        }
    }

    @Transactional(rollbackFor = Throwable.class)
    public Order updateStatus(Long orderId, OrderStatusRequest orderStatusRequest) throws OrderNotExistsException, CambioInvalidoException {
        Optional<Order> order = orderRepository.findById(orderId);
        OrderStatus estadoReq = OrderStatus.valueOf(orderStatusRequest.getStatus().toUpperCase().trim());
        boolean valido = false;
        if(!order.isPresent()){
            throw new OrderNotExistsException();
        }
        Order orden = order.get();
        OrderStatus estadoOrden = orden.getStatus();
        if (estadoOrden == OrderStatus.PAGO && estadoReq == OrderStatus.PREPARANDO) {
            orden.setStatus(estadoReq);
            valido = true;
        }
        if (estadoOrden == OrderStatus.PREPARANDO && estadoReq == OrderStatus.ENVIADO) {
            orden.setStatus(estadoReq);
            valido = true;
        }
        if (estadoOrden == OrderStatus.ENVIADO && estadoReq == OrderStatus.ENTREGADO) {
            orden.setStatus(estadoReq);
            valido = true;
        }if (valido) {
            orderRepository.save(orden);
            return orden;
        }
        throw new CambioInvalidoException();
    }

    public OrderDTO cargarOrderDTO(Order order){
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setIdUser(order.getUser().getId());
        dto.setIdProducto(order.getProduct().getId());
        dto.setCantidadProducto(order.getCantidadProducto());
        dto.setEnvio_a(order.getEnvio_a());
        dto.setNombreProducto(order.getProduct().getName());
        dto.setTotal(order.getTotal());
        dto.setFecha(order.getFecha());
        dto.setStatus(order.getStatus().name());
        return dto;
    }

    public List<OrderDTO> getOrdersByUserId(Long userId) throws UserNotExistsException {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new UserNotExistsException();
        }
        List<Order> orders = orderRepository.findAllByUserId(userId);
        List<OrderDTO> dtoList = new java.util.ArrayList<>();
        for (Order order : orders) {
            OrderDTO dto = cargarOrderDTO(order);
            dtoList.add(dto);
        }
        return dtoList;
    }
}
