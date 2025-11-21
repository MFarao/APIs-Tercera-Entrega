import { useEffect, } from "react";
import {useDispatch, useSelector} from 'react-redux'
import ProductComponent from "./ProductComponent";
import "../../estilos/Product.css";
import { fetchProducts } from "../../redux/productSlice";


const ProductList = ({sale}) => {

const dispatch = useDispatch()
const {items, filtrosAplicar, busqueda} = useSelector((state) => state.products)

useEffect(()=>{
  dispatch(fetchProducts())
}, [dispatch])


  const aplicarFiltros = () => {

    if (filtrosAplicar === null) return items; //si no hay filtros en el estado global, devuelve todos los productos

    const { categoria, precioMin, precioMax } = filtrosAplicar; // desestructuramos los filtros

    return items.filter((p) => {
      const precioAFiltrar = p.priceDescuento > 0 ? p.priceDescuento : p.price;// si hay precio descuento tomamos ese, si no el normal

      const cumpleCategoria = !categoria || categoria === "Todas" || p.categoryName === categoria; // vemos si cumple los requisitos para que de true y que el filter se quede con el producto
      const cumplePrecioMin = !precioMin || precioAFiltrar >= precioMin;
      const cumplePrecioMax = !precioMax || precioAFiltrar <= precioMax;
      return cumpleCategoria && cumplePrecioMin && cumplePrecioMax;
    });
  };

  const productosMostrar = aplicarFiltros().filter( // aplicamos logica de busqueda y agarramos solo los activos y con stock 
    (p) => p.active && p.stock > 0 
    && (sale ? p.priceDescuento > 0 : true) // se muestran los que tienen precio descuento o todos (dependiendo si el prop sale viene true o false)
    && (busqueda === "" || // si no hay busqueda, muestra todo (rompia si no)
   p.name.toLowerCase().includes(busqueda.toLowerCase()) || p.description.toLowerCase().includes(busqueda.toLowerCase())));

  return (
    <>
      <div className="product-list">
        {productosMostrar
        .map((product) => (
          <ProductComponent
            key={product.id} // mandamos mediante props los datos que vamos a renderizar
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            priceDescuento={product.priceDescuento}
            discountEndDate={product.discountEndDate}
            categoryId={product.categoryId}
            categoryName={product.categoryName}
            imageUrls={product.imageUrls}
            stock={product.stock}
            active={product.active}
          />
        ))}
      </div>
    </>
  );
};

export default ProductList;