import L, { Control, ControlPosition, DomUtil } from "leaflet";
import { FC, useRef, useEffect, useState } from "react";
import { Root, createRoot } from "react-dom/client";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import "./LocationSearch.css";
import searchIcon from "../assets/search-icon.svg";
import { useDispatch } from "react-redux";
import { setSearchQuery, toggleInSearch } from "../Slices/SeachSlice"

const LocationSearch: FC<{ position: ControlPosition }> = ({position}) => {
    const map = useMap();
    const [showResults, setShowResults] = useState<boolean>(false);
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    // const [searchQueryParameter, setSearchQueryParameter] = useState<string>("");
    const controlRef = useRef<Control | null>(null);
    const inputBoxRef = useRef<HTMLInputElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const searchControlRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<Root | null>(null);
    const inSearch = useSelector((state: RootState) => state.search.inSearch)
    const dispatch = useDispatch();
    useEffect(() => {
        const handleSearch = () => {
            console.log("searching for", inputBoxRef.current?.value);
        }
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.value !== "" && !inSearch) {
                dispatch(toggleInSearch(true));
            } else if (e.target.value === "" && inSearch) {
                dispatch(toggleInSearch(false));
            }
            dispatch(setSearchQuery(e.target.value));
        };

        const handleCloseSearch = () => {
            setShowResults(false);
        }

        console.log("🎄LocationSearch mounted🎄");
        const control = new Control({position});
        control.onAdd = () => {
            const container = DomUtil.create("div", "leaflet-control");
            controlContainerRef.current = container;
            rootRef.current = createRoot(container);
            rootRef.current.render(
                <div className="search-box" ref={searchControlRef}>
                    <input ref={inputBoxRef} id="searchinput" type="text" className="search-input" placeholder="Location name" onChange={handleInputChange} />
                    <button ref={buttonRef} className="search-btn" onClick={handleSearch}>
                        <img src={searchIcon} alt="Search"/>
                    </button>
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
        controlRef.current = control;

        if (controlContainerRef.current) {
            L.DomEvent.disableClickPropagation(controlContainerRef.current);
        }

        return () => {
            map.removeControl(control);
        };
    },[])
    return null;
}


export default LocationSearch;
