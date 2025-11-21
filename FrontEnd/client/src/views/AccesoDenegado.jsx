import "../estilos/Auth.css";

const AccesoDenegado = () => {
  return (
    <div className="auth-container" style={{ textAlign: "center" }}>
      <h2>🚫 Acceso denegado</h2>
      <p>No tenés permisos para acceder a esta página.</p>
    </div>
  );
};

export default AccesoDenegado;