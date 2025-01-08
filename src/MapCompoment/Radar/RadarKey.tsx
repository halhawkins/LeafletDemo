import { FC, useEffect, useMemo, useRef } from "react";
import { dBZScheme } from "./Reflectivity";
import "./Radar.css";
import { useMap } from "react-leaflet";
import { Control, ControlPosition, DomUtil } from "leaflet";
import { createRoot, Root } from "react-dom/client";
import { createPortal } from "react-dom";

const RadarKey: FC<{ position: ControlPosition }> = ({ position }) => {
    const map = useMap();
    const nthStop = 7;

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
        }
    }, [map, position]);

    return createPortal(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {dBZScheme[0].filter((_, index) => index % nthStop === 0).map((stop, index) => (
            <div 
                key={`rain-${index}`}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            >
            <span
                style={{
                    fontSize: '10px',
                    textAlign: 'center',
                    backgroundColor: stop.Rain,
                    padding: '2px 5px',
                    margin: '1px 0',
                    color: 'black',
                    textShadow: '-1px -1px 0 rgba(0, 0, 0, 0.5)',
                    borderRadius: '4px',
                    width: '42px'
                }}
            >
                {stop.dBZ} dBZ
            </span>
            <span
            key={`snow-${index}`}
            style={{
                fontSize: '10px',
                textAlign: 'center',
                backgroundColor: stop.Snow,
                padding: '2px 5px',
                margin: '1px 0',
                color: 'black',
                textShadow: '-1px -1px 0 rgba(0, 0, 0, 0.5)',
                borderRadius: '4px',
                width: '42px'
            }}
        >
            {stop.dBZ} dBZ
        </span>
        </div>
    ))}
    </div>
    , controlDiv);
};

export default RadarKey;
