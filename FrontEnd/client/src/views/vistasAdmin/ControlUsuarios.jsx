import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { un_blockUser, selectVisibleUsers, selectTotalUserPages, setPage } from "../../redux/userSlice";

const ControlUsuarios = () => {
  const dispatch = useDispatch();
  const { users, error, userEnSesion, currentPage } = useSelector((state) => state.user);
  const visibleUsers = useSelector(selectVisibleUsers);
  const totalPages = useSelector(selectTotalUserPages);

  const handleBloqueo = async (user) => {
    const confirm = await Swal.fire({
      title: "¿Bloquear usuario?",
      html: `¿Estás seguro de que querés bloquear a <strong>${user.email}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, bloquear",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#7b2ff7",
      cancelButtonColor: "#aaa", // mandamos una alerta de si esta seguro o no de bloquear a ese usario
    });
    if (!confirm.isConfirmed) return; // si dice que no no hacemos nada

    const body = { // creamos el body y mandamos los datos para su bloqueo
      idUser: user.id,
      email: user.email,
      role: user.role,
    }

    dispatch(un_blockUser(body))
  };

  const handleDesbloqueo = async (user) => {
    const { value: rolNuevo } = await Swal.fire({
      title: "Desbloquear usuario",
      input: "text",
      inputLabel: "Nuevo rol para el usuario",
      inputPlaceholder: "Ej: ADMIN, USER, etc.",
      showCancelButton: true,
      confirmButtonText: "Desbloquear",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#7b2ff7",
      cancelButtonColor: "#aaa",
      inputValidator: (value) => {
        if (!value) return "Debés ingresar un rol";
      },
    });

    if (!rolNuevo) return;

    const body = { // creamos el body y mandamos los datos para su bloqueo
      idUser: user.id,
      email: user.email,
      role: rolNuevo.toUpperCase().trim()
    }

    dispatch(un_blockUser(body))
    if(error){
      Swal.fire({
            title: "Error",
            text: "No se pudo realizar la accion sobre el usuario.",
            icon: "error",
            confirmButtonColor: "#7b2ff7" // usamos sweet alerts apra mostrar los errores
        })
    }
  };

  return (
    <div className="panel-layout-container">
      <h2 className="header h2">Usuarios</h2>
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => dispatch(setPage(currentPage - 1))}
        >
          Prev
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => dispatch(setPage(currentPage + 1))}
        >
          Next
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      <table className="panel-layout-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visibleUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.role}</td>
              <td className="user-action-cell">
                <button
                  className="user-btn block"
                  onClick={() => handleBloqueo(user)}
                  disabled={user.role === "BLOQUEADO" || user.email === userEnSesion.email} // maneja el bloqueo y lo deshabilita si esta bloqueado
                >
                  Bloquear
                </button>
                <button
                  className="user-btn unblock"
                  onClick={() => handleDesbloqueo(user)}
                  disabled={user.role !== "BLOQUEADO"} // maneja el desbloqueo y lo deshabilita si no esta bloqueado
                >
                  Desbloquear
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ControlUsuarios;