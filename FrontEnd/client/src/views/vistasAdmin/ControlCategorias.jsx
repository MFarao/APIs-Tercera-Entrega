import { useEffect, useState } from "react";
import CategoryRow from "../../components/controlAdmin/CategoryRow";
import CategoryForm from "../../components/controlAdmin/CategoryForm";
import Swal from "sweetalert2";

const ControlCategoria = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCategories = () => {
    fetch("http://localhost:4002/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setSelectedCategory(category);
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

  try {
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
    fetchCategories();
  } catch (err) {
    Swal.fire("Error", "No se pudo eliminar la categoría. Porque tiene productos asociados", "error");
    console.error("Error al eliminar categoría:", err);
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
          onRefresh={fetchCategories}
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