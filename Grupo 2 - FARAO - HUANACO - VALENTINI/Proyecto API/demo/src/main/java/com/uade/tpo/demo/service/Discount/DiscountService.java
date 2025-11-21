package com.uade.tpo.demo.service.Discount;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.uade.tpo.demo.controllers.discount.DiscountDTO;
import com.uade.tpo.demo.controllers.discount.DiscountRequest;
import com.uade.tpo.demo.controllers.discount.DiscountUpdateRequest;
import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Discount;
import com.uade.tpo.demo.exceptions.CambioInvalidoException;
import com.uade.tpo.demo.exceptions.CategoryDuplicateException;
import com.uade.tpo.demo.exceptions.CategoryNoExistsException;
import com.uade.tpo.demo.exceptions.DiscountErrorCreation;
import com.uade.tpo.demo.exceptions.DiscountNotExistsException;
import com.uade.tpo.demo.exceptions.ProductNotExistsException;

public interface DiscountService {
    public Page<Discount> getDiscounts(PageRequest pageRequest);

    public Optional<Discount> getDiscountById(Long discountId);

    public Discount createDiscount(Double percentage, LocalDate startDate, LocalDate endDate) throws ProductNotExistsException, CategoryNoExistsException, DiscountErrorCreation;

    public Discount updateDiscounts(Long discountId, DiscountUpdateRequest discountUpdateRequest) throws CategoryNoExistsException, DiscountNotExistsException, ProductNotExistsException;

    public Discount deactivateDiscount(Long discountId) throws CambioInvalidoException;

    public DiscountDTO cargarDiscountDTO(Discount discount);
}
