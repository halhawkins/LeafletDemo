import { FC, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { TileLayer, useMap } from "react-leaflet";
import { Control, ControlPosition, DomUtil } from "leaflet";
import { createRoot, Root } from "react-dom/client";
import { createPortal } from "react-dom";

const Pressure: FC = () => {
    const lat = useSelector((state: RootState) => state.mapState.lat);
    const lng = useSelector((state: RootState) => state.mapState.lng);
    return (
        <div><TileLayer url={`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=dfba23226395d24a4c6293b1c3e8821b`}/><PressureLegend position="topleft" /></div>
    );
}


const pressureStops = [
    { value: 94000, color: "rgba(0,115,255,1)" },
    { value: 96000, color: "rgba(0,170,255,1)" },
    { value: 98000, color: "rgba(75,208,214,1)" },
    { value: 100000, color: "rgba(141,231,199,1)" },
    { value: 101000, color: "rgba(176,247,32,1)" },
    { value: 102000, color: "rgba(240,184,0,1)" },
    { value: 104000, color: "rgba(251,85,21,1)" },
    { value: 106000, color: "rgba(243,54,59,1)" },
    { value: 108000, color: "rgba(198,0,0,1)" },
  ];  

  export const PressureLegend: FC<{ position: ControlPosition }> = ({ position }) => {
      const map = useMap();
      const controlDiv = useMemo(() => {
        return DomUtil.create("div", "leaflet-control");
      }, [])

      useEffect(() => {
        const control = new Control({ position });
        control.onAdd = () => {
            return controlDiv;
        }

        map.addControl(control);

        return () => {
            map.removeControl(control);
        }
      }, [map, position, controlDiv]);

      return createPortal (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {pressureStops.map((stop, index) => (
                <span
                    key={index}
                    style={{
                        fontSize: '12px',
                        textAlign: 'center',
                        backgroundColor: stop.color,
                        padding: '2px 5px',
                        margin: '1px 0',
                        color: 'white',
                        textShadow: '-1px -1px 0 rgba(0, 0, 0, 0.5)',
                        borderRadius: '4px',
                        width: '52px'
                    }}
                >
                    {stop.value/100} hPa
                </span>
            ))}
        </div>
        , controlDiv
      );
  };
  
export default Pressure;