import React, { useState } from "react";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { updateStatus } from "../../redux/orderSlice";

const ControlOdrenes = () => {
  const { orders, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  const [filterStatus, setFilterStatus] = useState(""); 

  const handleProxFase = (orden) => {
    if (orden.status === "PAGO") return "PREPARANDO";
    if (orden.status === "PREPARANDO") return "ENVIADO";
    if (orden.status === "ENVIADO") return "ENTREGADO";
    return null;
  };

  const handlePasarDeFase = async (orden) => {
    const proxFase = handleProxFase(orden);
    if (!proxFase) return;

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
    if (!confirm.isConfirmed) return;

    const body = { status: proxFase };
    dispatch(updateStatus({ body, idOrder: orden.id }));
  };

  const filteredOrders = filterStatus
    ? orders.filter((orden) => orden.status === filterStatus)
    : orders;

  return (
    <div className="panel-layout-container">
      <h2 className="header h2">Órdenes</h2>
      {error && <p className="error">{error}</p>}

      <div className="filter-container">
        <label>Filtrar por estado: </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="PAGO">PAGO</option>
          <option value="PREPARANDO">PREPARANDO</option>
          <option value="ENVIADO">ENVIADO</option>
          <option value="ENTREGADO">ENTREGADO</option>
        </select>
      </div>

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
          {filteredOrders.map((orden) => (
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
                  onClick={() => handlePasarDeFase(orden)}
                  disabled={orden.status === "ENTREGADO"}
                  title={
                    orden.status === "ENTREGADO"
                      ? "Orden ya finalizada"
                      : "Pasar al siguiente estado"
                  }
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
