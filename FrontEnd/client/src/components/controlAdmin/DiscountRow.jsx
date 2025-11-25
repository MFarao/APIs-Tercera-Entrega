const DiscountRow = ({ discount, onEdit, onToggle }) => {
  return (
    <tr>
      <td>{discount.id}</td>
      <td>{discount.percentage}%</td>
      <td>{discount.startDate}</td>
      <td>{discount.endDate}</td>
      <td>
        <span className={discount.active ? "activo" : "inactivo"}>
          {discount.active ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td>
        <button className="button edit" onClick={() => onEdit(discount)}>Editar</button>
        <button className="button delete" onClick={() => onToggle(discount.id)}>
          {discount.active ? "🚫" : "✅"}
        </button>
      </td>
    </tr>
  );
};


export default DiscountRow;