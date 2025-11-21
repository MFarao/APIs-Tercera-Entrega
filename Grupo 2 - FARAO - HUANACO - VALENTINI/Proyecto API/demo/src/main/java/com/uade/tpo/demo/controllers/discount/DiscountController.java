package com.uade.tpo.demo.controllers.discount;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.controllers.categories.CategoryDTO;
import com.uade.tpo.demo.controllers.categories.CategoryRequest;
import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Discount;
import com.uade.tpo.demo.exceptions.CambioInvalidoException;
import com.uade.tpo.demo.exceptions.CategoryDuplicateException;
import com.uade.tpo.demo.exceptions.CategoryNoExistsException;
import com.uade.tpo.demo.exceptions.DiscountErrorCreation;
import com.uade.tpo.demo.exceptions.DiscountNotExistsException;
import com.uade.tpo.demo.exceptions.ProductNotExistsException;
import com.uade.tpo.demo.service.Discount.DiscountService;

@RestController
@RequestMapping("discounts")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    @GetMapping
    public ResponseEntity<List<DiscountDTO>> getDiscounts(
        @RequestParam(required = false) Integer page,
        @RequestParam(required = false) Integer size) {

        int p = (page == null) ? 0 : page;
        int s = (size == null) ? Integer.MAX_VALUE : size;

        List<DiscountDTO> dtoList = new ArrayList<>();
        for (Discount discount : discountService.getDiscounts(PageRequest.of(p, s))) {
            DiscountDTO dto = discountService.cargarDiscountDTO(discount);
            dtoList.add(dto);
        }

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{discountId}")
    public ResponseEntity<DiscountDTO> getDiscountById(@PathVariable Long discountId) {
        Optional<Discount> result = discountService.getDiscountById(discountId);
        if (result.isPresent())
            return ResponseEntity.ok(discountService.cargarDiscountDTO(result.get()));

        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Discount> createDiscount(@RequestBody DiscountRequest discountRequest)
            throws CategoryDuplicateException, ProductNotExistsException, CategoryNoExistsException, DiscountErrorCreation {
        Discount result = discountService.createDiscount(discountRequest.getPercentage(),discountRequest.getStartDate(), discountRequest.getEndDate());
        return ResponseEntity.created(URI.create("/discounts/" + result.getId())).body(result);
    }

    @PutMapping("/{discountId}")
    public ResponseEntity<DiscountDTO> updateDiscounts(@PathVariable Long discountId, @RequestBody DiscountUpdateRequest discountUpdateRequest) throws CategoryNoExistsException, DiscountNotExistsException, ProductNotExistsException {
        Discount updated = discountService.updateDiscounts(discountId, discountUpdateRequest);
        return ResponseEntity.ok(discountService.cargarDiscountDTO(updated));
    }

    @PutMapping("/{discountId}/deactivate")
    public ResponseEntity<DiscountDTO> deactivateDiscount(@PathVariable Long discountId) throws CambioInvalidoException{
        Discount updated = discountService.deactivateDiscount(discountId);
        return ResponseEntity.ok(discountService.cargarDiscountDTO(updated));
    }
}
