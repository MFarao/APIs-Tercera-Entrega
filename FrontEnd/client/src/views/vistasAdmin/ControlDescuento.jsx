import { useEffect, useState } from "react";
import DiscountForm from "../../components/controlAdmin/DiscountForm";
import DiscountRow from "../../components/controlAdmin/DiscountRow";
 
const ControlDescuento = () => {
    const [discounts, setDiscounts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);

    const fetchDiscounts = () => { // creamos el fetch de las ordenes
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token no disponible");
            return;
        }

        fetch("http://localhost:4002/discounts", {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
            })
            .then((data) => setDiscounts(data))
            .catch((error) => console.error("Error fetching discounts:", error));
        };


    useEffect(() => {
        fetchDiscounts();
    }); // la metemos en el useffect para que recargue el componente 

    const handleEdit = (discount) => {
        setSelectedDiscount(discount);
        setShowForm(true);
    };

    const handleToggle = async (id) => {
        try {
            const res = await fetch(`http://localhost:4002/discounts/${id}/deactivate`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            });

            if (!res.ok) throw new Error("Error al cambiar estado");

            const updated = await res.json();

            
            setDiscounts((prev) =>
            prev.map((d) => (d.id === updated.id ? updated : d))
        );
  } catch (err) {
    console.error("Error al activar/inactivar", err);
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
                    onRefresh={fetchDiscounts}
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