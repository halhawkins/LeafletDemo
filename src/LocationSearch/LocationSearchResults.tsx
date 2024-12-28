import L, { ControlPosition, DomUtil } from "leaflet";
import { FC, useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import { useMap } from "react-leaflet";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { addSearchResults, toggleInSearch } from "../Slices/SeachSlice"
import { setLocation } from "../MapCompoment/MapStateSlice";
//"../store/searchSlice"; // Adjust based on your Redux slice

const LocationSearchResults: FC<{ position: ControlPosition }> = ({ position }) => {
    const map = useMap();
    const rootRef = useRef<Root | null>(null);
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    const { searchQuery, inSearch, searchResults } = useSelector((state: RootState) => state.search);
    const dispatch = useDispatch();

    useEffect(() => {
        const control = new L.Control({ position });

        control.onAdd = () => {
            const container = DomUtil.create("div", "leaflet-control");
            controlContainerRef.current = container;
            rootRef.current = createRoot(container);
            rootRef.current.render(
                <div className="search-results">
                    <div className="close-search-btn">&#8855;</div>
                    {inSearch ? <p>Searching for {searchQuery}</p> : <p>Search for a location</p>}
                </div>
            );
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

        
        if (controlContainerRef.current) {
            L.DomEvent.disableClickPropagation(controlContainerRef.current);
        }

        return () => {
            map.removeControl(control);
        };
    }, [map, position]);

    useEffect(() => {
        if (rootRef.current) {
            rootRef.current.render(
                <div className="search-results">
                    <div className="close-search-btn">&#8855;</div>
                    {inSearch ? <p>Searching for {searchQuery}</p> : <p>Search for a location</p>}
                </div>
            );
        }
    }, [searchQuery, inSearch]);

    useEffect(() => {
        if (searchQuery.length > 3) {
            const fetchLocations = async () => {
                dispatch(toggleInSearch(true));
                try {
                    const response = await fetch(
                        `http://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=25&appid=dfba23226395d24a4c6293b1c3e8821b`
                    );
                    const data = await response.json();
                    dispatch(addSearchResults(data));
                } catch (error) {
                    console.error("Error fetching location data:", error);
                }
            };

            fetchLocations();
        }
    }, [searchQuery, dispatch]);
// 
    const handleResultClick = (result: any) => {
        return () => {
            dispatch(setLocation({lat: result.lat, lng: result.lon}));
            // console.log("🏳️‍🌈result🏳️‍🌈", result);
        }
    }

    useEffect(() => {
        if (rootRef.current) {
            rootRef.current.render(
                <div className="search-results">
                    <div className="close-search-btn">&#8855;</div>
                    {searchResults.length > 0 ? (
                        <div style={{display: "flex", flexDirection: "column", overflowY: "auto", maxHeight: "200px"}}>
                            {searchResults.map((result, index) => {
                                return (
                                <div onClick={handleResultClick(result)} className="result-item" style={{display: "flex", alignItems: "flex-start", gap: "0.5rem"}} key={index}>
                                    <div>{result.name}</div>
                                    <div>{result.state}</div>
                                    <div>{result.country}</div>
                                </div>                                
                            )
                        })}
                        </div>
                    ) : (
                        <p>No results found</p>
                    )}
                </div>
            );
        }
    }, [searchResults]);

    return null;
};

export default LocationSearchResults;
