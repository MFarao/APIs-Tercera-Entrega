import React from "react";
import mercadoPagoLogo from "../../assets/mercadoPago.png";

const CheckoutFormulario = ({ handleChange, conectado, setConectado }) => (
  <div className="checkout-summary">
    <div className="checkout-subtotal">
      <p>Rellene sus datos:</p>
      <form className="forms">
        <input type="text" placeholder="Ingrese su direccion " onChange={handleChange} />
        <button type="button" className={`btn-mercadopago ${conectado ? "active" : ""}`} onClick={() => setConectado(true)}>
          <img className="mpLogo" src={mercadoPagoLogo} />
          Conectar con MercadoPago
        </button>
      </form>
    </div>
  </div>
);

export default CheckoutFormulario;
