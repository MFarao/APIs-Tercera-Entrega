import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ControlUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token"); // obtenemos el token del usuario en sesion
  const enSesion = JSON.parse(localStorage.getItem("user"))

  const fetchUsers = async () => { // hacemos el fetch de todoss ls usuarios
    try {
      const res = await fetch(`http://localhost:4002/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudieron cargar los usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { // metemos el fetch en un effect para que cargue los componentes
    fetchUsers();
  }, []);

  const handleBloqueo = async (user) => {
    console.log(enSesion);
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

    try {
      const res = await fetch(`http://localhost:4002/users/${user.id}/un_block`, { // si dijo que quiere bloquear mandamos la request con los datos
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ // mandamos todos los datos para su bloqueo 
          idUser: user.id,
          email: user.email,
          role: user.role,
        }),
      });
      if (!res.ok) throw new Error("No se pudo bloquear el usuario");
      await fetchUsers(); // recarga los usuarios luego de hacer la request 
    } catch (err) {
      console.error("Error al bloquear usuario:", err);
        console.error("Error al bloquear usuario:", err);
        await Swal.fire({
            title: "Error",
            text: err.message || "No se pudo bloquear el usuario.",
            icon: "error",
            confirmButtonColor: "#7b2ff7"
        });
    }
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

    try {
      const res = await fetch(`http://localhost:4002/users/${user.id}/un_block`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ // mandamos los datos con su nuevo rol asignado 
          idUser: user.id,
          email: user.email,
          role: rolNuevo.toUpperCase().trim(), // le hacemos uppercase para que llegue bien por enum del back
        }),
      });
      if (!res.ok) throw new Error("No se pudo desbloquear el usuario");
      await fetchUsers();
    } catch (err) {
        console.error("Error al desbloquear usuario:", err);
        await Swal.fire({
            title: "Error",
            text: err.message || "No se pudo desbloquear el usuario.",
            icon: "error",
            confirmButtonColor: "#7b2ff7" // usamos sweet alerts apra mostrar los errores
        });
    }
  };

  return (
    <div className="panel-layout-container">
      <h2 className="header h2">Usuarios</h2>
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
          {users.map((user) => (
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
                  disabled={user.role === "BLOQUEADO" || user.email === enSesion.email} // maneja el bloqueo y lo deshabilita si esta bloqueado
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