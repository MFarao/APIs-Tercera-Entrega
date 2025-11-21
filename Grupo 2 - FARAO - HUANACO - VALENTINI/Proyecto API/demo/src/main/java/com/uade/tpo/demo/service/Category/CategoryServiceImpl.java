package com.uade.tpo.demo.service.Category;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.demo.controllers.categories.CategoryDTO;
import com.uade.tpo.demo.controllers.categories.CategoryRequest;
import com.uade.tpo.demo.controllers.order.OrderUpdateRequest;
import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.entity.Order;
import com.uade.tpo.demo.exceptions.CantidadExedenteException;
import com.uade.tpo.demo.exceptions.CategoryDuplicateException;
import com.uade.tpo.demo.exceptions.CategoryNoEliminarException;
import com.uade.tpo.demo.exceptions.CategoryNoExistsException;
import com.uade.tpo.demo.exceptions.EliminacionException;
import com.uade.tpo.demo.exceptions.OrderNotExistsException;
import com.uade.tpo.demo.repository.CategoryRepository;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Page<Category> getCategories(PageRequest pageable) {
        return categoryRepository.findAll(pageable);
    }

    public Optional<Category> getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId);
    }

    @Transactional(rollbackFor = Throwable.class)
    public Category createCategory(String description) throws CategoryDuplicateException {
        List<Category> categories = categoryRepository.findByDescription(description);
        if (!categories.isEmpty()) {
            throw new CategoryDuplicateException();
        }
        Category c = new Category(description);
        categoryRepository.save(c);
        return c;
    }

    @Transactional(rollbackFor = Throwable.class)
    public Category updateCategory(Long categoryID, CategoryRequest categoryUpdateRequest)throws CategoryNoExistsException {
        Optional<Category> categories = categoryRepository.findById(categoryID);
        if (categories.isPresent()) {
            Category category = categories.get();
            category.setDescription(categoryUpdateRequest.getDescription());
            categoryRepository.save(category);
            return category;
        }
        throw new CategoryNoExistsException();
    }

    @Transactional(rollbackFor = Throwable.class)
    public Void deleteCategory(Long categoryId) throws CategoryNoExistsException,CategoryNoEliminarException, EliminacionException {
        Optional<Category> category = categoryRepository.findById(categoryId);
        if (category.isPresent()) {
            Category c = category.get();
            if (!categoryRepository.findAllProductById(categoryId).isEmpty()) {
                throw new CategoryNoEliminarException();
            }
            categoryRepository.delete(c);
        }else{throw new CategoryNoExistsException();}
        return null;
    }

    public CategoryDTO cargarCategoryDTO(Category category) {
        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setId(category.getId());
        categoryDTO.setDescription(category.getDescription());
        return categoryDTO;
    }
}
