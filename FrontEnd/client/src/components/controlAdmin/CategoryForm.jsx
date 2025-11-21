import { useState, useEffect } from "react";
import { updateCategory, createCategory  } from '../../redux/categoriesSlice.js';
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";


const CategoryForm = ({ category, onClose }) => {
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();


  useEffect(() => {
    if (category) setDescription(category.description);
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (category) {
      dispatch(updateCategory({ body: { id: category.id, description }})) // despachamos el uopdate con la categoria con su descripcion
      .then(() => {
        Swal.fire("Editada", "La categoría fue actualizada correctamente ✅", "success");
        onClose();     // cerrar modal
      })
      .catch((error) => {
        Swal.fire("Error", error.message || "No se pudo actualizar la categoría.", "error");
      });
    }
    else{
      dispatch(createCategory({ description }))
      .then(() => {
        Swal.fire("Agregada", "La categoría fue creada correctamente ✅", "success");
        onClose();
      })
      .catch((error) => {
        Swal.fire("Error", error.message || "No se pudo crear la categoría.", "error");
      });
    }
  }

  return (
    <div className="form-overlay">
      <form className="panel-layout-form" onSubmit={handleSubmit}>
        <h3>{category ? "Editar Categoria" : "Agregar Categoria"}</h3>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="form-actions">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
