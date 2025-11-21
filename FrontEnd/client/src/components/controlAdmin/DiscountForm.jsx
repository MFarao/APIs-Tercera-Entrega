import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const DiscountForm = ({ discount, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    percentage: "",
    startDate: "",
    endDate: "",
    productsId: "",
    categoriesId: "",
  });

  useEffect(() => {
    if (discount) {
      setFormData({
        percentage: discount.percentage.toString(),
        startDate: discount.startDate,
        endDate: discount.endDate,
        productsId: "",      // no se precargan porque no vienen en el DTO
        categoriesId: "",    // pero se pueden asignar nuevos
      });
    } else {
      setFormData({
        percentage: "",
        startDate: "",
        endDate: "",
        productsId: "",
        categoriesId: "",
      });
    }
  }, [discount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      Swal.fire({
        title: "Fechas inválidas",
        text: "La fecha de inicio no puede ser posterior a la de fin.",
        icon: "error",
      });
      return;
    }

    const confirm = await Swal.fire({
      title: discount ? "¿Actualizar descuento?" : "¿Crear descuento?",
      text: "Esta acción afectará los productos asociados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6c2bd9",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, publicar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    const method = discount ? "PUT" : "POST";
    const url = discount
      ? `http://localhost:4002/discounts/${discount.id}`
      : "http://localhost:4002/discounts";

    const payload = {
      ...formData,
      productsId: formData.productsId
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id)),
      categoriesId: formData.categoriesId
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id)),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar descuento");

      Swal.fire({
        title: "Descuento guardado ✅",
        icon: "success",
      });

      onRefresh();
      onClose();
    } catch (err) {
      console.error("Error al guardar descuento:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el descuento.",
        icon: "error",
      });
    }
  };

  return (
    <div className="form-overlay">
      <form className="panel-layout-form" onSubmit={handleSubmit}>
        <h3>{discount ? "Editar Descuento" : "Crear Descuento"}</h3>

        <label>Porcentaje (%)</label>
        <input
          type="number"
          name="percentage"
          value={formData.percentage}
          onChange={handleChange}
          required
          min="1"
          max="100"
        />

        <label>Fecha de Inicio</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />

        <label>Fecha de Fin</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />

        <label>Asignar Productos (IDs separados por coma)</label>
        <input
          type="text"
          name="productsId"
          value={formData.productsId}
          onChange={handleChange}
          placeholder="Ej: 1, 2, 3"
        />

        <label>Asignar Categorías (IDs separados por coma)</label>
        <input
          type="text"
          name="categoriesId"
          value={formData.categoriesId}
          onChange={handleChange}
          placeholder="Ej: 10, 12"
        />

        <div className="form-actions">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiscountForm;
