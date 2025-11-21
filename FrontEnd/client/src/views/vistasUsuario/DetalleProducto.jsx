import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import "../../estilos/DetalleProducto.css";
import { useDispatch, useSelector } from "react-redux";
import { setUltimaRuta } from "../../redux/uiSlice";
import { fetchSingleProduct } from "../../redux/productSlice";

const DetalleProducto = () => {
  const [imagenPrincipal, setImagenPrincipal] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userEnSesion } = useSelector((state) => state.user);
  const { productoSeleccionado } = useSelector((state) => state.products);

    useEffect(() => {
    dispatch(fetchSingleProduct(id)); //  hacemos el fetch del producto segun el id 
  }, [dispatch, id]);

  useEffect(() => {
    if (productoSeleccionado) {
      setImagenPrincipal(productoSeleccionado.imageUrls?.[0] || ""); // establecemos la imagen principal al cargar el producto
    }
  }, [productoSeleccionado]);

  if (!productoSeleccionado) return <h3 className="cargando">Cargando producto...</h3>;

  const enSesion = () => { // chequeamos si el usuario esta iniciado o no consultando el local storage que se arma cuando se renderiza al iniciar sesion
    if (!userEnSesion) {
      dispatch(setUltimaRuta(location.pathname)); //  si no esta iniciado guardamos la ruta para redirigirlo
      return false;
    } else {
      return true;
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <main className="detalle-container">
      <div className="galeria">
        <img src={imagenPrincipal} alt={productoSeleccionado.name} className="imagen-principal" />
        <div className="miniaturas">
          {productoSeleccionado.imageUrls?.slice(0, 3).map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Vista ${i + 1}`}
              className="miniatura"
              onMouseEnter={() => setImagenPrincipal(url)}
            />
          ))}
        </div>
      </div>

      <div className="info">
        <h1 className="titulo">{productoSeleccionado.name}</h1>
        <p className="descripcion">{productoSeleccionado.description}</p>

        <div className="precio-section">
          {productoSeleccionado.priceDescuento ? (
            <>
              <span className="precio-original">${productoSeleccionado.price}</span>
              <span className="precio-descuento">${productoSeleccionado.priceDescuento.toFixed(2)}</span>
              <span className="etiqueta-descuento">
                {(100 - (productoSeleccionado.priceDescuento * 100) / productoSeleccionado.price).toFixed(0)}% OFF
              </span>
            </>
          ) : (
            <span className="precio">${productoSeleccionado.price}</span>
          )}
        </div>

        {productoSeleccionado.discountEndDate && (
          <p className="fecha-descuento">
            Descuento hasta: {new Date(productoSeleccionado.discountEndDate).toLocaleDateString()}
          </p>
        )}

        {enSesion() ? ( // si esta en sesion vemos que es rol tiene para mostrarlo o no // si no esta iniciado se muestra el boton de inicia sesion y compra
          userEnSesion?.role === "USER"? (
            <Link to={`/checkout/${id}`} className="boton-carrito">Comprar</Link>
          ) : (
            null
          )
        ) : <Link to={"/inicio"} className="boton-carrito">Iniciá sesión y compra!</Link>} 

        <div className="detalles-tecnicos">
          <h2>Detalle del Producto</h2>
          <ul>
            <li><strong>Categoria:</strong> {productoSeleccionado.categoryName || "Sin Categoria"}</li>
            <li><strong>Estado:</strong> {productoSeleccionado.active ? "Nuevo" : "Inactivo"}</li>
            <li><strong>Stock:</strong> {productoSeleccionado.stock > 0 ? `${productoSeleccionado.stock} disponibles` : "Sin stock"}</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default DetalleProducto;

