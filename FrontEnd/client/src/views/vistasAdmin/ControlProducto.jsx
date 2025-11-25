import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "../../components/controlAdmin/ProductForm";
import ProductRow from "../../components/controlAdmin/ProductRow";
import { in_activateProduct, selectVisibleProducts, selectTotalProductPages, setPage } from "../../redux/productSlice";

const ControlProducto = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const currentPage = useSelector((state) => state.products.currentPage);
  const totalPages = useSelector(selectTotalProductPages);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleToggleActivo = async (id) => {
    dispatch(in_activateProduct(id));
    if (error){
      Swal.fire({
          title: "Error",
          text: "No se pudo cambiar el estado del producto.",
          icon: "error",
          confirmButtonColor: "#7b2ff7" // usamos sweet alerts apra mostrar los errores
      })
    }
  };
  
  const filteredProducts = filterCategory
    ? products.filter((pro) => String(pro.categoryId) === filterCategory)
    : products;

  const start = (currentPage - 1) * 10; // 10 = pageSize
  const end = start + 10;
  const visibleProducts = filteredProducts.slice(start, end);

  const totalPagesFiltered = Math.max(1, Math.ceil(filteredProducts.length / 10));


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
          onChange={(e) => {
            setFilterCategory(e.target.value);
            dispatch(setPage(1));
          }}
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.description}
            </option>
          ))}
        </select>
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => dispatch(setPage(currentPage - 1))}
        >
          Prev
        </button>
        <span>
          Página {currentPage} de {totalPagesFiltered}
        </span>
        <button
          disabled={currentPage === totalPagesFiltered}
          onClick={() => dispatch(setPage(currentPage + 1))}
        >
          Next
        </button>
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
          {visibleProducts.map((pro) => (
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
