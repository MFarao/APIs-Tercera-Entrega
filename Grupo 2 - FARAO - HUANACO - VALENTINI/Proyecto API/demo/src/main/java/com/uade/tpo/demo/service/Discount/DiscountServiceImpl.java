package com.uade.tpo.demo.service.Discount;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.demo.entity.Discount;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.exceptions.CambioInvalidoException;
import com.uade.tpo.demo.exceptions.CategoryNoExistsException;
import com.uade.tpo.demo.exceptions.DiscountErrorCreation;
import com.uade.tpo.demo.exceptions.DiscountNotExistsException;
import com.uade.tpo.demo.exceptions.ProductNotExistsException;
import com.uade.tpo.demo.exceptions.UserNotExistsException;
import com.uade.tpo.demo.controllers.discount.DiscountDTO;
import com.uade.tpo.demo.controllers.discount.DiscountRequest;
import com.uade.tpo.demo.controllers.discount.DiscountUpdateRequest;
import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.repository.CategoryRepository;
import com.uade.tpo.demo.repository.DiscountRepository;
import com.uade.tpo.demo.repository.ProductRepository;

@Service
public class DiscountServiceImpl implements DiscountService {

    @Autowired
    private DiscountRepository discountRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    @Override
    public Page<Discount> getDiscounts(PageRequest pageRequest) {
        return discountRepo.findAll(pageRequest);
    }

    @Override
    public Optional<Discount> getDiscountById(Long discountId) {
        return discountRepo.findById(discountId);
    }
    @Transactional(rollbackFor = Throwable.class)
    public Discount createDiscount(Double percentage, LocalDate startDate, LocalDate endDate) throws DiscountErrorCreation{
        if((percentage/100)<=0||(percentage/100)>=1||startDate.isAfter(endDate)||endDate.isBefore(LocalDate.now())){
            throw new DiscountErrorCreation();
        }
        Discount d = new Discount(percentage/100,startDate,endDate);
        discountRepo.save(d);
        return d;
    } 

    @Transactional(rollbackFor = Throwable.class)
    public Discount updateDiscounts(Long discountId, DiscountUpdateRequest discountUpdateRequest)
            throws CategoryNoExistsException, DiscountNotExistsException, ProductNotExistsException {

        Discount dis = discountRepo.findById(discountId)
            .orElseThrow(DiscountNotExistsException::new);

        // Actualizar fechas si vienen
        if (discountUpdateRequest.getStartDate() != null) {
            dis.setStartDate(discountUpdateRequest.getStartDate());
        }
        if (discountUpdateRequest.getEndDate() != null) {
            dis.setEndDate(discountUpdateRequest.getEndDate());
        }

        // Actualizar porcentaje y recalcular si corresponde
        if (discountUpdateRequest.getPercentage() != null) {
            double newPercentage = discountUpdateRequest.getPercentage() / 100.0;
            if (newPercentage <= 0 || newPercentage >= 1) {
                throw new IllegalArgumentException("El porcentaje debe estar entre 1 y 99");
            }
            dis.setPercentage(newPercentage);
            applyDiscountToProducts(dis); // 🔁 recalcular productos ya asociados
        }

        // Asignar nuevas categorías
        if (discountUpdateRequest.getCategoriesId() != null && !discountUpdateRequest.getCategoriesId().isEmpty()) {
            for (Long categoryId : discountUpdateRequest.getCategoriesId()) {
                Category cat = categoryRepo.findById(categoryId)
                    .orElseThrow(CategoryNoExistsException::new);

                for (Product product : productRepo.findAllByCategoryId(categoryId)) {
                    double precioDescuento = product.getPrecio() * (1 - dis.getPercentage());
                    precioDescuento = Math.round(precioDescuento * 100.0) / 100.0;
                    product.setPrecioDescuento(precioDescuento);
                    product.setDiscount(dis);
                    productRepo.save(product);
                }

                dis.getCategory().add(cat);
                dis.setActive(true);
            }
        }

        // Asignar nuevos productos
        if (discountUpdateRequest.getProductsId() != null && !discountUpdateRequest.getProductsId().isEmpty()) {
            for (Long productId : discountUpdateRequest.getProductsId()) {
                Product pro = productRepo.findById(productId)
                    .orElseThrow(ProductNotExistsException::new);

                double precioDescuento = pro.getPrecio() * (1 - dis.getPercentage());
                precioDescuento = Math.round(precioDescuento * 100.0) / 100.0;
                pro.setPrecioDescuento(precioDescuento);
                pro.setDiscount(dis);
                productRepo.save(pro);

                dis.getProduct().add(pro);
                dis.setActive(true);
            }
        }

        discountRepo.save(dis);
        return dis;
    }

    private void applyDiscountToProducts(Discount dis) {
        if (dis.getProduct() != null) {
            for (Product product : dis.getProduct()) {
                double precioDescuento = product.getPrecio() * (1 - dis.getPercentage());
                precioDescuento = Math.round(precioDescuento * 100.0) / 100.0;
                product.setPrecioDescuento(precioDescuento);
                productRepo.save(product);
            }
        }

        if (dis.getCategory() != null) {
            for (Category category : dis.getCategory()) {
                for (Product product : productRepo.findAllByCategoryId(category.getId())) {
                    double precioDescuento = product.getPrecio() * (1 - dis.getPercentage());
                    precioDescuento = Math.round(precioDescuento * 100.0) / 100.0;
                    product.setPrecioDescuento(precioDescuento);
                    productRepo.save(product);
                }
            }
        }
    }



    @Override //Saca la relacion descuento a los productos asignados
    @Transactional(rollbackFor = Throwable.class)
    public Discount deactivateDiscount(Long discountId) throws CambioInvalidoException{
        Optional<Discount> d = discountRepo.findById(discountId);
        if(d.isEmpty()){
            throw new CambioInvalidoException();
        }
        Discount dis = d.get();
        if(dis.getActive()){
            if (dis.getCategory() != null) {
                for (Category category : dis.getCategory()) {
                    for (Product product : productRepo.findAllByCategoryId(category.getId())) { // para todos los productos de una categoria rehacemos el precio
                    product.setPrecioDescuento(null);
                    product.setDiscount(null);
                    productRepo.save(product);
                    }
                }
                
            }if (dis.getProduct() !=null) {
                for (Product product : discountRepo.findProductsByDiscountIds(discountId)) { // para todos los productos que tienen el descuento rehacemos el precio
                    product.setPrecioDescuento(null);
                    product.setDiscount(null);
                    productRepo.save(product);

                }
            }
            dis.setActive(false);
        }else {
    dis.setActive(true);

    if (dis.getCategory() != null) {
        for (Category category : dis.getCategory()) {
            for (Product product : productRepo.findAllByCategoryId(category.getId())) {
                double precioDescuento = product.getPrecio() * (1 - dis.getPercentage());
                precioDescuento = Math.round(precioDescuento * 100.0) / 100.0;
                product.setPrecioDescuento(precioDescuento);
                product.setDiscount(dis);
                productRepo.save(product);
            }
        }
    }

    if (dis.getProduct() != null) {
        for (Product product : discountRepo.findProductsByDiscountIds(discountId)) {
            double precioDescuento = product.getPrecio() * (1 - dis.getPercentage());
            precioDescuento = Math.round(precioDescuento * 100.0) / 100.0;
            product.setPrecioDescuento(precioDescuento);
            product.setDiscount(dis);
            productRepo.save(product);
        }
    }
}

        discountRepo.save(dis);
        return dis;
    }

    public DiscountDTO cargarDiscountDTO(Discount discount) {
        DiscountDTO discountDTO = new DiscountDTO();
        discountDTO.setId(discount.getId());
        discountDTO.setPercentage(discount.getPercentage() * 100);
        discountDTO.setStartDate(discount.getStartDate());
        discountDTO.setEndDate(discount.getEndDate());
        discountDTO.setActive(discount.getActive());
        return discountDTO;
    }
}
