import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../estilos/Home.css';

import NavBar from '../../components/NavBar.jsx';
import ProductCarousel from '../../components/product/ProductCarousel.jsx';
import HeroCarousel from '../../components/HeroCarousel.jsx';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('http://localhost:4002/categories'),
          fetch('http://localhost:4002/products'),
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        setCategories(catData.slice(0, 3));
        setProducts(prodData);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-page">
      <NavBar />

      <div className="home-container">
        <HeroCarousel />
      </div>

      <main className="main-content">
        {categories.map((cat) => {
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



