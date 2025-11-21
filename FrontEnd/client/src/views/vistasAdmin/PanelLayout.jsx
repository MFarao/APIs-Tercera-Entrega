import { Outlet } from "react-router-dom";
import PanelDeControl from "../../components/PanelDeControl";
import "../../estilos/PanelDeControl.css";
import "../../estilos/PanelLayout.css";

const PanelLayout = () => {
  return (
    <div className="panel-layout">
      <PanelDeControl />
      <div className="panel-content">
        <Outlet /> {/* Aquí se cargan las vistas internas, como categorías, usuarios, etc. */}
      </div>
    </div>
  );
};

export default PanelLayout;