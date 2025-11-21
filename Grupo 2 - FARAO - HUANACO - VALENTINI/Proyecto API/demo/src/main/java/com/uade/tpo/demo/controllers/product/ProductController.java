package com.uade.tpo.demo.controllers.product;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.controllers.order.OrderUpdateRequest;
import com.uade.tpo.demo.controllers.user.UserDTO;
import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.exceptions.CantidadExedenteException;
import com.uade.tpo.demo.exceptions.CategoryDuplicateException;
import com.uade.tpo.demo.exceptions.CategoryNoExistsException;
import com.uade.tpo.demo.exceptions.OrderNotExistsException;
import com.uade.tpo.demo.exceptions.ProductNotExistsException;
import com.uade.tpo.demo.service.Category.CategoryService;
import com.uade.tpo.demo.service.Product.ProductService;

import java.net.URI;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getProduct(
        @RequestParam(required = false) Integer page,
        @RequestParam(required = false) Integer size) {

        int p = (page == null) ? 0 : page;
        int s = (size == null) ? Integer.MAX_VALUE : size;

        List<ProductDTO> dtoList = new ArrayList<>();
        for (Product product : productService.getProduct(PageRequest.of(p, s))) {
            ProductDTO dto = productService.cargarProductDTO(product);
            dtoList.add(dto);
        }

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long productId) {
        Optional<Product> result = productService.getProductById(productId);
        if (result.isPresent()){
            Product product = result.get();
            return ResponseEntity.ok(productService.cargarProductDTO(product));
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<ProductDTO>> getProductByName(@PathVariable String name) {
        List<ProductDTO> dtoList = new ArrayList<>();
        for (Product p : productService.getProductByName(name)) {
            dtoList.add(productService.cargarProductDTO(p));
        }
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/description/{description}")
    public ResponseEntity<List<ProductDTO>> getProductByDescription(@PathVariable String description) {
         List<ProductDTO> dtoList = new ArrayList<>();
        for (Product p : productService.getProductByDescription(description)) {
            dtoList.add(productService.cargarProductDTO(p));
        }
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/mayor_que/{precio}")
    public ResponseEntity<List<ProductDTO>> getProductByPrecioMayorQue(@PathVariable Double precio) {
        List<ProductDTO> dtoList = new ArrayList<>();
        for (Product p : productService.getProductByPrecioMayorQue(precio)) {
            dtoList.add(productService.cargarProductDTO(p));
        }
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/menor_que/{precio}")
    public ResponseEntity<List<ProductDTO>> getProductByPrecioMenorQue(@PathVariable Double precio) {
        List<ProductDTO> dtoList = new ArrayList<>();
        for (Product p : productService.getProductByPrecioMenorQue(precio)) {
            dtoList.add(productService.cargarProductDTO(p));
        }
        return ResponseEntity.ok(dtoList);
    }

    @PostMapping
    public ResponseEntity<Object> createProduct(@RequestBody ProductRequest productRequest)
            throws CategoryNoExistsException {
        Product result = productService.createProduct(productRequest);
        return ResponseEntity.created(URI.create("/product/" + result.getId())).body(result);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long productId,@RequestBody ProductUpdateRequest productUpdateRequest) throws ProductNotExistsException {
        Product updated = productService.updateProduct(productId, productUpdateRequest);
        return ResponseEntity.ok(productService.cargarProductDTO(updated));
    }

    @PutMapping("/{productId}/agregarImagenes")
    public ResponseEntity<ProductDTO> agregarImagenes(@PathVariable Long productId, @RequestBody ProductImageRequest productImageRequest) throws ProductNotExistsException {
        Product updated = productService.agregarImagenes(productId, productImageRequest);
        return ResponseEntity.ok(productService.cargarProductDTO(updated));
    }

    @PutMapping("/{productId}/eliminarImagenes")
    public ResponseEntity<ProductDTO> eliminarImagenes(@PathVariable Long productId, @RequestBody ProductImageRequest productImageRequest) throws ProductNotExistsException {
        Product updated = productService.eliminarImagenes(productId, productImageRequest);
        return ResponseEntity.ok(productService.cargarProductDTO(updated));
    }
    
    @PutMapping("/{productId}/in_activar")
    public ResponseEntity<ProductDTO> in_activarProductoById(@PathVariable Long productId) throws ProductNotExistsException {
        Product updated = productService.in_activarProductoById(productId);
        return ResponseEntity.ok(productService.cargarProductDTO(updated));
    } 
}   
