import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const UserForm = ({ user, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        name: user.name || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
      title: user ? "¿Actualizar usuario?" : "¿Crear usuario?",
      text: "Esta acción modificará los datos del usuario.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6c2bd9",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    const method = user ? "PUT" : "POST";
    const url = user
      ? `http://localhost:4002/users/${user.id}`
      : "http://localhost:4002/users";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al guardar usuario");

      Swal.fire({
        title: "Usuario guardado ✅",
        icon: "success",
      });

      onRefresh();
      onClose();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el usuario.",
        icon: "error",
      });
    }
  };

  return (
    <div className="form-overlay">
      <form className="panel-layout-form" onSubmit={handleSubmit}>
        <h3>{user ? "Editar Usuario" : "Crear Usuario"}</h3>

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Rol</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        />

        <div className="form-actions">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
