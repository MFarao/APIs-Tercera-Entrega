import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CheckoutResumen = ({createOrder }) => {
  const {total} = useSelector((state) => state.cart);
  const {token} = useSelector((state) => state.user);
  const {conectado, envio} = useSelector((state) => state.UIs);

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
