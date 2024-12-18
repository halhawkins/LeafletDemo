import { FC, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { TileLayer, useMap } from "react-leaflet";
import { Control, ControlPosition, DomUtil } from "leaflet";
import { createRoot, Root } from "react-dom/client";

const Precipitation: FC = () => {
    const lat = useSelector((state: RootState) => state.mapState.lat);
    const lng = useSelector((state: RootState) => state.mapState.lng);
    return (
        <div><TileLayer url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=dfba23226395d24a4c6293b1c3e8821b`}/></div>
    );
}


const temperatureStops = [
    { value: 0, color: "rgba(225, 200, 100, 0)" },
    { value: 0.1, color: "rgba(200, 150, 150, 0)" },
    { value: 0.2, color: "rgba(150, 150, 170, 0)" },
    { value: 0.5, color: "rgba(120, 120, 190, 0)" },
    { value: 1, color: "rgba(110, 110, 205, 0.3)" },
    { value: 10, color: "rgba(80, 80, 225, 0.7)" },
    { value: 140, color: "rgba(20, 20, 255, 0.9)" },
  ];  
export const PrecipitationLegend: FC<{ position: ControlPosition }> = ({ position }) => {
    const map = useMap();
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<Root | null>(null);

    useEffect(() => {
        const control = new Control({ position });

        // Define onAdd before calling addControl
        control.onAdd = () => {
            console.log("Adding control");
            const container = DomUtil.create("div", "leaflet-control");
            controlContainerRef.current = container;
            rootRef.current = createRoot(container);

            // If you want to render something immediately, you can do so here:
            // rootRef.current.render(<YourCustomContent />);

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

        // Now that onAdd and onRemove are defined, safely add the control
        map.addControl(control);

        return () => {
            map.removeControl(control);
        };
    }, [map, position]);

    return (
        <div style={{ display: 'flex', zIndex: '1965', position: "relative", width: '48px', top: "6rem", left: "1rem"}}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', border: '1px solid #000', height: '300px'}}>
          {temperatureStops.map((stop, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                backgroundColor: stop.color,
                height: '100%',
              }}
              title={`${stop.value} mm`}
            />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection:"column", justifyContent: 'space-between', width: '100%' }}>
          {temperatureStops.map((stop, index) => (
            <span key={index} style={{ fontSize: '12px', textAlign: 'center' }}>
              {stop.value}mm
            </span>
          ))}
        </div>
      </div>
      );
};

export default Precipitation;