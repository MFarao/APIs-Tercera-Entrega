import React, { useState } from "react";
import "../../estilos/ConfiguracionUsuario.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/userSlice";
import { updateUser } from "../../redux/userSlice";

const ConfiguracionUsuario = () => {
    const [datos, setDatos] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const {userEnSesion} = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const handleLogout = () => {
        dispatch(logout()); // hacemos el logout seteando el estado global de user en sesion a null
        navigate("/");
    };

    const actualizarDatos = async (e) => { e.preventDefault();
        const { value: confirmar } = await Swal.fire({ // le pedimos que confirme los cambios 
            title: "Confirmar sus cambios",
            input: "text",
            inputLabel: "Ingresá CONFIRMAR en mayusculas para confirmar los cambios",
            inputPlaceholder: "Ingrese aqui...",
            inputAttributes: {
            autocapitalize: "off",
            autocorrect: "off",
            },
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmar) return; // si cancela, no escribe nada no hacemos nada
        if(confirmar !== "CONFIRMAR"){ // si escribe otra cosa que no sea confirmar decimos que no es correcta
            Swal.fire({
            text: 'Los cambios no se realizaron por falta de confirmacion.',
            icon: 'error',
        });
        }else{
            try {
                const body = { idUser: userEnSesion.id };// creamos el body con el id y dependiendo q haya lo agregamos

                if (datos.email) body.email = datos.email;
                if (datos.firstname) body.firstname = datos.firstname;
                if (datos.lastname) body.lastname = datos.lastname;
                if (datos.password) body.password = datos.password;
                dispatch(updateUser(body)) // despachamos las modificaciones
                Swal.fire({
                    title: 'Cambios guardados ✅',
                    text: 'Sus cambios se procesaron correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Salir',
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleLogout()
                    }
                });
                
            }
            catch(error)
                {Swal.fire({
                title: 'Error',
                text: 'No se pudo modificar los datos.',
                icon: 'error',
            });}
        }
    }
    
    return (
        <div className="account-container">
            <h1 className="account-title">Configuracion de Usuario</h1>
            <div className="account-tabs">
                <p className="tab active">Cuenta resgistrada como {`${userEnSesion.role}`}</p>
            </div>

        <form className="account-form" onSubmit={actualizarDatos}>
            <div className="form-group">
            <label>Nombre</label>
            <input name="firstname" value={datos.firstname} className= "text" placeholder={`${userEnSesion.firstname}`}
                onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label>Apellido</label>
            <input name="lastname" value={datos.lastname} className= "text" placeholder={`${userEnSesion.lastname}`}
                onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label>Correo Electronico</label>
            <input name="email" className= "text" value={datos.email} placeholder={`${userEnSesion.email}`}
                onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label>Contraseña</label>
            <input name="password" className= "text" value={datos.password} placeholder={"Contraseña"}
                onChange={handleChange}
            />
            </div>

            <button type="submit" className="save-button"disabled={!datos.password && !datos.email && !datos.lastname && !datos.firstname 
                // si no hay datos no deshabilitamos el boton
            }>
            Guardar cambios
            </button>
        </form>
        </div>
);
};

export default ConfiguracionUsuario;

