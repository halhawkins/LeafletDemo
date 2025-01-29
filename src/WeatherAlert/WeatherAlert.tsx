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
import "../CurrentConditions/CurrentConditions.css";
import "./WeatherAlert.css";
import north from "../assets/north.svg";
import south from "../assets/south.svg";
import east from "../assets/east.svg";
import west from "../assets/west.svg";
import ne from "../assets/ne.svg";
import se from "../assets/se.svg";
import nw from "../assets/nw.svg";
import sw from "../assets/sw.svg";

const WeatherAlerts: FC<{ position: ControlPosition }> = ({ position }) => {
    const map = useMap();
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    const containerDiv = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<Root | null>(null);
    const alerts = useSelector((state: RootState) => state.mapState.weatherData?.alerts);
    const controlRef = useRef<Control | null>(null);
    const [rendered, setRendered] = useState(false);

    const windDirectionIcon = (windDirection: number) => {
        if (windDirection >= 0 && windDirection < 22.5)
            return north;
        else if (windDirection >= 22.5 && windDirection < 67.5)
            return ne;
        else if (windDirection >= 67.5 && windDirection < 112.5)
            return east;
        else if (windDirection >= 112.5 && windDirection < 157.5)
            return se;
        else if (windDirection >= 157.5 && windDirection < 202.5)
            return south;
        else if (windDirection >= 202.5 && windDirection < 247.5)
            return sw;
        else if (windDirection >= 247.5 && windDirection < 292.5)
            return west;
        else if (windDirection >= 292.5 && windDirection < 337.5)
            return nw;
        else return north;
    }

    useEffect(() => {
        const control = new Control({ position });
        control.onAdd = () => {
            const container = DomUtil.create("div", "leaflet-control hals-control");
            controlContainerRef.current = container;
            rootRef.current = createRoot(container);

            rootRef.current.render(
                <div className="current-conditions-container">
                    {alerts && (
                        <div className="current-conditions">
                            <div style={{color: "red", fontSize: "4rem", fontWeight: "400"}}>⚠</div>
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

    const handleClick = () => {
        if (containerDiv.current) {
            containerDiv.current.classList.toggle("hals-control-expanded");
        }
    }

    useEffect(() => {
        if (rootRef.current && controlContainerRef.current) {
            rootRef.current.render(
                <div ref={containerDiv} className="alerts-container" onClick={handleClick}>
                    {alerts && (
                        <div className="alerts">
                            <div style={{color: "#e70000", fontSize: "3.5rem", fontWeight: "300", marginTop: "-4px", textAlign: "center"}}>⚠</div>
                            {alerts && alerts.map((alert, index) => (
                                <div key={index} className="alert-item">
                                    <div className="alert-sender">{alert.sender_name}</div>
                                    <hr />
                                    <div className="alert-message">{alert.event}</div>
                                    <div className="alert-time">{new Date(alert.start).toLocaleString()}</div>
                                    <div className="alert-description">
                                        {alert.description}
                                    </div>
                                </div>
                            ))}
                        <div className="left-arrow"><span className="lt-symbol">&lt;</span></div>
                        <div className="right-arrow"><span className="gt-symbol">&gt;</span></div>
                        </div>
                    )}
                </div>
            );
        }
    }, [alerts]);

    return null;
};

export default WeatherAlerts;
