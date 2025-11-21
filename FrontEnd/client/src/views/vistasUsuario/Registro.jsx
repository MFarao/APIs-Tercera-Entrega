import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../estilos/Auth.css";
import {useDispatch, useSelector} from 'react-redux';
import { registerUser } from "../../redux/userSlice";

const Registro = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "USER"
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {error} = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((action) =>{
      if (action.type === "auth/registerUser/rejected") return; // si hubo un error no hacemos nada
        navigate("/inicio"); // lo mandamos a inicio para que haga el login

    })

  };

  return (
    <div className="auth-container">
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Nombre</label>
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          required
        />

        <label>Apellido</label>
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Crear cuenta</button>

        {error && <p className="error">{error}</p>}
      </form>

      <div>
        <Link to="/inicio">¿Ya tenes una cuenta?</Link>
      </div>
      <div>
        <Link to="/">Volver a la pagina de inicio</Link>
      </div>
    </div>
  );
};

export default Registro;