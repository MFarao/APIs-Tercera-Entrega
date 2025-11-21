import "./estilos/App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./views/vistasUsuario/Home.jsx";
import Navbar from "./components/NavBar.jsx";
import Inicio from "./views/vistasUsuario/Inicio.jsx";
import Registro from "./views/vistasUsuario/Registro.jsx";

import AccesoDenegado from "./views/AccesoDenegado";
import ProtectedRoute from "./components/ProtectedRoute";

import Productos from "./views/vistasUsuario/Productos.jsx";
import Ordenes from "./views/vistasUsuario/Ordenes.jsx";
import Sale from "./views/vistasUsuario/Sale.jsx";
import DetalleProducto from "./views/vistasUsuario/DetalleProducto.jsx";
import Checkout from "./views/vistasUsuario/Checkout.jsx";

import ConfiguracionUsuario from "./views/vistasUsuario/ConfiguracionUsuario.jsx";

import PanelLayout  from "./views/vistasAdmin/PanelLayout.jsx";
import ControlProducto from "./views/vistasAdmin/ControlProducto.jsx";
import ControlCategorias from "./views/vistasAdmin/ControlCategorias.jsx";
import ControlOrdenes from "./views/vistasAdmin/ControlOrdenes.jsx";
import ControlDescuento from "./views/vistasAdmin/ControlDescuento.jsx";
import ControlUsuarios from "./views/vistasAdmin/ControlUsuarios.jsx";


import { useState } from "react";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/*Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/registro" element={<Registro />} />

        <Route path="/productos"  className="productos-container"element={<Productos />}/>  
        <Route path="/sale" element={<Sale  />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/configuracion" element={<ConfiguracionUsuario />} />

        {/* Protegidas ADMIN */}
        <Route path="/panelControl/*" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <PanelLayout  />
            </ProtectedRoute>
          }>
            <Route path="productos" element={<ControlProducto />} />
          <Route path="categorias" element={<ControlCategorias />} />
          <Route path="ordenes" element={<ControlOrdenes />} />
          <Route path="descuentos" element={<ControlDescuento />} />
          <Route path="usuarios" element={<ControlUsuarios />} />

        </Route>

        {/* Protegidas USER */}
        <Route path="/misordenes" 
          element={
            <ProtectedRoute requiredRole="USER">
              <Ordenes />
            </ProtectedRoute>
          } />

        

        <Route path="/acceso-denegado" element={<AccesoDenegado />} />

      </Routes>
    </>
  );
}

export default App;
