package com.uade.tpo.demo.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderColumn;
import lombok.Data;

@Data
@Entity
public class Product {

    public Product(){}

    public Product(String name ,String description, List<String> imageUrls, Double precio, int stock, Category category){
        this.name = name;
        this.description = description;
        this.imageUrls = imageUrls;
        this.precio = precio;
        this.stock = stock;
        this.category = category;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private int stock;

    @Column
    private boolean activo = true;

    @Column
    private Double precioDescuento;

    @ManyToOne(optional = true)
    @JoinColumn(name = "discount_id", nullable = true)
    @JsonIgnoreProperties({"product"})
    private Discount discount;

    @OneToMany(mappedBy = "product")
    @JsonIgnoreProperties({"product"})
    private List<Order> orders;

    @ManyToOne(optional = true)
    @JoinColumn(name = "category_id", referencedColumnName = "id", nullable = true)
    @JsonIgnoreProperties({"products"}) //Para evitar que el get devuelva el anidado del anidado del...
    private Category category;

    @ElementCollection // especifica que es una coleccion
    @CollectionTable( name = "product_images", joinColumns = @JoinColumn(name = "product_id") ) // crea una tabla secundaria ligada a las imagenes
    @Column(name = "image_url", nullable = false, length = 2000)
    @OrderColumn(name = "position") // preserva el orden asignado
    private List<String> imageUrls = new ArrayList<>();

}
