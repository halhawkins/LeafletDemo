import { FC, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { TileLayer, useMap } from "react-leaflet";
import { Control, ControlPosition, DomUtil } from "leaflet";
import { createRoot, Root } from "react-dom/client";
import { createPortal } from "react-dom";

const Precipitation: FC = () => {
    const lat = useSelector((state: RootState) => state.mapState.lat);
    const lng = useSelector((state: RootState) => state.mapState.lng);
    return (
        <div><TileLayer url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=dfba23226395d24a4c6293b1c3e8821b`}/><PrecipitationLegend position="topleft" /></div>
    );
}


const precipitationStops = [
    { value: 0, color: "rgba(225, 200, 100, 0)" },
    { value: 0.1, color: "rgba(200, 150, 150, 0.6)" },
    { value: 0.2, color: "rgba(150, 150, 170, 0.65)" },
    { value: 0.5, color: "rgba(120, 120, 190, 0.7)" },
    { value: 1, color: "rgba(110, 110, 205, 0.75)" },
    { value: 10, color: "rgba(80, 80, 225, 0.8)" },
    { value: 140, color: "rgba(20, 20, 255, 0.9)" },
  ];  

  export const PrecipitationLegend: FC<{ position: ControlPosition }> = ({ position }) => {
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

      return createPortal(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {precipitationStops.map((stop, index) => (
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
                        width: '48px'
                    }}
                >
                    {stop.value} mm
                </span>
            ))}
        </div>
        , controlDiv
      )
  };
  
export default Precipitation;