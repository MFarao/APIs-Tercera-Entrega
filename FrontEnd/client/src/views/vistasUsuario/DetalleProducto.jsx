import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import "../../estilos/DetalleProducto.css";
import { useDispatch, useSelector } from "react-redux";
import { setUltimaRuta } from "../../redux/uiSlice";
import { setProductoSeleccionado } from "../../redux/productSlice";
import { sumarCarrito } from "../../redux/cartSlice";
import Swal from "sweetalert2";

const DetalleProducto = () => {
  const [imagenPrincipal, setImagenPrincipal] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userEnSesion } = useSelector((state) => state.user);
  const { items , productoSeleccionado } = useSelector((state) => state.products);
  const { ultimaRuta } = useSelector((state) => state.UIs);
  const [agregado, setAgregado] = useState(false);
  const navigate = useNavigate();
  const { items: categories } = useSelector((state) => state.categories);

    useEffect(() => {
      if(productoSeleccionado?.id !== Number(id)){ // evitamos hacer el fetch si ya tenemos el producto seleccionado en el estado
        dispatch(setProductoSeleccionado(id));} //  hacemos el fetch del producto segun el id 
    }, [dispatch, id, items]);

    useEffect(() => {
      if(ultimaRuta !== location.pathname && !userEnSesion){  // Comparamos la ultima ruta guardada con la actual para no sobreescribirla innecesariamente
        dispatch(setUltimaRuta(location.pathname));
      }
    }, [dispatch, userEnSesion, location.pathname]);


  useEffect(() => {
    if (productoSeleccionado) {
      setImagenPrincipal(productoSeleccionado.imageUrls?.[0] || ""); // establecemos la imagen principal al cargar el producto
    }
  }, [productoSeleccionado]);

  if (!productoSeleccionado) return <h3 className="cargando">Cargando producto...</h3>;

  const enSesion = () => !!userEnSesion;

  const handleAgregarClick = () => { 
    dispatch(sumarCarrito(productoSeleccionado));
    setAgregado(true);

      Swal.fire({
      title: "Agregado al carrito ✅",
      text: "¿Querés ir al checkout ahora?",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#6b4eff",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, ir al checkout",
      cancelButtonText: "Seguir comprando",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/checkout");
      }
    });

  };


  return (
    <main className="detalle-container">
      <div className="galeria">
        <img src={imagenPrincipal || null} alt={productoSeleccionado.name} className="imagen-principal" />
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

        {enSesion() ? (// si esta en sesion vemos que es rol tiene para mostrarlo o no // si no esta iniciado se muestra el boton de inicia sesion y compra
            userEnSesion?.role === "USER" ? (
                !agregado ? ( // chequeamos si se apreto el boton y si es asi mostramos que esta pedido si no el boton de agregar
                  <button className="boton-carrito" onClick={handleAgregarClick}> Agregar al Carrito </button>) : (
                  <button className="boton-carrito pedido" disabled>Pedido</button>)) : null
            ) : (<Link to="/inicio" className="boton-carrito">Iniciá sesión y compra!</Link>
            )}

        <div className="detalles-tecnicos">
          <h2>Detalle del Producto</h2>
          <ul>
            <li><strong>Categoria:</strong>{categories.find(cat => Number(cat.id) === Number(productoSeleccionado.categoryId))?.description || "Sin categoría"}</li>
            <li><strong>Estado:</strong> {productoSeleccionado.active ? "Nuevo" : "Inactivo"}</li>
            <li><strong>Stock:</strong> {productoSeleccionado.stock > 0 ? `${productoSeleccionado.stock} disponibles` : "Sin stock"}</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default DetalleProducto;

