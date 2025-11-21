import React, { useState, useEffect } from "react";
import "../../estilos/FiltroProducto.css";
import logo from "../../assets/logo.png";
import Swal from "sweetalert2";
import { setFiltrosAplicar } from "../../redux/productSlice";
import { fetchCategories } from "../../redux/categoriesSlice";
import {useDispatch, useSelector} from 'react-redux'


const FiltroProducto = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas"); // inicializamos todas como filtro automatico
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

const dispatch = useDispatch()
const {items} = useSelector((state) => state.categories);

  useEffect(()=>{
  dispatch(fetchCategories())
}, [dispatch])

  const filtroApasar = () => { 

    Swal.fire({ // consultamos si quiere aplicar los filtros y si quiere lo despachamos al estado global
      title: "¿Aplicar filtros?",
      text: "Se filtrarán los productos según categoría y precio.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6c2bd9",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, aplicar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(setFiltrosAplicar({ // despachamos los filtros al estado global con lo que esta en el state en ese momento
          categoria: categoriaSeleccionada,
          precioMin: precioMin ? Number(precioMin) : null,
          precioMax: precioMax ? Number(precioMax) : null,
        }));
      }
    });
  };

const categorias = ["Todas", ...items.map((cat) => cat.description)]; // creamos categroias unicamente con sus descripciones para la visualizacion
  
  return (
    <div className="filtro-producto">
      <div className="panel-body">
        <h3 className= "text">Categorías</h3>
        <div className="categoria-lista">
          {categorias.map((cat) => (
            <button
              key={cat}
              className={`categoria-btn ${categoriaSeleccionada === cat ? "activa" : ""}`} // renderizamos los botones de las categorias
              onClick={() => setCategoriaSeleccionada(cat)}
            >
            {cat}
            </button>
          ))}
        </div>

        <h3 className= "text">Rango de precio</h3>
        <div className="precio-inputs">
          <input
            type="number"
            placeholder="Mínimo"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            min="0"
          />
          <input
            type="number"
            placeholder="Máximo"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            min="0"
          />
        </div>
        <button className="aplicar-btn" onClick={() =>filtroApasar()} disabled={precioMin && precioMax && Number(precioMin) > Number(precioMax)} // aca pasamos como parametro los filtros seleccionados
        >
          Aplicar filtros
        </button>
        <div className="filtro-footer">
        <img src={logo} alt="GeekHaven Logo" className="filtro-logo" />
        <h2 className="filtro-title">GeekHaven</h2>
      </div>
      </div>
      
    </div>
  );
};

export default FiltroProducto;

