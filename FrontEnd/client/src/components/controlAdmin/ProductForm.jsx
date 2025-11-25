import { useState, useEffect } from "react";
import { useDispatch, useSelector  } from "react-redux";
import Swal from "sweetalert2";
import { createProduct, updateProduct } from "../../redux/productSlice";
import { updateDiscount } from "../../redux/discountSlice";

const ProductForm = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);
  const { items: discounts } = useSelector((state) => state.discounts);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 1,
    categoryId: "",
    imageUrls: "",
    stock: 1,
    discountId: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parsedValue = type === "checkbox" ? checked : value;
    if (type === "number" && value <= 0) return;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmacion = await Swal.fire({
      title: "¿Publicar este producto?",
      text: "Estás por guardar y publicar este producto en la tienda.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6c2bd9",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, publicar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    const body = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      categoryId: formData.categoryId === "" ? null : Number(formData.categoryId),
      stock: formData.stock,
      discountId: formData.discountId === "" ? null : Number(formData.discountId),
    };

    if (formData.imageUrls) {
      if (typeof formData.imageUrls === "string") {
        body.imageUrls = formData.imageUrls
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url !== "");
      } else if (Array.isArray(formData.imageUrls)) {
        body.imageUrls = formData.imageUrls.filter((url) => typeof url === "string");
      }
    }


    const action = product
    ? updateProduct({ body, idProducto: product.id })
    : createProduct(body);

  dispatch(action)
    .then(async (res) => {
    // 🔹 Si se asignó un descuento, actualizamos también el discount en Redux

      const updateBody ={ 
        id: formData.discountId,
        productsId: [product.id],
        categoriesId: []
      };
      await dispatch(updateDiscount(updateBody)).unwrap();

      Swal.fire({
        title: "Producto cargado ✅",
        text: "El producto fue guardado correctamente.",
        icon: "success",
      });
      onClose();
    })
    .catch((error) => {
      Swal.fire({
        title: "Error",
        text: error || "No se pudo cargar el producto.",
        icon: "error",
      });
    });
};


  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        categoryId: product.categoryId ? String(product.categoryId) : "",
        imageUrls: Array.isArray(product.imageUrls)
          ? product.imageUrls.join(", ")
          : product.imageUrls || "",
        stock: product.stock || 0,
        active: product.active ?? true,
      });
    }
  }, [product]);

  const camposObligatorios = [
    formData.name,
    formData.description,
    formData.price,
    formData.stock,
  ];

  return (
    <div className="form-overlay">
      <form className="panel-layout-form" onSubmit={handleSubmit}>
        <h3>{product ? "Editar Producto" : "Agregar Producto"}</h3>

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Precio</label>
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <label>Categoría</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
        >
          <option value="">Sin categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.description}
            </option>
          ))}
        </select>

{product && (
        <><label>Descuento</label><select
            name="discountId"
            value={formData.discountId}
            onChange={handleChange}
          >
            <option value="">Sin descuento</option>
            {discounts.filter((d) => d.active).map((d) => (
              <option key={d.id} value={String(d.id)}>
                {`${d.percentage}% - ${d.startDate} _ ${d.endDate}`}
              </option>
            ))}
          </select></>
)}

        <input
          type="text"
          name="imageUrls"
          placeholder="URLs de imagen separadas por coma"
          value={formData.imageUrls}
          onChange={handleChange}
        />

        <label>Stock</label>
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />

        <div className="form-actions">
          <button type="submit" disabled={camposObligatorios.some((campo) => !campo)}>
            Guardar
          </button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;