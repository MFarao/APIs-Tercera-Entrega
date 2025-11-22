import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { createDiscount, updateDiscount } from "../../redux/discountSlice";

const DiscountForm = ({ discount, onClose }) => {
  const { error } = useSelector((state) => state.discounts);
  const dispatch = useDispatch();

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

    const payload = {
      ...formData,
      percentage: parseFloat(formData.percentage),
      productsId: formData.productsId
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id)),
      categoriesId: formData.categoriesId
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id)),
    };

    if (discount) {
      await dispatch(updateDiscount({ body: { ...payload, id: discount.id } })).unwrap();
    } else {
      await dispatch(createDiscount(payload)).unwrap();
    }
    
    if(error) {
      Swal.fire({ title: "Error", text: "No se pudo guardar el descuento.", icon: "error", });
    }
    else{
      Swal.fire({ title: "Descuento guardado ✅", icon: "success", });
    }  
    onClose();
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
