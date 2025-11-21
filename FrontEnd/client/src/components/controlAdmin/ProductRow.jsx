import React from "react";
import { useDispatch } from "react-redux";
import { in_activateProduct } from "../../redux/productSlice";


const ProductRow = ({ producto, onEditar, onToggleActivo }) => {

  return (
    <tr>
      <td>{producto.id}</td>
      <td>{producto.name}</td>
      <td>{producto.description}</td>
      <td>${producto.price}</td>
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
        <button className="button delete" onClick={onToggleActivo}>
          {producto.active ? "🚫" : "✅"}
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;