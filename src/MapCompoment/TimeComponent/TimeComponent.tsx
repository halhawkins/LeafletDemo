import L, { ControlPosition, DomUtil } from "leaflet";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMap } from "react-leaflet";
import playIcon from "../../assets/play.svg"
import pauseIcon from "../../assets/pause.svg"
import toStart from "../../assets/tostart.svg"
import toEnd from "../../assets/toend.svg"

import "./TimeComponent.css";

interface TimeComponentProps {
    position: ControlPosition;
    maxValue: number;
    currentValue: number;
    onChange: (value: number) => void;
    onPlay: () => void;
    onPause: () => void; 
    isPlaying: boolean; 
}

const TimeComponent:FC<TimeComponentProps> = ({ 
    position, 
    maxValue, 
    currentValue, 
    onChange, 
    onPlay, 
    onPause,
    isPlaying 
}) => {
    const map = useMap();
    const [value, setValue] = useState(currentValue);

    const controlDiv = useMemo(() => {
        return DomUtil.create("div", "leaflet-control");
    }, [])

    const controlContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const control = new L.Control({ position })
        control.onAdd = () => {
            return controlDiv;
        }
        map.addControl(control);

        if (controlContainerRef.current) {
            L.DomEvent.disableClickPropagation(controlContainerRef.current);
        }

        return () => {
            map.removeControl(control);
        };
    },[map])

    // const handleChange = (value: number) => {
    //     onChange(value);
    // }

    const setNewValue = (value: number) => {
        setValue(value);
        map.setView([0, value], 1);

    }

    const handlePause = () => {
        onPause();
    }

    const handleToStart = () => {
        setNewValue(0);
    }
    const handleToEnd = () => {
        setNewValue(maxValue);
    }

    return createPortal(
        <div ref={controlContainerRef} className="time-control-container" >
            <div className="timeline-element">
               <button onClick={handleToStart}>
                    <img src={toStart} alt="To Start"/>
                </button>  
                {isPlaying ? 
                <button onClick={handlePause}>
                    <img src={pauseIcon} alt="Pause"/>
                </button> : 
                <button onClick={onPlay}>
                    <img src={playIcon} alt="Play"/>
                </button>
                 }
            </div>
            <div className="timeline-sleder-element">
            <input
                className="slider"
                type="range"
                min="0"
                max={maxValue}
                step="1"
                value={currentValue}
                style={{ 
                    width: "100%", 
                }}
                onChange={(e) => onChange(Number(e.target.value))}
            />
            </div>
            <div className="timeline-element">
                <button onClick={handleToEnd}>
                    <img src={toEnd} alt="To End"/>
                </button>
            </div>
        </div>,
        controlDiv
    )
}

export default TimeComponent;