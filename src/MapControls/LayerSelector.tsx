import { FC, useEffect, useRef, useState } from "react";
import L from "leaflet";
import dotsMenu from "../assets/dots-menu.svg";
import "./Selector.css";
import { useDispatch } from "react-redux";
import { toggleLayer } from "../Slices/SelectorSlice"
import { AppDispatch, store } from "../store";

const LayerSelector: FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const dotsMenuRef = useRef<HTMLDivElement>(null);
  const expandedMenuRef = useRef<HTMLDivElement>(null);
  // const dispatch = useDispatch<AppDispatch>()
  const { dispatch } = store;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const setSelection = (selection: string) => {
    console.log(`Selected: ${selection}`);
    dispatch(toggleLayer(selection));
    setExpanded(false);
  };

  useEffect(() => {
    if (dotsMenuRef.current) {
      L.DomEvent.disableClickPropagation(dotsMenuRef.current);
    }
    if (expandedMenuRef.current) {
      L.DomEvent.disableClickPropagation(expandedMenuRef.current);
    }
  }, []);

  useEffect(() => {
    if (expanded && expandedMenuRef.current) {
      console.log("Adding click propagation to expanded menu");
      L.DomEvent.disableClickPropagation(expandedMenuRef.current);
    }
  }, [expanded]);

  return (
    <div className="menu-container">
       <div className="dots-menu" onClick={handleToggle} ref={dotsMenuRef}>
         <img src={dotsMenu} alt="dots menu" />
       </div>
       {expanded && (
         <div className="expanded-menu" ref={expandedMenuRef}>
           <div onClick={() => setSelection('radar')}>Radar</div>
           <div onClick={() => setSelection('clouds')}>Clouds</div>
           <div onClick={() => setSelection('temperature')}>Temperature</div>
           <div onClick={() => setSelection('precipitation')}>Precipitation</div>
           <div onClick={() => setSelection('pressure')}>Pressure</div>
           <div onClick={() => setSelection('wind')}>Wind Speed</div>
         </div>
       )}
    </div>
  )
};


export default LayerSelector;
