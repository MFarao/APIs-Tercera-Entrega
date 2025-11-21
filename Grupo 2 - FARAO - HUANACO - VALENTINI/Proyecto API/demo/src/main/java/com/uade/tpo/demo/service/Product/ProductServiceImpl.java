package com.uade.tpo.demo.service.Product;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.demo.controllers.order.OrderUpdateRequest;
import com.uade.tpo.demo.controllers.product.ProductDTO;
import com.uade.tpo.demo.controllers.product.ProductImageRequest;
import com.uade.tpo.demo.controllers.product.ProductRequest;
import com.uade.tpo.demo.controllers.product.ProductUpdateRequest;
import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.exceptions.CategoryDuplicateException;
import com.uade.tpo.demo.exceptions.CategoryNoExistsException;
import com.uade.tpo.demo.exceptions.ProductNotExistsException;
import com.uade.tpo.demo.repository.CategoryRepository;
import com.uade.tpo.demo.repository.OrderRepository;
import com.uade.tpo.demo.repository.ProductRepository;


@Service
public class ProductServiceImpl implements ProductService{

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Page<Product> getProduct(PageRequest pageRequest) {
        return productRepository.findAll(pageRequest);
    }

    @Override
    public Optional<Product> getProductById(Long productId) {
       return productRepository.findById(productId);
    }

    @Override
    public List<Product> getProductByName(String name) {
        return productRepository.findAllByName(name);
        
    }
    @Override
    public List<Product> getProductByDescription(String description) {
        return productRepository.findAllByDescription(description);
        
    }

    @Override
    public List<Product> getProductByPrecioMayorQue(Double precio) {
        List<Product> lista = new ArrayList<Product>();
        for (Product product : productRepository.findAllByPrecioMayorQue(precio)) {
            if (product.getPrecioDescuento() != null) {
                if (product.getPrecioDescuento() >= precio // vemos si matcheo por precio descuento y chequeamos el rango de fechas del Discount
                 &&  (LocalDate.now().isAfter(product.getDiscount().getStartDate()) || LocalDate.now().isEqual(product.getDiscount().getStartDate())) //hoy es despues de la fecha de inicio o igual
                 &&  (LocalDate.now().isBefore(product.getDiscount().getEndDate())) || LocalDate.now().isEqual(product.getDiscount().getEndDate()))  //hoy es antes de la fecha final o igual
                {
                    lista.add(product);
                }
            }else{
                lista.add(product); // agregamos porq no tiene descuento seteado
            }
        }
        return lista;
    } 

     @Override
    public List<Product> getProductByPrecioMenorQue(Double precio) {
        List<Product> lista = new ArrayList<Product>();
        for (Product product : productRepository.findAllByPrecioMenorQue(precio)) {
            if (product.getPrecioDescuento() != null) {
                if (product.getPrecioDescuento() <= precio // vemos si matcheo por precio descuento y chequeamos el rango de fechas del Discount
                 &&  (LocalDate.now().isAfter(product.getDiscount().getStartDate()) || LocalDate.now().isEqual(product.getDiscount().getStartDate())) //hoy es despues de la fecha de inicio o igual
                 &&  (LocalDate.now().isBefore(product.getDiscount().getEndDate())) || LocalDate.now().isEqual(product.getDiscount().getEndDate()))  //hoy es antes de la fecha final o igual
                {
                    lista.add(product);
                }
            }else{
                lista.add(product); // agregamos porq no tiene descuento seteado
            }
        }
        return lista;
    } 

    @Transactional(rollbackFor = Throwable.class)
    public Product createProduct(ProductRequest productRequest) throws CategoryNoExistsException {
        if (productRequest.getCategoryId() != null) { // chequeamos si se creo con categoria
            Optional<Category> category = categoryRepository.findById(productRequest.getCategoryId());
            if (category.isEmpty()) {
                throw new CategoryNoExistsException(); // si no existe la categoria q no deje crear el producto
            }
            Product p = new Product(productRequest.getName(),productRequest.getDescription(),productRequest.getImageUrls(),productRequest.getPrice(),productRequest.getStock(),category.get());
            productRepository.save(p);
            return p;
        }else{
        Product p = new Product(productRequest.getName(),productRequest.getDescription(),productRequest.getImageUrls(),productRequest.getPrice(),productRequest.getStock(),null);
        productRepository.save(p);
        return p;}
    }

    @Transactional(rollbackFor = Throwable.class)
    public Product updateProduct(Long productId, ProductUpdateRequest productUpdateRequest) throws ProductNotExistsException {
        Optional<Product> products = productRepository.findById(productId);
        if (products.isPresent()) {
            Product product = products.get();
            if (productUpdateRequest.getDescription() != null) {
                product.setDescription(productUpdateRequest.getDescription());   
            }
            if (productUpdateRequest.getName() != null) {
                product.setName(productUpdateRequest.getName());
            }
            if (productUpdateRequest.getCategoryId() != null && categoryRepository.existsById(productUpdateRequest.getCategoryId())) {
                Optional<Category> c = categoryRepository.findById(productUpdateRequest.getCategoryId());
                product.setCategory(c.get());
            }
            if (productUpdateRequest.getPrice() != null && productUpdateRequest.getPrice() > 0) {
                if (product.getPrecioDescuento() != null && product.getDiscount() != null) { // si tiene descuento recalculamos el precio descuento
                    product.setPrecio(productUpdateRequest.getPrice());
                    product.setPrecioDescuento(product.getPrecio() * product.getDiscount().getPercentage()); 
                }else{
                    product.setPrecio(productUpdateRequest.getPrice());
                }
            }
            if (productUpdateRequest.getStock() != null && productUpdateRequest.getStock() >= 0){
                product.setStock(productUpdateRequest.getStock());
                if(product.getStock()==0 && product.isActivo()){ // si el stock es 0 y esta activo, lo desactivamos
                    product.setActivo(false);
                }
                if(product.getStock()>=0 && !product.isActivo()){ // si el stock es mayor a 0 y esta desactivado, lo activamos
                    product.setActivo(true);
                }
            }if (productUpdateRequest.getImageUrls() != null) {
                product.setImageUrls(new ArrayList<>(productUpdateRequest.getImageUrls())); // si tiene imagenes setea un nuevo array con las mismas pisando el anterior
            }
            productRepository.save(product);
            return product;
        }
        throw new ProductNotExistsException();
    }

    @Transactional(rollbackFor = Throwable.class)
    public Product agregarImagenes(Long productId, ProductImageRequest productImageRequest) throws ProductNotExistsException {
         Optional<Product> products = productRepository.findById(productId);
        if (products.isPresent()) {
            Product product = products.get();
            List<String> images = productRepository.findImageUrlsByProductId(productId);
            
            if (productImageRequest.getUrl() != null) {
                
                images.add(productImageRequest.getUrl());

            }
            else if (productImageRequest.getUrls() != null) {

                for (String url : productImageRequest.getUrls()) {
                images.add(url);
                }
            }
            product.setImageUrls(images);
            productRepository.save(product);
            return product;
        }throw new ProductNotExistsException();
    }

    @Transactional(rollbackFor = Throwable.class)
    public Product eliminarImagenes(Long productId,ProductImageRequest productImageRequest) throws ProductNotExistsException {
        Optional<Product> products = productRepository.findById(productId);
        if (products.isPresent()) {
            Product product = products.get();
            List<String> images = productRepository.findImageUrlsByProductId(productId);
            
            if (productImageRequest.getUrl() != null ) {

                images.remove(productImageRequest.getUrl());

            }
            else if (productImageRequest.getUrls() != null) {

                for (String url : productImageRequest.getUrls()) {
                images.remove(url);
                }
            }
            product.setImageUrls(images);
            productRepository.save(product);
            return product;
        }throw new ProductNotExistsException();
    }

    @Transactional(rollbackFor = Throwable.class) // si el producto esta activo inactiva el producto y cancela sus ordenes. Si esta inactivo, lo contrario
    public Product in_activarProductoById(Long productId) throws ProductNotExistsException {
        if (productRepository.existsById(productId)) {
            Product product = productRepository.findById(productId).get();
            if(product.isActivo()){
                productRepository.inactivarProductoById(productId);
            }
            if (!product.isActivo()) {
                productRepository.activarProductoById(productId);
            }
            productRepository.save(product);
            return product;
        }throw new ProductNotExistsException();
    }

    public boolean tieneDescuento(Long productId){
        Optional<Product> product = productRepository.findById(productId);
        if (product.isPresent()) {
            Product p = product.get();
            if (p.getPrecioDescuento() != null && p.getDiscount() != null // si tiene descuento y esta dentro de las fechas validas
             &&  (LocalDate.now().isAfter(p.getDiscount().getStartDate()) || LocalDate.now().isEqual(p.getDiscount().getStartDate())) //hoy es despues de la fecha de inicio o igual
             &&  (LocalDate.now().isBefore(p.getDiscount().getEndDate()) || LocalDate.now().isEqual(p.getDiscount().getEndDate())) )  //hoy es antes de la fecha final o igual
            {
                return true;
            }
        }
        return false;
    }

    

    public ProductDTO cargarProductDTO(Product product){
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        if(product.getCategory() != null){
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getDescription());
        }else{
             dto.setCategoryId(null);
             dto.setCategoryName(null);
        }
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrecio());
        dto.setStock(product.getStock());
        dto.setImageUrls(product.getImageUrls());
        dto.setActive(product.isActivo());
        if (tieneDescuento(product.getId()) && product.getDiscount() != null) {
            dto.setPriceDescuento(product.getPrecioDescuento());
            dto.setDiscountEndDate(product.getDiscount().getEndDate());
        }
        else{
            dto.setPriceDescuento(null);
            dto.setDiscountEndDate(null);
        }
        return dto;
    }
}
