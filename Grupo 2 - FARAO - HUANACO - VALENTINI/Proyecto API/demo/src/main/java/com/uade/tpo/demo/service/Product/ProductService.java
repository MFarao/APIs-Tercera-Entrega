package com.uade.tpo.demo.service.Product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.uade.tpo.demo.controllers.order.OrderUpdateRequest;
import com.uade.tpo.demo.controllers.product.ProductDTO;
import com.uade.tpo.demo.controllers.product.ProductImageRequest;
import com.uade.tpo.demo.controllers.product.ProductRequest;
import com.uade.tpo.demo.controllers.product.ProductUpdateRequest;
import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.exceptions.CategoryNoExistsException;
import com.uade.tpo.demo.exceptions.ProductNotExistsException;

public interface ProductService {
    public Page<Product> getProduct(PageRequest pageRequest);

    public Optional<Product> getProductById(Long productId);

    public List<Product> getProductByName(String name);

    public List<Product> getProductByDescription(String description);

    public List<Product> getProductByPrecioMayorQue(Double precio);

    public List<Product> getProductByPrecioMenorQue(Double precio);

    public Product createProduct(ProductRequest productRequest) throws CategoryNoExistsException;

    public Product updateProduct(Long productId, ProductUpdateRequest productUpdateRequest) throws ProductNotExistsException;

    public Product agregarImagenes(Long productId, ProductImageRequest productImageRequest) throws ProductNotExistsException;

    public Product eliminarImagenes(Long productId, ProductImageRequest productImageRequest) throws ProductNotExistsException;

    public Product in_activarProductoById(Long productId) throws ProductNotExistsException;
    
    public boolean tieneDescuento(Long productId);

    public ProductDTO cargarProductDTO(Product product);
} 