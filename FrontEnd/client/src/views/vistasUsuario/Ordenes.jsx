import React, { useEffect, useState } from "react";
import "../../estilos/Ordenes.css";
import { useDispatch, useSelector } from "react-redux";
import { setFiltrosAplicar, setPage, selectVisibleOrders, selectTotalPages } from "../../redux/orderSlice";

const Ordenes = () => {
  const dispatch = useDispatch();
  const { orders, error, filtrosAplicar, currentPage } = useSelector((state) => state.order);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  useEffect(() => {
    dispatch(setFiltrosAplicar({ estado: filtroEstado }));
    dispatch(setPage(1));
  }, [filtroEstado, dispatch]);

  const visibleOrders = useSelector((state) =>
    selectVisibleOrders(state, filtroEstado === "TODOS" ? null : filtroEstado)
  );
  const totalPages = useSelector((state) =>
    selectTotalPages(state, filtroEstado === "TODOS" ? null : filtroEstado)
  );

  return (
     <div className="ordenes-container">
      <h2 className="ordenes-h2">Mis Órdenes</h2>

      <div className="ordenes-tabs">
        {["Todos", "Pago", "Preparando", "Enviado" , "Entregado"].map((estado) => ( // creamos las etiquetas de los filtros 
          <button
            key={estado.toUpperCase()}
            className={`ordenes-tab ${filtroEstado === estado.toUpperCase() ? "active" : ""}`}
            onClick={() => setFiltroEstado(estado.toUpperCase())} // estandarizamos los estados para que los filtros funcionen
          >
            {estado}
          </button>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => dispatch(setPage(currentPage - 1))}
        >
          Prev
        </button>
        <span>
          Página {currentPage} de {Math.max(1, totalPages)}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => dispatch(setPage(currentPage + 1))}
        >
          Next
        </button>
      </div>

      <div className="ordenes-lista">
        {visibleOrders.map((orden) => (
          <div key={orden.id} className="orden-card">
            <div className="orden-card-header">
              <span className="orden-id">Orden #{orden.id}</span>
              <span className={`orden-status ${orden.status.toLowerCase()}`}>
                {orden.status}
              </span>
            </div>

            <div className="orden-card-body">
              <div className="orden-columna izquierda">
                <p><strong>{orden.nombreProducto}</strong></p>
                <p>Cantidad: {orden.cantidadProducto}</p>
                <p>Total: ${orden.total.toFixed(2)}</p>
              </div>

              <div className="orden-columna derecha">
                <p>Dirección: {orden.envio_a}</p>
                <p>Fecha: {new Date(orden.fecha).toLocaleDateString()}</p>
              </div>
            </div>  
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ordenes;