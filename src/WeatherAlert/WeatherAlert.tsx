import L, { Control, ControlPosition, DomUtil } from "leaflet";
import { FC, useRef, useEffect, useState } from "react";
import { Root, createRoot } from "react-dom/client";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import "../CurrentConditions/CurrentConditions.css";
import "./WeatherAlert.css";

const WeatherAlerts: FC<{ position: ControlPosition }> = ({ position }) => {
    const map = useMap();
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    const containerDiv = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<Root | null>(null);
    const alerts = useSelector((state: RootState) => state.mapState.weatherData?.alerts);
    const lat = useSelector((state: RootState) => state.mapState.lat);
    const lng = useSelector((state: RootState) => state.mapState.lng);
    const controlRef = useRef<Control | null>(null);
    const [rendered, setRendered] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<number>(0);
    const lArrowRef = useRef<HTMLDivElement | null>(null);
    const rArrowRef = useRef<HTMLDivElement | null>(null);

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

        const container = controlContainerRef.current;

        if (container) {
            if (lArrowRef.current) {
                L.DomEvent.disableClickPropagation(lArrowRef.current);
            }
            if (rArrowRef.current) {
                L.DomEvent.disableClickPropagation(rArrowRef.current);
            }
        }

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

    const handleLeftArrowClick = () => {
        console.log("left arrow clicked");
        if (selectedAlert > 0) {
            setSelectedAlert(selectedAlert - 1);
        }
    }
    
    const handleRightArrowClick = () => {
        console.log("right arrow clicked");
        if (alerts?.length && alerts?.length > 0 && selectedAlert < alerts?.length - 1) {
            setSelectedAlert(selectedAlert + 1);
        }
    }

    useEffect(() => {
        console.log("alerts = ", alerts)
        if (rootRef.current && controlContainerRef.current) {
            rootRef.current.render(
                <div ref={containerDiv} className="alerts-container" onClick={handleClick}>
                    {alerts && (
                        <div className="alerts">
                            <div style={{color: "#e70000", fontSize: "3.5rem", fontWeight: "300", marginTop: "-4px", textAlign: "center"}}>⚠</div>
                            {alerts && alerts.length > 0 && (
                                <div style={{textAlign: "center"}}>
                                    <div className="alert-badge">{alerts?.length}</div>
                                </div>
                            )}
                            {/* {alerts && alerts.map((alert, index) => ( */}
                                <div className="alert-item">
                                    <div className="alert-sender">{alerts[selectedAlert].sender_name}</div>
                                    <hr />
                                    <div className="alert-message">{alerts[selectedAlert].event}</div>
                                    <div className="alert-time">Until: {new Date(alerts[selectedAlert].end * 1000).toLocaleString()}</div>{/**/}
                                    <div className="alert-description">
                                        {alerts[selectedAlert].description}
                                    </div>
                                </div>
                            {alerts && alerts.length > 1 && (
                                <>
                        <div className="left-arrow" ref={lArrowRef} onClick={handleLeftArrowClick}><span className="lt-symbol">&lt;</span></div>
                        <div className="right-arrow" ref={rArrowRef} onClick={handleRightArrowClick}><span className="gt-symbol">&gt;</span></div>
                        </>
                        )}
                        </div>
                    )}
                </div>
            );
        }
 
        if (lArrowRef.current) {
            L.DomEvent.disableClickPropagation(lArrowRef.current);
        }
        if (rArrowRef.current) {
            L.DomEvent.disableClickPropagation(rArrowRef.current);
        }
   }, [alerts, selectedAlert, lat, lng]);

    return null;
};

export default WeatherAlerts;
