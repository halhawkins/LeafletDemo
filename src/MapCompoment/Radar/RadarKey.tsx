import { FC, useEffect, useRef } from "react";
import { dBZScheme } from "./Reflectivity";
import "./Radar.css";
import { useMap } from "react-leaflet";
import { Control, ControlPosition, DomUtil } from "leaflet";
import { createRoot, Root } from "react-dom/client";

const RadarKey: FC<{ position: ControlPosition }> = ({ position }) => {
    const map = useMap();
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<Root | null>(null);

    useEffect(() => {
        const control = new Control({ position });

        control.onAdd = () => {
            const n = 5;
            console.log("Adding control");
            const container = DomUtil.create("div", "leaflet-control");
            controlContainerRef.current = container;
            rootRef.current = createRoot(container);
            rootRef.current.render(
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {dBZScheme[0].filter((_, index) => index % n === 0).map((stop, index) => (
                    <div 
                        key={`rain-${index}`}
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                    >
                    <span
                        style={{
                            fontSize: '12px',
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
                        {stop.dBZ}dBZ
                    </span>
                    <span
                    key={`snow-${index}`}
                    style={{
                        fontSize: '12px',
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
                    {stop.dBZ}dBZ
                </span>
                </div>
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

    return null;
};

export default RadarKey;
