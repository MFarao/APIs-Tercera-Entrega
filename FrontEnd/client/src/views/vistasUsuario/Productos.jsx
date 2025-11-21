import React, { useState } from "react";
import FiltroProducto from "../../components/product/FiltroProducto";
import ProductList from "../../components/product/ProductList";

const Productos = () => {
    return(
        <div className="productos-page">
            <div className="filtro-container"><FiltroProducto/> </div>
            <div className="productos-container"><ProductList sale={false} /></div>  
        </div>
    );
}
export default Productos;