import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CheckoutProducto from "../../components/Checkout/CheckoutProducto";
import CheckoutFormulario from "../../components/Checkout/CheckoutFormulario";
import CheckoutResumen from "../../components/Checkout/CheckoutResumen";
import "../../estilos/Checkout.css";
import { useDispatch, useSelector } from "react-redux";

const Checkout = () => {
  const navigate = useNavigate()

  const {items} = useSelector((state) => state.cart); // nos traemos los productos del carrito 

  const createOrder = async () => { // hacemo el creaar de la orden con el produco almacenado en state
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch("http://localhost:4002/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          idUser: user.id,
          idProducto: p.id,
          cantidadProducto: cantidad,
          envio_a: envio,
        }),
      });

      if (!response.ok) throw new Error("Error al crear la orden");

      Swal.fire({
        title: "Orden creada ✅",
        text: "Tu pedido fue procesado correctamente.",
        icon: "success",
        confirmButtonText: "Ver mis órdenes",
      }).then((result) => {
        if (result.isConfirmed) navigate("/misordenes"); // lo dirigimos a mis ordenes
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo crear la orden.",
        icon: "error",
      });
    }
  };

  return ( 
    // a resumen le mandamos la posiblidad de crear la orden
    <main className="checkout-page">
      {items.length === 0 ? (
        <div className="carrito-vacio">
          <h2>🛒 Tu carrito está vacío</h2>
          <p>Agregá productos para continuar con tu compra.</p>
        </div> ) : ( // si hay productos los mostramos si no decimos q esta vacio
          <>{items.map((p) => (<CheckoutProducto key={p.id} p={p} />))}
          <CheckoutFormulario />
          <CheckoutResumen createOrder={createOrder} />
        </>
      )}
    </main>
  );
};

export default Checkout;
