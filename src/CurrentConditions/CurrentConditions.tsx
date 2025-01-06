// import { Control, ControlPosition, DomUtil } from "leaflet";
// import { FC, useRef, useEffect } from "react";
// import { Root, createRoot } from "react-dom/client";
// import { useMap } from "react-leaflet";
// import { useSelector } from "react-redux";
// import { RootState } from "../store";
// import "./CurrentConditions.css";

// const CurrentConditions: FC<{ position: ControlPosition }> = ({ position }) => {
//     const map = useMap();
//     const controlContainerRef = useRef<HTMLDivElement | null>(null);
//     const rootRef = useRef<Root | null>(null);
//     const weatherData = useSelector((state: RootState) => state.mapState.weatherData);

//     useEffect(() => {
//         const control = new Control({ position });
        
//         control.onAdd = () => {
//             const container = DomUtil.create("div", "leaflet-control");
//             controlContainerRef.current = container;
//             rootRef.current = createRoot(container);

//             rootRef.current.render(
//                 <div className="current-conditions-container">
//                     {weatherData && (
//                         <div className="current-conditions">
//                             <div className="current-temp-only">{Math.round(weatherData.current.temp)}°F</div>
//                         </div>
//                     )}
//                 </div>
//             );

//             return container;
//         };

//         control.onRemove = () => {
//             if (rootRef.current) {
//                 // Defer unmounting to avoid race condition with React rendering
//                 setTimeout(() => {
//                     rootRef.current?.unmount();
//                     rootRef.current = null;
//                 }, 0);
//             }
//             controlContainerRef.current = null;
//         };

//         map.addControl(control);

//         return () => {
//             map.removeControl(control);
//         };
//     }, [weatherData, map]);

//     return null;
// };

// export default CurrentConditions;
import { Control, ControlPosition, DomUtil } from "leaflet";
import { FC, useRef, useEffect, useState } from "react";
import { Root, createRoot } from "react-dom/client";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import "./CurrentConditions.css";

const CurrentConditions: FC<{ position: ControlPosition }> = ({ position }) => {
    const map = useMap();
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<Root | null>(null);
    const weatherData = useSelector((state: RootState) => state.mapState.weatherData);
    const controlRef = useRef<Control | null>(null);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        const control = new Control({ position });
        control.onAdd = () => {
            const container = DomUtil.create("div", "leaflet-control hals-control");
            controlContainerRef.current = container;
            rootRef.current = createRoot(container);

            rootRef.current.render(
                <div className="current-conditions-container">
                    {weatherData && (
                        <div className="current-conditions">
                            <div className="current-temp-only">{weatherData === null ? '-' : Math.round(weatherData.current.temp) + 'F°'}</div>
                        </div>
                    )}
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
        controlRef.current = control;

        return () => {
            if (controlRef.current) {
                map.removeControl(controlRef.current);
                controlRef.current = null;
            }
        };
    }, [map]);

    useEffect(() => {
        if (rootRef.current && controlContainerRef.current) {
            rootRef.current.render(
                <div className="current-conditions-container">
                    {weatherData && (
                        <div className="current-conditions">
                            <div className="current-temp-only">{Math.round(weatherData.current.temp)}°F</div>
                        </div>
                    )}
                </div>
            );
        }
    }, [weatherData]);

    return null;
};

export default CurrentConditions;
