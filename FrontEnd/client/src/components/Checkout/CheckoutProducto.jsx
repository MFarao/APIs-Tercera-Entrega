import React from "react";
import { useDispatch } from "react-redux";
import { sumarCarrito, sacarCarrito } from "../../redux/cartSlice";

const CheckoutProducto = ({ p, cantidad }) => { // se encarga de renderizar el componente que contiene el producto a comprar
  const dispatch = useDispatch();

  return(
  <div className="checkout-card-horizontal">
    <img src={p.imageUrls?.[0] || "/placeholder.png"} alt={p.name} className="checkout-img" />
    <div className="checkout-info">
      <h2 className="checkout-name">{p.name}</h2>
      <div className="quantity-selector">
        <button className="qty-btn" onClick={dispatch(sumarCarrito(p))}>−</button>
        <span className="qty-value">{cantidad}</span>
        <button className="qty-btn" onClick={dispatch(sacarCarrito(p))}>+</button>
      </div>
      <div className="checkout-stock">
        {p.stock > 0 ? (
          <span className="en-stock">En stock ({p.stock})</span>
        ) : (
          <span className="sin-stock">Sin stock</span>
        )}
      </div>
      <div className="checkout-precio">
        {p.priceDescuento && p.discountEndDate ? ( // tiene precio descuento aplicamos estilos y renderizamos los datos del descuento
          <>
            <span className="precio-descuento">${p.priceDescuento.toFixed(2)}</span>
            <span className="precio-original">${p.price.toFixed(2)}</span>
            <p className="fecha-descuento">Válido hasta {new Date(p.discountEndDate).toLocaleDateString()}</p>
          </>
        ) : ( // si no tiene solo el precio mostramos
          <span className="precio-normal">${p.price.toFixed(2)}</span>
        )}
      </div>
    </div>
  </div>
)};

export default CheckoutProducto;
