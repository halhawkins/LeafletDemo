import { FC, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { TileLayer, useMap } from "react-leaflet";
import { Control, ControlPosition, DomUtil } from "leaflet";
import { createRoot, Root } from "react-dom/client";
import { createPortal } from "react-dom";

const Temperature: FC = () => {
    const lat = useSelector((state: RootState) => state.mapState.lat);
    const lng = useSelector((state: RootState) => state.mapState.lng);
    return (
        <div><TileLayer opacity={1} url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=dfba23226395d24a4c6293b1c3e8821b`}/><TemperatureLegend position="topleft"/></div>
    );
}

const temperatureStops = [
    { value: -65, color: "rgba(130, 22, 146, 1)" },
    { value: -55, color: "rgba(130, 22, 146, 1)" },
    { value: -45, color: "rgba(130, 22, 146, 1)" },
    { value: -40, color: "rgba(130, 22, 146, 1)" },
    { value: -30, color: "rgba(130, 87, 219, 1)" },
    { value: -20, color: "rgba(32, 140, 236, 1)" },
    { value: -10, color: "rgba(32, 196, 232, 1)" },
    { value: 0, color: "rgba(35, 221, 221, 1)" },
    { value: 10, color: "rgba(194, 255, 40, 1)" },
    { value: 20, color: "rgba(255, 240, 40, 1)" },
    { value: 25, color: "rgba(255, 194, 40, 1)" },
    { value: 30, color: "rgba(252, 128, 20, 1)" },
  ];
  
export const TemperatureLegend: FC<{ position: ControlPosition }> = ({ position }) => {
    const map = useMap();
    const controlDiv = useMemo(() => {
        return DomUtil.create("div", "leaflet-control");
    },[]);

    useEffect(() => {
        const control = new Control({ position });
        control.onAdd = () => {
            return controlDiv;
        }

        map.addControl(control);

        return () => {
            map.removeControl(control);
        };
    }, [map, position, controlDiv]);

        return createPortal(
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: "1150" }}>
                {temperatureStops.map((stop, index) => (
                    <span
                        key={index}
                        style={{
                            width: '32px',
                            fontSize: '12px',
                            textAlign: 'center',
                            backgroundColor: stop.color,
                            padding: '2px 5px',
                            margin: '1px 0',
                            color: 'white',
                            textShadow: '-1px -1px 0 rgba(0, 0, 0, 0.5)',
                            borderRadius: '4px',
                        }}
                    >
                        {stop.value}°C
                    </span>
                ))}
            </div>
        , controlDiv
        )
};

export default Temperature;