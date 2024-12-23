import L, { ControlPosition, DomUtil } from "leaflet";
import { FC, useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const LocationSearchResults: FC<{ position: ControlPosition }> = ({position}) => {
    const map = useMap();
    const rootRef = useRef<Root | null>(null);
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    const {searchQuery, inSearch, searchResults} = useSelector((state: RootState) => state.search);

    useEffect(() => {
        const control = new L.Control({position});

        control.onAdd = () => {
            const container = DomUtil.create("div", "leaflet-control");
            controlContainerRef.current = container;
            rootRef.current = createRoot(container);
            rootRef.current.render(
                <div className="search-results"><div className="close-search-btn" >&#8855;</div>
                    {inSearch ? <p>Searching for {searchQuery}</p> : <p>Search for a location</p>}
                </div>
            )
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

    useEffect(() => {
        console.log("searchQuery", searchQuery);
        if (rootRef.current) {
            rootRef.current.render(
                <div className="search-results"><div className="close-search-btn" >&#8855;</div>
                    {inSearch ? <p>Searching for {searchQuery}</p> : <p>Search for a location</p>}
                </div>
            )
        }
    },[searchQuery, inSearch]);

    useEffect(() => {
        const res = async () => {
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q={searchQuery}&limit={25}&appid=dfba23226395d24a4c6293b1c3e8821b`)
            .then(response => response.json())
            .then(data => {
                console.log("searchResults 1 ", data);
            })
        }
        console.log("searchResults 2 ", res);

        if (rootRef.current) {
            rootRef.current.render(
                <div className="search-results"><div className="close-search-btn" >&#8855;</div>
                    {inSearch? <p>Searching for {searchQuery}</p> : <p>Search for a location</p>}
                </div>
            )
        }
    },[searchResults])
    return null;
}

export default LocationSearchResults;