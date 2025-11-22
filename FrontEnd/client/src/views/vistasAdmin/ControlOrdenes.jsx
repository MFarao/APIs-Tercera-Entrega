import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { updateStatus } from "../../redux/orderSlice";

const ControlOdrenes = () => {
  const {orders, error} = useSelector((state) => state.order);
  const dispatch = useDispatch();

  const handleProxFase = (orden) => {
    // asignamos la siguiente fase
    if (orden.status === "PAGO") return "PREPARANDO";
    if (orden.status === "PREPARANDO") return "ENVIADO";
    if (orden.status === "ENVIADO") return "ENTREGADO";
    return null;
  }

  const handlePasarDeFase = async (orden) => {
    const proxFase = handleProxFase(orden)
    if (!proxFase) return

    const confirm = await Swal.fire({
      title: "Confirmar cambio de fase",
      html: `¿Cambiar orden <strong>#${orden.id}</strong> de <strong>${orden.status}</strong> a <strong>${proxFase}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#6c2bd9",
      cancelButtonColor: "#aaa",
    });
    if (!confirm.isConfirmed) return

    const body = {status: proxFase}; // creamos el body con la proxima fase

    dispatch(updateStatus({body, idOrder: orden.id})); // pasamos la proxima fase y el id de la orden
    };

  return (
    <div className="panel-layout-container">
      <h2 className="header h2">Órdenes</h2>
      {error && <p className="error">{error}</p>}
      <table className="panel-layout-table">
        <thead>
          <tr>
            <th>idUsuario</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Direccion</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
            {orders.map((orden) => ( // para cada orden se crea un componente
                <tr key={orden.id}>
                <td>{orden.idUser}</td>
                <td>{orden.nombreProducto}</td>
                <td>{orden.cantidadProducto}</td>
                <td>${orden.total.toFixed(2)}</td>
                <td>{orden.status}</td>
                <td>{orden.envio_a}</td>
                <td>{new Date(orden.fecha).toLocaleDateString()}</td>
                <td className="order-action-cell">
                    <button
                    className="order-btn advance"
                    onClick={() => handlePasarDeFase(orden)} // cada uno tendra un boton para pasar de fase
                    disabled={orden.status === "ENTREGADO"}
                    title={orden.status === "ENTREGADO" ? "Orden ya finalizada" : "Pasar al siguiente estado"}
                    >
                    Pasar de fase
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
      </table>
    </div>
  );
};
export default ControlOdrenes;