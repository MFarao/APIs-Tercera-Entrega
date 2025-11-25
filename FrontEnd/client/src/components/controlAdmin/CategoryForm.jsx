import { useState, useEffect } from "react";
import { updateCategory, createCategory } from "../../redux/categoriesSlice.js";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { updateDiscount } from "../../redux/discountSlice.js";

const CategoryForm = ({ category, onClose }) => {
  const [description, setDescription] = useState("");
  const [discountId, setDiscountId] = useState(""); 
  const dispatch = useDispatch();
  const { items: discounts } = useSelector((state) => state.discounts);

  useEffect(() => {
    if (category) {
      setDescription(category.description);
      setDiscountId(category.discountId ? String(category.discountId) : "");
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (category) {
        const res = await dispatch(
          updateCategory({ body: { id: category.id, description } })
        ).unwrap();

        if (discountId) {
          const updateBody = {
            id: Number(discountId),
            productsId: [],
            categoriesId: [res.id],
          };
          await dispatch(updateDiscount(updateBody)).unwrap();
        }
      } else {
        const res = await dispatch(createCategory({ description })).unwrap();

        if (discountId) {
          const updateBody = {
            id: Number(discountId),
            productsId: [],
            categoriesId: [res.id],
          };
          await dispatch(updateDiscount(updateBody)).unwrap();
        }

        Swal.fire("Agregada", "La categoría fue creada correctamente ✅", "success");
      }

      onClose();
    } catch (error) {
      Swal.fire("Error", error?.message || "No se pudo guardar la categoría.", "error");
    }
  };

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

      {category && 
        <><label>Descuento</label><select
            name="discountId"
            value={discountId}
            onChange={(e) => setDiscountId(e.target.value)}
          >
            <option value="">Sin descuento</option>
            {discounts
              .filter((d) => d.active)
              .map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {`${d.percentage}% - ${d.startDate} _ ${d.endDate}`}
                </option>
              ))}
          </select></>
        }

        <div className="form-actions">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
