import L, { Control, ControlPosition, DomUtil } from "leaflet";
import { FC, useRef, useEffect, useState, useMemo } from "react";
// import { Root, createRoot } from "react-dom/client";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import "./LocationSearch.css";
import searchIcon from "../assets/search-icon.svg";
import { useDispatch } from "react-redux";
import { setSearchQuery, toggleInSearch } from "../Slices/SearchSlice"
import { createPortal } from "react-dom";

const LocationSearch: FC<{ position: ControlPosition }> = ({position}) => {
    const map = useMap();
    const [showResults, setShowResults] = useState<boolean>(false);
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    // const controlRef = useRef<Control | null>(null);
    const inputBoxRef = useRef<HTMLInputElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const searchControlRef = useRef<HTMLDivElement | null>(null);
    // const rootRef = useRef<Root | null>(null);
    const inSearch = useSelector((state: RootState) => state.search.inSearch)
    const dispatch = useDispatch();

    const controlDiv = useMemo(() => {
        return DomUtil.create("div", "leaflet-control");
    },[]);
    
    const handleCloseSearch = () => {
        setShowResults(false);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== "" && !inSearch) {
            dispatch(toggleInSearch(true));
        } else if (e.target.value === "" && inSearch) {
            dispatch(toggleInSearch(false));
        }
        dispatch(setSearchQuery(e.target.value));
    };

    const handleSearch = () => {
        console.log("searching for", inputBoxRef.current?.value);
    }

    useEffect(() => {
        const control = new Control({position});
        control.onAdd = () => {
            return controlDiv;
        };

        map.addControl(control);

        if (controlContainerRef.current) {
            L.DomEvent.disableClickPropagation(controlContainerRef.current);
        }

        if (searchControlRef.current) {
            L.DomEvent.disableClickPropagation(searchControlRef.current);
        }
        return () => {
            map.removeControl(control);
        }
    },[map, position,controlDiv,controlContainerRef]);

    return createPortal(
        <div className="search-box" ref={searchControlRef}>
            <input ref={inputBoxRef} id="searchinput" type="text" className="search-input" placeholder="Location name" onChange={handleInputChange} />
            <button ref={buttonRef} className="search-btn" onClick={handleSearch}>
                <img src={searchIcon} alt="Search"/>
            </button>
        </div>,
    controlDiv
    );
}


export default LocationSearch;
