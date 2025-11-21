import { useEffect, useState } from "react";
import CategoryRow from "../../components/controlAdmin/CategoryRow";
import CategoryForm from "../../components/controlAdmin/CategoryForm";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";


const ControlCategoria = () => {
  const [showForm, setShowForm] = useState(false);
  const categories = useSelector((state) => state.categories.items); // nos traemos las categorias
  const [selectedCategory, setSelectedCategory] = useState(null);

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

    const res = await fetch(`http://localhost:4002/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    Swal.fire("Eliminada", "La categoría fue eliminada correctamente.", "success");
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
          onRefresh={categories}
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