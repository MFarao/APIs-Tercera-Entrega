import React from "react";
import { useDispatch } from "react-redux";
import { in_activateProduct } from "../../redux/productSlice";


const ProductRow = ({ producto, onEditar }) => {
  const dispatch = useDispatch();

  const handleToggleActivo = async () => {
    try {
      const result = await dispatch(toggleProductActivo(producto.id));
      if (result.type.includes("rejected")) {
        console.error("Error al activar/inactivar:", result.payload);
      }
    } catch (err) {
      console.error("Error inesperado:", err);
    }
  };


  return (
    <tr>
      <td>{producto.id}</td>
      <td>{producto.name}</td>
      <td>{producto.description}</td>
      <td>${producto.price.toFixed(2)}</td>
      <td>{producto.priceDescuento ? `$${producto.priceDescuento}` : "-"}</td>
      <td>{producto.stock}</td>
      <td>
        <span className={producto.active ? "activo" : "inactivo"}>
          {producto.active ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td>
        {producto.imageUrls?.[0] ? (
          <img
            src={producto.imageUrls[0]}
            alt={producto.name}
            className="img-miniatura"
          />
        ) : (
          "-"
        )}
      </td>
      <td>
        <button className="button edit" onClick={() => onEditar(producto)}>Editar</button>
        <button className="button delete" onClick={handleToggleActivo}>
          {producto.active ? "🚫" : "✅"}
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;