import React, { useState } from "react";
import mercadoPagoLogo from "../../assets/mercadoPago.png";
import { setConectado, setEnvio } from "../../redux/uiSlice";
import { useSelector, useDispatch } from "react-redux";

const CheckoutFormulario = () => {
  const {conectado} = useSelector((state) => state.UIs);
  const dispatch = useDispatch();

  const handleConnect = () => {
    if (!conectado) {
      dispatch(setConectado(true));
    }
  };

  return(
    <div className="checkout-summary">
      <div className="checkout-subtotal">
        <p>Rellene sus datos:</p>
        <form className="forms">
          <input type="text" placeholder="Ingrese su direccion " onChange={(e) => dispatch(setEnvio(e.target.value))} />
          <button type="button" className={`btn-mercadopago ${conectado ? "active" : ""}`} 
          onClick={handleConnect}
          disabled={conectado}>
            <img className="mpLogo" src={mercadoPagoLogo} />
            Conectar con MercadoPago
          </button>
        </form>
      </div>
     </div>
)};

export default CheckoutFormulario;
