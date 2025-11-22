import { useEffect, useState } from "react";
import DiscountForm from "../../components/controlAdmin/DiscountForm";
import DiscountRow from "../../components/controlAdmin/DiscountRow";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { deactivateDiscount } from "../../redux/discountSlice";

const ControlDescuento = () => {
    const [showForm, setShowForm] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const dispatch = useDispatch();
    const { items: discounts, error } = useSelector((state) => state.discounts);

    const handleEdit = (discount) => {
        setSelectedDiscount(discount);
        setShowForm(true);
    };

    const handleToggle = async (id) => {
        dispatch(deactivateDiscount({ id }))
        if(error) {
            Swal.fire("Error", error.message || "No se pudo actualizar el descuento.", "error");
        } else {
            Swal.fire("Actualizado", "El descuento fue actualizado correctamente ✅", "success");
        }
    };
    
    return(
        <div className="panel-layout-container">
            <div className="header">
                <h2>Control de Descuentos</h2>
                <button className="add-btn" onClick={() => {
                    setSelectedDiscount(null);
                    setShowForm(true);
                }}>+ Agregar Descuento</button>
            </div>

            {showForm && (
                <DiscountForm
                    discount={selectedDiscount}
                    onClose={() => setShowForm(false)}
                />
            )}
            <table className="panel-layout-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Porcentaje</th>
                        <th>Fecha de Inicio</th>
                        <th>Fecha de Fin</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {discounts.map((discount) => (
                        <DiscountRow
                            key={discount.id}
                            discount={discount}
                            onEdit={() => handleEdit(discount)}
                            onToggle={() => handleToggle(discount.id)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default ControlDescuento;