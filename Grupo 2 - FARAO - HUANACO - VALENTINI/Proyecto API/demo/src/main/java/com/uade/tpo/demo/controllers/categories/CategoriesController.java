package com.uade.tpo.demo.controllers.categories;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.controllers.order.OrderDTO;
import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.exceptions.CategoryDuplicateException;
import com.uade.tpo.demo.exceptions.CategoryNoEliminarException;
import com.uade.tpo.demo.exceptions.CategoryNoExistsException;
import com.uade.tpo.demo.exceptions.EliminacionException;
import com.uade.tpo.demo.service.Category.CategoryService;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("categories")
public class CategoriesController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getCategories(
        @RequestParam(required = false) Integer page,
        @RequestParam(required = false) Integer size) {

        int p = (page == null) ? 0 : page;
        int s = (size == null) ? Integer.MAX_VALUE : size;

        List<CategoryDTO> dtoList = new ArrayList<>();
        for (Category category : categoryService.getCategories(PageRequest.of(p, s))) {
            CategoryDTO dto = categoryService.cargarCategoryDTO(category);
            dtoList.add(dto);
        }

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long categoryId) {
        Optional<Category> result = categoryService.getCategoryById(categoryId);
        if (result.isPresent())
            return ResponseEntity.ok(categoryService.cargarCategoryDTO(result.get()));

        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Object> createCategory(@RequestBody CategoryRequest categoryRequest)
            throws CategoryDuplicateException {
        Category result = categoryService.createCategory(categoryRequest.getDescription());
        return ResponseEntity.created(URI.create("/categories/" + result.getId())).body(result);
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long categoryId, @RequestBody  CategoryRequest categoryRequest) throws CategoryNoExistsException {
        Category updated = categoryService.updateCategory(categoryId, categoryRequest);
        return ResponseEntity.ok(categoryService.cargarCategoryDTO(updated));
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long categoryId) throws CategoryNoExistsException, CategoryNoEliminarException, EliminacionException {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok("Categoría eliminada correctamente");
    }
}
