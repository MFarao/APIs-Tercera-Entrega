import { useState } from "react";
import CategoryRow from "../../components/controlAdmin/CategoryRow";
import CategoryForm from "../../components/controlAdmin/CategoryForm";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory  } from '../../redux/categoriesSlice.js';


const ControlCategoria = () => {
  const [showForm, setShowForm] = useState(false);
  const { items: categories, error} = useSelector((state) => state.categories); // nos traemos las categorias
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();

  const handleEdit = async (body) => {
    setSelectedCategory(body);
    setShowForm(true);
  };

const handleDelete = async (id) => {
  const confirm = await Swal.fire({
    title: "¿Eliminar categoría?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!confirm.isConfirmed) return;

    dispatch(deleteCategory(id))
    if(error) {
      Swal.fire("Error", error.message || "No se pudo eliminar la categoría.", "error");
    } else {
      Swal.fire("Eliminada", "La categoría fue eliminada correctamente ✅", "success");
    }
};
  
  return (
    <div className="panel-layout-container">
      <div className="header">
        <h2>Control de Categorias</h2>
        <button className="add-btn" onClick={() => {
          setSelectedCategory(null);
          setShowForm(true);
        }}>+ Agregar Categoria</button>
      </div>

      {showForm && (
        <CategoryForm
          category={selectedCategory}
          onClose={() => setShowForm(false)}
        />
      )}

      <table className="panel-layout-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <CategoryRow
              key={cat.id}
              category={cat}
              onEdit={() => handleEdit(cat)}
              onDelete={() => handleDelete(cat.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ControlCategoria;