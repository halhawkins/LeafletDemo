import { FC, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { TileLayer, useMap } from "react-leaflet";
import { Control, ControlPosition, DomUtil } from "leaflet";
import { createRoot, Root } from "react-dom/client";

const WindSpeed: FC = () => {
    const lat = useSelector((state: RootState) => state.mapState.lat);
    const lng = useSelector((state: RootState) => state.mapState.lng);
    return (
        <div><TileLayer url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=dfba23226395d24a4c6293b1c3e8821b`}/><WindSpeedLegend position="topleft" /></div>
    );
}


const windSpeedStops = [
    { value: 1, color: "rgba(255,255,255, 0)" },
    { value: 5, color: "rgba(238,206,206, 0.4)" },
    { value: 15, color: "rgba(179,100,188, 0.7)" },
    { value: 16, color: "rgba(179,100,188, 0.7)" },
    { value: 25, color: "rgba(63,33,59, 0.8)" },
    { value: 50, color: "rgba(116,76,172, 0.9)" },
    { value: 100, color: "rgba(70,0,175,1)" },
    { value: 200, color: "rgba(13,17,38,1)" },
  ];  

  export const WindSpeedLegend: FC<{ position: ControlPosition }> = ({ position }) => {
      const map = useMap();
      const controlContainerRef = useRef<HTMLDivElement | null>(null);
      const rootRef = useRef<Root | null>(null);
  
      useEffect(() => {
          const control = new Control({ position });
  
          control.onAdd = () => {
              const container = DomUtil.create("div", "leaflet-control");
              controlContainerRef.current = container;
              rootRef.current = createRoot(container);
  
              rootRef.current.render(
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {windSpeedStops.map((stop, index) => (
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
                              {stop.value/100}m/s
                          </span>
                      ))}
                  </div>
              );
  
              return container;
          };
  
          control.onRemove = () => {
            if (rootRef.current) {
                rootRef.current?.unmount();
                rootRef.current = null;
            }
            controlContainerRef.current = null;
        };
  
          map.addControl(control);
  
          return () => {
              map.removeControl(control);
          };
      }, [map, position]);
  
      return null; // No direct rendering in the component's JSX
  };
  
export default WindSpeed;