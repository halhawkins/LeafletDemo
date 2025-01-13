import { FC, useEffect, useRef, useState } from "react";
import L, { Control, DomUtil } from "leaflet";
import dotsMenu from "../assets/dots-menu.svg";
import "./Selector.css";
import { useDispatch } from "react-redux";
import { toggleLayer } from "../Slices/SelectorSlice"
import { AppDispatch, store } from "../store";
import { Root, createRoot } from "react-dom/client";
import { useMap } from "react-leaflet";

const LayerSelector: FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const rootRef = useRef<Root | null>(null);
  const controlContainerRef = useRef<HTMLDivElement | null>(null);
  const dotsMenuRef = useRef<HTMLDivElement>(null);
  const expandedMenuRef = useRef<HTMLDivElement>(null);
  const map = useMap();
  const { dispatch } = store;

  // Hold the control in a ref so it’s not recreated unnecessarily
  const controlRef = useRef<Control | null>(null);

  useEffect(() => {
    if (!controlRef.current) {
      const control = new Control({ position: 'topright' });
      
      control.onAdd = () => {
        const container = DomUtil.create('div', 'leaflet-control');
        controlContainerRef.current = container;
        rootRef.current = createRoot(container);
        
        const handleToggle = (e: React.MouseEvent) => {
          e.stopPropagation();
          setExpanded((prev) => !prev);
        };

        renderControlContent(handleToggle); // initial render
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
      controlRef.current = control;

      // Just once: disable click propagation on initial refs if they exist
      if (dotsMenuRef.current) {
        L.DomEvent.disableClickPropagation(dotsMenuRef.current);
      }
      if (expandedMenuRef.current) {
        L.DomEvent.disableClickPropagation(expandedMenuRef.current);
      }
    }
  }, [map]);

  useEffect(() => {
    if (rootRef.current && controlContainerRef.current) {
      const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setExpanded((prev) => !prev);
      };
      renderControlContent(handleToggle);
    }
  }, [expanded]);

  const renderControlContent = (handleToggle: (e: React.MouseEvent) => void) => {
    rootRef.current?.render(
      <div className="layer-selector-container">
        <div className="dots-menu" onClick={handleToggle} ref={dotsMenuRef}>
          <img src={dotsMenu} alt="dots menu" />
        </div>
        {expanded && (
          <div className="expanded-menu" ref={expandedMenuRef} onClick={(e) => e.stopPropagation()}>
            <div onClick={() => { dispatch(toggleLayer('radar')); setExpanded(false); }}>Radar</div>
            <div onClick={() => { dispatch(toggleLayer('clouds')); setExpanded(false); }}>Clouds</div>
            <div onClick={() => { dispatch(toggleLayer('temperature')); setExpanded(false); }}>Temperature</div>
            <div onClick={() => { dispatch(toggleLayer('precipitation')); setExpanded(false); }}>Precipitation</div>
            <div onClick={() => { dispatch(toggleLayer('pressure')); setExpanded(false); }}>Pressure</div>
            <div onClick={() => { dispatch(toggleLayer('wind')); setExpanded(false); }}>Wind Speed</div>
            {/* <div onClick={() => { dispatch(toggleLayer('stations')); setExpanded(false); }}>Stations</div> */}
          </div>
        )}
      </div>
    );
  };

  return null;
};

export default LayerSelector;
