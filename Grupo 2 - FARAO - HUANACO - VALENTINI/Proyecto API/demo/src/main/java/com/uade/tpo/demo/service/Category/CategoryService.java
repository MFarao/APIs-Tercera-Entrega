
package com.uade.tpo.demo.service.Category;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.uade.tpo.demo.controllers.categories.CategoryDTO;
import com.uade.tpo.demo.controllers.categories.CategoryRequest;

import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.exceptions.CantidadExedenteException;
import com.uade.tpo.demo.exceptions.CategoryDuplicateException;
import com.uade.tpo.demo.exceptions.CategoryNoEliminarException;
import com.uade.tpo.demo.exceptions.CategoryNoExistsException;
import com.uade.tpo.demo.exceptions.EliminacionException;
import com.uade.tpo.demo.exceptions.OrderNotExistsException;

public interface CategoryService {
    public Page<Category> getCategories(PageRequest pageRequest);

    public Optional<Category> getCategoryById(Long categoryId);

    public Category createCategory(String description) throws CategoryDuplicateException;

    public Category updateCategory(Long categoryID, CategoryRequest categoryUpdateRequest) throws CategoryNoExistsException;

    public Void deleteCategory(Long categoryId) throws CategoryNoExistsException, CategoryNoEliminarException, EliminacionException;

    public CategoryDTO cargarCategoryDTO(Category category);
}