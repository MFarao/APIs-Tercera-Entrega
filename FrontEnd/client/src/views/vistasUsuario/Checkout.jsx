import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CheckoutProducto from "../../components/Checkout/CheckoutProducto";
import CheckoutFormulario from "../../components/Checkout/CheckoutFormulario";
import CheckoutResumen from "../../components/Checkout/CheckoutResumen";
import "../../estilos/Checkout.css";

const Checkout = () => {
  const [p, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [envio, setEnvio] = useState("")
  const [conectado, setConectado] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const Url = `http://localhost:4002/products/${id}`
  // cargamos todos los estados que usaran sus hijos para poder actualizarlos en el padre asi poder pasarselos a sus "hermanos"

  useEffect(() => {
    fetch(Url) // hacemos el set del producto que viene como parametro
      .then((response) => response.json())
      .then((data) => setProducto(data))
      .catch((error) => console.error("Error al obtener los datos: ", error.message))
  }, []);

  // definimos las funciones de escribir la direccion y cambiar el contador
  const handleChange = (e) => setEnvio(e.target.value)

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

  if (!p) return <h3 className="cargando">Cargando producto...</h3>;
  if (!p.active) return <h3 className="no-disponible">Este producto no está disponible.</h3>;

  return ( 
    // a checkoutProducto le pasamos el producto para que lo pueda renderizar, tmb le pasamos los handle para que la interaccion en el hijo afecte al padre y asi poder mandar cantidad al resumen
    // a chekoutFormulario le pasamos el handle change para que el padre reciba lo que el hijo escribe ahi, tambien dejamos que maneje el estado del padre pasando conectado y setconectado
    // a resumen le mandamos el producto para que acceda al precio y calcule el total, junto con la cantidad, a donde se envia y la posiblidad de crear la orden
    <main className="checkout-page">
      <CheckoutProducto p={p} cantidad={cantidad}/>
      <CheckoutFormulario envio={envio} handleChange={handleChange} conectado={conectado} setConectado={setConectado} />
      <CheckoutResumen conectado={conectado} envio={envio} createOrder={createOrder} />
    </main>
  );
};

export default Checkout;
