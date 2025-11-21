import React from "react";
import "../../estilos/Product.css";
import { Link } from "react-router-dom";

const ProductComponent = ({
  id,
  name,
  description,
  price,
  priceDescuento,
  discountEndDate,
  categoryId,
  categoryName,
  imageUrls,
  stock,
  active
}) => {
  
  const discountPercent = priceDescuento > 0 
    ? (((price - priceDescuento) / price) * 100).toFixed(0)
    : 0;

  return (
    <Link to={`/productos/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      
      <div className={`product-card ${!active || stock === 0 ? "inactive" : ""}`}>
        <div className="product-image">
          <img src={imageUrls?.[0]} alt={name} />
        </div>

        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          <p className="product-category">Categoría: {categoryName || categoryId}</p>
          
          <div className="product-pricing">

            {priceDescuento > 0 ? (
              <>
                <p className="product-discount" style={{fontSize: '1.3rem', fontWeight: '800'}}>${priceDescuento.toFixed(2)}</p> //
                <p className="product-price" style={{textDecoration: 'line-through', opacity: 0.6}}>${price.toFixed(2)}</p> 
                <p className="product-discount" style={{color: '#d12b6c', fontWeight: '700'}}>{discountPercent}% OFF!</p>
              </>
            ) : (
              <p className="product-price">${price.toFixed(2)}</p>
            )}
          </div>
          
          {discountEndDate && priceDescuento > 0 && (
            <p className="product-discount-date">
              Descuento hasta: {new Date(discountEndDate).toLocaleDateString()}
            </p>
          )}
        </div>
        
      </div>
    </Link>
  );
};

export default ProductComponent;