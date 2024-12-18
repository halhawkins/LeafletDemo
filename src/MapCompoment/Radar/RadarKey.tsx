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
        <div className="key-container">
            <div className="key-flex-container">
                <div className="dbz-values">
                    <div key={'legendkey'} className="dbz-value">
                        <div className="dbz-row" style={{height: '48px', marginBottom: '-18px', paddingTop: '4px'}}>
                            <div className="dbz-bar" style={{backgroundColor: 'white', height: '26px'}}><span className=" flipped">Rain</span></div>
                            <div className="dbx-bar" style={{backgroundColor: 'white', height: "32px"}}><span className=" flipped" style={{marginTop: '6px'}}>Snow</span></div>
                        </div>
                    </div>
                    {dBZScheme[0].map((value, index) => {
                        if (index === 0) {
                            return (
                                <div key={index} className="dbz-value">
                                    <div className="dbz-row">
                                        <div className="dbz-bar" style={{backgroundColor: value.Rain}}>{value.dBZ}</div>
                                        <div className="dbx-bar" style={{backgroundColor: value.Snow}}>{value.dBZ}</div>
                                    </div>
                                </div>
                        );
                        }
                        if (index % 4 === 0) {
                            return (
                                <div key={index} className="dbz-value">
                                    <div className="dbz-row">
                                        <div className="dbz-bar" style={{backgroundColor: value.Rain}}>{value.dBZ}</div>
                                        <div className="dbx-bar" style={{backgroundColor: value.Snow}}>{value.dBZ}</div>
                                    </div>
                                </div>
                            );
                        }                    
                    })}
                </div>
            </div>
        </div>
    );
};

export default RadarKey;
