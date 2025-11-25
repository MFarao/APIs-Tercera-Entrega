import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "../../components/controlAdmin/ProductForm";
import ProductRow from "../../components/controlAdmin/ProductRow";
import { in_activateProduct } from "../../redux/productSlice";

const ControlProducto = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleToggleActivo = async (id) => {
    dispatch(in_activateProduct(id));
  };
  
  const filteredProducts = filterCategory
    ? products.filter((pro) => String(pro.categoryId) === filterCategory)
    : products;

  return (
    <div className="panel-layout-container">
      <div className="header">
        <h2>Control de Productos</h2>
        <button className="add-btn" onClick={() => {
          setSelectedProduct(null);
          setShowForm(true);
        }}>+ Agregar Producto</button>
      </div>

      <div className="filter-container">
        <label>Filtrar por categoría: </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.description}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setShowForm(false)}
        />
      )}

      {loading && <p>Cargando productos...</p>}
      {error && <p className="error">{error}</p>}

      <table className="panel-layout-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Con descuento</th>
            <th>% Descuento</th>
            <th>Fin de descuento</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Imagenes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((pro) => (
            <ProductRow
              key={pro.id}
              producto={pro}
              onEditar={() => handleEdit(pro)}
              onToggleActivo={() => handleToggleActivo(pro.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ControlProducto;
