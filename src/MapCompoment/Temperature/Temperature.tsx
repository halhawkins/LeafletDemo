import { FC, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { TileLayer, useMap } from "react-leaflet";
import { Control, ControlPosition, DomUtil } from "leaflet";
import { createRoot, Root } from "react-dom/client";

const Temperature: FC = () => {
    const lat = useSelector((state: RootState) => state.mapState.lat);
    const lng = useSelector((state: RootState) => state.mapState.lng);
    return (
        <div><TileLayer opacity={1} url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=dfba23226395d24a4c6293b1c3e8821b`}/><TemperaureLegend position="topleft"/></div>
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
  
export const TemperaureLegend: FC<{ position: ControlPosition }> = ({ position }) => {
    const map = useMap();
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<Root | null>(null);

    useEffect(() => {
        const control = new Control({ position });

        // Define onAdd before calling addControl
        control.onAdd = () => {
            const container = DomUtil.create("div", "leaflet-control");
            controlContainerRef.current = container;
            rootRef.current = createRoot(container);

            // Render the legend inside the control
            rootRef.current.render(
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {temperatureStops.map((stop, index) => (
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
                            }}
                        >
                            {stop.value}°C
                        </span>
                    ))}
                </div>
            );

            return container;
        };

        // Define onRemove before calling addControl
        control.onRemove = () => {
            if (rootRef.current) {
                rootRef.current.unmount();
                rootRef.current = null;
            }
            controlContainerRef.current = null;
        };

        // Add control to the map
        map.addControl(control);

        return () => {
            map.removeControl(control);
        };
    }, [map, position]);

    return null; // No direct rendering in the component's JSX
};

export default Temperature;