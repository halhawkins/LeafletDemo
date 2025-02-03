import L, { ControlPosition, DomUtil } from "leaflet";
import { FC, useEffect, useMemo, useRef } from "react";
import { useMap } from "react-leaflet";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { addSearchResults, toggleInSearch } from "../Slices/SearchSlice"
import { addRecentLocation, setLocation } from "../MapCompoment/MapStateSlice";
import { createPortal } from "react-dom";
import { setWeatherData } from "../MapCompoment/MapStateSlice";
// my template for leaflet controls in windspeed control
const LocationSearchResults: FC<{ position: ControlPosition }> = ({ position }) => {
    const map = useMap();
    const controlDiv = useMemo(() => {
        return DomUtil.create("div", "leaflet-control");
    }, []);
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    const { searchQuery, inSearch, searchResults } = useSelector((state: RootState) => state.search);
    const closeButtonRef = useRef<HTMLDivElement | null>(null);
    const { lat, lng } = useSelector((state: RootState) => state.mapState);
    const dispatch = useDispatch();

    useEffect(() => {
        const control = new L.Control({ position });
        control.onAdd = () => {
            return controlDiv;
        };

        map.addControl(control);

        if (controlContainerRef.current) {
            L.DomEvent.disableClickPropagation(controlContainerRef.current);
        }

        if (closeButtonRef.current) {
            L.DomEvent.disableClickPropagation(closeButtonRef.current);
        }

        return () => {
            map.removeControl(control);
        };
    }, [map, position]);

    const handleCloseSearch = () => {
        dispatch(toggleInSearch(false));
    }

    useEffect(() => {
        if (searchQuery.length > 3) {
            const fetchLocations = async () => {
                dispatch(toggleInSearch(true));
                try {
                    const response = await fetch(
                        `https://api.geoapify.com/v1/geocode/autocomplete?text=${searchQuery}&apiKey=47689dbbef774eb0a7a6854d23686cc5`
                    );
                    const data = await response.json();
                    dispatch(addSearchResults(data.features));
                } catch (error) {
                    console.error("Error fetching location data:", error);
                }
            };

            fetchLocations();
        }
    }, [searchQuery, dispatch]);

    const getWeatherData = async () => {
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&units=imperial&appid=dfba23226395d24a4c6293b1c3e8821b`);
        const data = await response.json();
        console.log("🎉🎉🎉openweathermap data = ", data);
        dispatch(setWeatherData(data))
    }
// 
    const handleResultClick = (result: any) => {
        return () => {
            console.log("Selected location:", result.geometry);
            getWeatherData();
            dispatch(setLocation({lat: result.geometry.coordinates[1], lng: result.geometry.coordinates[0]}));
            const newLocation = {lat: result.geometry.coordinates[1], lng: result.geometry.coordinates[0], name: result.properties.formatted};
            dispatch(addRecentLocation(newLocation));
        }   
    }

    return createPortal(
        <div className="search-results" ref={closeButtonRef}>
        <div className="close-search-btn" onClick={handleCloseSearch}>&#8855;</div>
        {searchResults.length > 0 ? (
            <div style={{display: "flex", flexDirection: "column", overflowY: "auto", maxHeight: "200px"}}>
                {searchResults.map((result, index) => {
                    return (
                    <div onClick={handleResultClick(result)} className="result-item" style={{display: "flex", alignItems: "flex-start", gap: "0.5rem"}} key={index}>
                        <div>{result.properties.formatted}</div>
                        {/* <div>{result.}</div> */}
                        {/* <div>{result.country}</div> */}
                    </div>                                
                )
            })}
            </div>
        ) : (
            <p>No results found</p>
        )}
    </div>,
    controlDiv
    )
};

export default LocationSearchResults;
