import { Control, DomUtil, ControlPosition } from "leaflet";
import { useRef, useEffect } from "react";
import { useMap } from "react-leaflet";
import { createRoot, Root } from "react-dom/client";
import L from "leaflet";

const Selector: React.FC<{ position: ControlPosition; children: React.ReactNode }> = ({ position, children }) => {
    const map = useMap();
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<Root | null>(null);

    useEffect(() => {
        const control = new Control({ position });
        control.onAdd = () => {
            console.log("Adding control");
            const container = DomUtil.create("div", "leaflet-control");
            controlContainerRef.current = container;
            rootRef.current = createRoot(container);
            return container;
        };
        control.onRemove = () => {
            if (rootRef.current) {
                rootRef.current.unmount();
                rootRef.current = null;
            }
            controlContainerRef.current = null;
        };
        map.addControl(control);

        return () => {
            map.removeControl(control);
        };
    }, [map, position]);

    useEffect(() => {
        if (controlContainerRef.current && rootRef.current) {
            rootRef.current.render(children);
            L.DomEvent.disableClickPropagation(controlContainerRef.current);
        }
    }, [children]);

    return (
        <div ref={controlContainerRef} style={{backgroundColor: "#1edf97"}}>
            {children}
        </div>
    );
};

export default Selector;
