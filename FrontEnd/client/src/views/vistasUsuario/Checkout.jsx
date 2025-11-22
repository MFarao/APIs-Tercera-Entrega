import React, { useEffect, useState } from "react";
import CheckoutProducto from "../../components/Checkout/CheckoutProducto";
import CheckoutFormulario from "../../components/Checkout/CheckoutFormulario";
import CheckoutResumen from "../../components/Checkout/CheckoutResumen";
import "../../estilos/Checkout.css";
import { useDispatch, useSelector } from "react-redux";

const Checkout = () => {

  const {items} = useSelector((state) => state.cart); // nos traemos los productos del carrito 
  return ( 
    // a resumen le mandamos la posiblidad de crear la orden
    <main className="checkout-page">
      {items.length === 0 ? (
        <div className="carrito-vacio">
          <h2>🛒 Tu carrito está vacío</h2>
          <p>Agregá productos para continuar con tu compra.</p>
        </div> ) : ( // si hay productos los mostramos si no decimos q esta vacio
          <>{items.map((p) => (
          <CheckoutProducto key={p.id} p={p} />))}
          <CheckoutFormulario />
          <CheckoutResumen />
        </>
      )}
    </main>
  );
};

export default Checkout;
