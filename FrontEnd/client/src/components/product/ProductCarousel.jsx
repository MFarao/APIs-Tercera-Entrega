import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../estilos/ProductCarousel.css';

const ProductCarousel = ({ title, products }) => {
  const carouselRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h2>{title}</h2>
        <div className="carousel-buttons">
          <button onClick={() => scroll(-300)} className="scroll-button prev">‹</button>
          <button onClick={() => scroll(300)} className="scroll-button next">›</button>
        </div>
      </div>

      <div className="carousel-wrapper" ref={carouselRef}>
        {products.map((product) => (
          <Link
            to={`/productos/${product.id}`}
            key={product.id}
            className="carousel-card"
          >
            <img src={product.imageUrls?.[0] || ''} alt={product.name} />
            <p>{product.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductCarousel;

