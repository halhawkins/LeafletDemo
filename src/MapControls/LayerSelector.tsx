import { FC, useEffect, useRef, useState } from "react";
import L, { Control, DomUtil } from "leaflet";
import dotsMenu from "../assets/dots-menu.svg";
import "./Selector.css";
import { useDispatch } from "react-redux";
import { toggleLayer } from "../Slices/SelectorSlice"
import { AppDispatch, RootState, store } from "../store";
import { Root, createRoot } from "react-dom/client";
import { useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { setLocation } from "../MapCompoment/MapStateSlice";
import pin from "../assets/pin.png";

const LayerSelector: FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const rootRef = useRef<Root | null>(null);
  const controlContainerRef = useRef<HTMLDivElement | null>(null);
  const dotsMenuRef = useRef<HTMLDivElement>(null);
  const expandedMenuRef = useRef<HTMLDivElement>(null);
  const recentLocations = useSelector((state: RootState) => state.mapState.recentLocation)
  const map = useMap();
  const { dispatch } = store;
  const [showRecent, setShowRecent] = useState(false);

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
  }, [map, recentLocations]);

  useEffect(() => {
    if (rootRef.current && controlContainerRef.current) {
      const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setExpanded((prev) => !prev);
      };
      renderControlContent(handleToggle);
    }
  }, [expanded]);

  const handleLocationMenuClick = () => {
    console.log("location menu clicked", showRecent);
    setShowRecent(!showRecent);
  }

  const renderControlContent = (handleToggle: (e: React.MouseEvent) => void) => {
    rootRef.current?.render(
      <div className="layer-selector-container">
        <div className="dots-menu" onClick={handleToggle} ref={dotsMenuRef}>
          <img src={dotsMenu} alt="dots menu" />
        </div>
        {expanded && (
          <div className="expanded-menu" ref={expandedMenuRef} onClick={(e) => e.stopPropagation()}>
            <div className="submenu" onClick={() => setShowRecent(!showRecent)}>
              <div>Recent Locations</div>
              {showRecent && recentLocations.map((location, index) => (
                location.name.length > 0 ? 
                  <div key={index} onClick={() => { dispatch(setLocation({lat: location.lat,lng: location.lng})); setExpanded(false); }}>
                    <img src={pin} alt="pin" style={{width: "16px"}}/>&nbsp;
                    {location.name.substring(0,location.name.lastIndexOf(',')).substring(0,15).length > 17 ? location.name.substring(0,location.name.lastIndexOf(',')).substring(0,15) + "..." : location.name.substring(0,location.name.lastIndexOf(',')).substring(0,15)}
                  </div> : null
              ))}
            </div>
            <div onClick={() => { dispatch(toggleLayer('radar')); setExpanded(false); }}>Radar</div>
            <div onClick={() => { dispatch(toggleLayer('clouds')); setExpanded(false); }}>Clouds</div>
            <div onClick={() => { dispatch(toggleLayer('temperature')); setExpanded(false); }}>Temperature</div>
            <div onClick={() => { dispatch(toggleLayer('precipitation')); setExpanded(false); }}>Precipitation</div>
            <div onClick={() => { dispatch(toggleLayer('pressure')); setExpanded(false); }}>Pressure</div>
            <div onClick={() => { dispatch(toggleLayer('wind')); setExpanded(false); }}>Wind Speed</div>
          </div>
        )}
      </div>
    );
  };


  return null;
};

export default LayerSelector;
