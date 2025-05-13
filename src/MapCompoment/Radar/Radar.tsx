import { FC, useEffect, useRef, useState, useMemo, memo } from "react";
import { useMap, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import { addInfraredData, addRadarData, resetSatelliteData, setCurrentFrame, setPlaying } from "../SatelliteSlice";
import { store, RootState } from "../../store";
import TimeComponent from "../TimeComponent/TimeComponent";
import { createPortal } from "react-dom";
import "./Radar.css";
import { ControlPosition, DomUtil } from "leaflet";
const Radar: FC = () => {
    const map = useMap();
    const dispatch = useDispatch();
    const mapTimeline = useRef<{ path: string; time: number }[]>([]);
    const radarTimeLine = useSelector((state: RootState) => state.satalliteState.radarTimeline);
    const currentFrame = useSelector((state: RootState) => state.satalliteState.currentFrame);
    const [tlLoading, setTlLoading] = useState(true);
    const host = useRef('https://tilecache.rainviewer.com');
    const timelineRef = useRef<any>(null);
    let framePlayInterval = useRef<NodeJS.Timeout | null>(null);
    const [currentValue, setCurrentValue] = useState(0); // Added state for currentValue
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        (async () => {
            if (tlLoading) {
                dispatch(resetSatelliteData());
                const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
                const data = await response.json();
                if (data.host) {
                    host.current = data.host;
                }
                if (data.radar.past && data.radar.past.length > 0) {
                    data.radar.past.forEach((element:{time:number, path: string},index:number) => {
                        dispatch(addRadarData(element));                                       
                    });
                }
                if (data.radar && data.radar.past.length > 0) {
                    mapTimeline.current = data.radar.past.map((item: any) => ({
                        path: item.path,
                        time: new Date(item.time * 1000)
                    }));
                }
                if (data.radar.past && data.radar.past.length > 0) {
                    dispatch(addRadarData(data.radar.past));
                }
                setTlLoading(false);
            }
        })()
    }, []);

    useEffect(() => {
        setCurrentValue(currentFrame);
    }, [currentFrame]);

    const onPlay = () => {
        setIsPlaying(true);
        dispatch(setPlaying(true));
        framePlayInterval.current = setInterval(() => {
            const { currentFrame } = store.getState().satalliteState;
            const nextFrame = currentFrame < radarTimeLine.length ? currentFrame + 1 : 0;
            dispatch(setCurrentFrame(nextFrame));
        }, 2000);
    };

    const onPause = () => {
        setIsPlaying(false);
        dispatch(setPlaying(false));
        if (framePlayInterval.current) {
            clearInterval(framePlayInterval.current);
        }
    };
    
    const handleChange = (value: number) => {
        dispatch(setCurrentFrame(value));
        setCurrentValue(value);
    };

    const memoizedTileLayer = useMemo(() => {
        if (radarTimeLine[currentFrame]?.path) {
            return (
                <RadarTileLayer
                    host={host.current}
                    path={radarTimeLine[currentFrame].path}
                />
            );
        }
        return null;
    }, [radarTimeLine, currentFrame, host.current]);

    return (
        <>
            <TimeComponent 
                position="bottomleft" 
                maxValue={radarTimeLine.length - 1}  
                currentValue={currentValue}
                onChange={handleChange} 
                onPlay={onPlay}
                onPause={onPause}
                isPlaying={isPlaying}
            />
            {memoizedTileLayer}
        </>
    );
};

interface RadarTileLayerProps {
  host: string;
  path: string;
}

const RadarTileLayer: React.FC<RadarTileLayerProps> = ({host, path}) => {
  const layerRef = useRef<L.TileLayer>(null);
  const [opacity, setOpacity] = useState(0.6);
  const frame = useSelector((state: RootState) => state.satalliteState.currentFrame);
  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.setUrl(`${host}${path}/512/{z}/{x}/{y}/1/1_1.png`);
    }
  }, [host, path, frame]);

  const handleOpacity = (value:number) => {
    setOpacity(value);
  }

  return (
    <>
        <RadarOpacity value={0.6} onChange={handleOpacity} position="topright"/>
        <TileLayer
        ref={layerRef}
        opacity={opacity}
        url={`${host}${path}/512/{z}/{x}/{y}/1/1_1.png`}
        />
    </>
  );
};

const RadarOpacity: FC<{ position: ControlPosition, value: number, onChange: (value: number) => void}> = ({ position, value, onChange }) => {
    const [ctrlVal, setCtrlVal] = useState(value);
    const map = useMap();

    const controlDiv = useMemo(() => {
        return DomUtil.create("div", "leaflet-control");
    }, [])

    const controlContainerRef = useRef<HTMLDivElement | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCtrlVal(parseFloat(e.target.value));
        onChange(ctrlVal);
    }

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
    }, [map])
 
    return createPortal(
        <div 
        className="right-vertical-slider"
            style={{ 
                // position: "absolute", 
                top: '60px', 
                right: '32px', 
                transform: 'rotate(-90deg)',
                // width: "100%", 
                // height: "100%", 
                // zIndex: 1000 }}
            }}>
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={ctrlVal} 
                onChange={handleChange}
                className="radar-opacity-slider"
                 />
        </div>,
        document.body
    )
}


export default Radar;