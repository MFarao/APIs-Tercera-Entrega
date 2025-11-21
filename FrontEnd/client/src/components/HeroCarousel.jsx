import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../estilos/HeroCarousel.css';

import banner1 from '../assets/escultura2.png';
import banner2 from '../assets/escultura3.png';

const heroSlides = [
  {
    id: 1,
    image: banner1,
    title: 'COMPRA SEGURA',
    subtitle: 'A DOMICILIO O SUCURSAL',
    description: 'ENTREGA EN 2 A 5 DÍAS HÁBILES',
    extra: 'SEGUIMIENTO DE ENVÍO',
    buttonText: 'Explorar Productos',
    buttonLink: '/productos',
  },
  {
    id: 2,
    image: banner2,
    title: 'NUEVAS COLECCIONES',
    subtitle: 'Figuras de acción exclusivas al mejor precio',
    description: '¡No te las pierdas!',
    extra: '',
    buttonText: 'Ver Ofertas',
    buttonLink: '/sale',
  },
];

const HeroCarousel = ({ interval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === heroSlides.length - 1 ? 0 : prevSlide + 1
      );
    }, interval);

    return () => clearInterval(slideInterval);
  }, [interval]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="hero-carousel">
      <div className="hero-image-container">
        <img
          src={currentHero.image}
          alt={currentHero.title}
          className="hero-background-image"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <h1 className="hero-title">{currentHero.title}</h1>
        {currentHero.subtitle && (
          <p className="hero-subtitle">{currentHero.subtitle}</p>
        )}
        {currentHero.description && (
          <p className="hero-description">{currentHero.description}</p>
        )}
        {currentHero.extra && (
          <p className="hero-extra">{currentHero.extra}</p>
        )}
        {currentHero.buttonText && (
          <button
            className="hero-button"
            onClick={() => navigate(currentHero.buttonLink)}
          >
            {currentHero.buttonText}
          </button>
        )}
      </div>

      <div className="carousel-dots">
        {heroSlides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
