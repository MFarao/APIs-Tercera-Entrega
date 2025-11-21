import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../estilos/PanelDeControl.css";
import logo from "../assets/logo.png";

const PanelDeControl = () => {
  const location = useLocation();

  return (
    <div className="panel-de-control">
      <div>
        <Link to="/panelControl/usuarios" className={`panel-link ${location.pathname === "/panelControl/usuarios" ? "active" : ""}`}>Usuarios</Link>
      </div>

      <div>
        <Link to="/panelControl/productos" className={`panel-link ${location.pathname === "/panelControl/productos" ? "active" : ""}`}>Productos</Link>
      </div>

      <div>
        <Link to="/panelControl/categorias" className={`panel-link ${location.pathname === "/panelControl/categorias" ? "active" : ""}`}>Categorías</Link>
      </div>

      <div>
        <Link to="/panelControl/ordenes" className={`panel-link ${location.pathname === "/panelControl/ordenes" ? "active" : ""}`}>Órdenes</Link>
      </div>

      <div>
        <Link to="/panelControl/descuentos" className={`panel-link ${location.pathname === "/panelControl/descuentos" ? "active" : ""}`}>Descuentos</Link>
      </div>

      <div className="panel-footer">
        <img src={logo} alt="GeekHaven Logo" className="panel-logo" />
        <h2 className="panel-title">GeekHaven Admin</h2>
      </div>
    </div>
  );
};

export default PanelDeControl;
