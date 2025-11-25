import { useEffect, } from "react";
import ProductComponent from "./ProductComponent";
import "../../estilos/Product.css";
import { useSelector, useDispatch } from 'react-redux';
import { setPage } from "../../redux/productSlice";



const ProductList = ({sale}) => {
 const dispatch = useDispatch();
  const { filtrosAplicar, busqueda, currentPage, pageSize } = useSelector((state) => state.products);
  const items = useSelector((state) => state.products.items);

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

  const productosFiltrados  = aplicarFiltros().filter( // aplicamos logica de busqueda y agarramos solo los activos y con stock 
    (p) => p.active && p.stock > 0 
    && (sale ? p.priceDescuento > 0 : true) // se muestran los que tienen precio descuento o todos (dependiendo si el prop sale viene true o false)
    && (busqueda === "" || // si no hay busqueda, muestra todo (rompia si no)
   p.name.toLowerCase().includes(busqueda.toLowerCase()) || p.description.toLowerCase().includes(busqueda.toLowerCase())));

  const totalPages = Math.max(1, Math.ceil(productosFiltrados.length / pageSize));
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const productosMostrar = productosFiltrados.slice(start, end);

  return (
    <>
    {productosMostrar.length > 0 && (
      <div className="pagination" style={{ marginTop: "2rem" }}>
        <button
          disabled={currentPage === 1}
          onClick={() => dispatch(setPage(currentPage - 1))}
        >
          Prev
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => dispatch(setPage(currentPage + 1))}
        >
          Next
        </button>
      </div>
    )}

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

      {productosMostrar.length === 0 && (
        <div className="no-products-container">
          <h3>No hay productos disponibles</h3>
          <p>Probá cambiar los filtros o la búsqueda.</p>
        </div>
      )}
    </>    
  );
};

export default ProductList;