import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../estilos/Home.css';

import NavBar from '../../components/NavBar.jsx';
import ProductCarousel from '../../components/product/ProductCarousel.jsx';
import HeroCarousel from '../../components/HeroCarousel.jsx';
import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.items); // nos traemos los productos
  const categories = useSelector((state) => state.categories.items); // nos traemos las categorias

  return (
    <div className="home-page">
      <NavBar />

      <div className="home-container">
        <HeroCarousel />
      </div>

      <main className="main-content">
        {categories.slice(0, 3).map((cat) => {
          const productosFiltrados = products
            .filter((p) => p.categoryId === cat.id && p.stock > 0)
            .slice(0, 10);

          return (
            <ProductCarousel
              key={cat.id}
              title={cat.description}
              products={productosFiltrados}
            />
          );
        })}

        <section className="community-cta">
          <h2>Unite a la comunidad de Geek Haven</h2>
          <p>Enterate de nuevas ofertas limitadas...</p>
          <button onClick={() => navigate('/registro')}>Registrate</button>
        </section>
      </main>

      <footer className="main-footer">
        <p>&copy; 2025 Geek Haven. Todos los derechos están reservados.</p>
      </footer>
    </div>
  );
};

export default Home;



