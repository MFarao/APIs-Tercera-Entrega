import { useState, useEffect } from "react";

const CategoryForm = ({ category, onClose, onRefresh }) => {
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (category) setDescription(category.description);
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem("user"))
    const method = category ? "PUT" : "POST";
    const url = category
      ? `http://localhost:4002/categories/${category.id}`
      : "http://localhost:4002/categories";

    fetch(url, {
      method,
      headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      body: JSON.stringify({ description }),
    })
      .then(() => {
        onRefresh();
        onClose();
      })
      .catch((err) => console.error("Error al guardar categoría:", err));
  };

  return (
    <div className="form-overlay">
      <form className="panel-layout-form" onSubmit={handleSubmit}>
        <h3>{category ? "Edit Category" : "Add Category"}</h3>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
