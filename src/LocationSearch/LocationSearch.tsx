import { Control, ControlPosition, DomUtil } from "leaflet";
import { FC, useRef, useEffect } from "react";
import { Root, createRoot } from "react-dom/client";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import "./LocationSearch.css";
import searchIcon from "../assets/search-icon.svg";

const LocationSearch: FC<{ position: ControlPosition }> = ({position}) => {
    const map = useMap();
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<Root | null>(null);
    useEffect(() => {
        console.log("🎄LocationSearch mounted🎄");
        const control = new Control({position});
        control.onAdd = () => {
            const container = DomUtil.create("div", "leaflet-control");
            controlContainerRef.current = container;
            rootRef.current = createRoot(container);
            rootRef.current.render(
                <div className="search-box">
                    <input id="searchinput" type="text" className="search-input" placeholder="Location name" />
                    <a className="search-btn" href="#">
                        <img src={searchIcon} alt="Search"/>
                    </a>
                </div>
            );
            return container;
        }
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
    },[])
    return null;
}

export default LocationSearch;