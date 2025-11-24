import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrders } from "../../redux/orderSlice";
import { vaciarCarrito } from "../../redux/cartSlice";
import Swal from "sweetalert2";

const CheckoutResumen = () => {
  const {total} = useSelector((state) => state.cart);
  const {token} = useSelector((state) => state.user);
  const {conectado, envio} = useSelector((state) => state.UIs);

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const {items} = useSelector((state) => state.cart); // nos traemos los productos del carrito 
  const {userEnSesion} = useSelector((state) => state.user); // nos traemos los productos del carrito 

  const createOrder = async () => {
    try {
      const ordenesACrear = items.map((p) => ({
        idUser: userEnSesion.id,
        idProducto: p.id,
        cantidadProducto: p.cantidad,
        envio_a: envio,
      }));

      await dispatch(createOrders({ ordenes: ordenesACrear })).unwrap();

      dispatch(vaciarCarrito());

      Swal.fire({
        title: "Orden creada ✅",
        text: "Tu pedido fue procesado correctamente.",
        icon: "success",
        confirmButtonText: "Ver mis órdenes",
      }).then((result) => {
        if (result.isConfirmed) navigate("/misordenes");
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
  <div className="checkout-summary">
    <div className="checkout-subtotal">
      <p>Subtotal:</p>
      {`$ ${total.toFixed(2)}`}
    </div>
    <div className="footer">
      <p className="checkout-note">Impuestos (IVA 21%) y envio incluido.</p>
      <div className="checkout-action">
        {token ? ( // si no le dio a conectar a mercado pago o  el envio esta vacio, deshabilita el boton
          <button className="btn-comprar" onClick={createOrder} disabled={!conectado || envio.trim() === ""}>
            Proceder al pago
          </button>
        ) : ( // si no esta iniciado y llega a esa url le pide que inice sesion
          <Link to="/inicio" className="btn-login">Iniciar sesión para comprar</Link>
        )}
      </div>
    </div>
  </div>
  )
};

export default CheckoutResumen;
