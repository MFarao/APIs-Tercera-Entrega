import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "../../components/controlAdmin/ProductForm";
import ProductRow from "../../components/controlAdmin/ProductRow";
import { fetchProducts, in_activateProduct } from "../../redux/productSlice";

const ControlProducto = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleToggleActivo = async (id) => {
    dispatch(in_activateProduct(id));
  };
  
  return (
    <div className="panel-layout-container">
      <div className="header">
        <h2>Control de Productos</h2>
        <button className="add-btn" onClick={() => {
          setSelectedProduct(null);
          setShowForm(true);
        }}>+ Agregar Producto</button>
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
          {products.map((pro) => (
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
