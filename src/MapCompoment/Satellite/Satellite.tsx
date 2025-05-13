import { FC, useEffect, useRef, useState, useMemo, memo } from "react";
import { useMap, TileLayer } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { addInfraredData, addRadarData, resetSatelliteData, setCurrentFrame, setPlaying } from "../SatelliteSlice";
import { store, RootState } from "../../store";
import TimeComponent from "../TimeComponent/TimeComponent";
import { createPortal } from "react-dom";
import "./Satellite.css";

const Satellite: FC = () => {
    const map = useMap();
    const dispatch = useDispatch();
    const satelliteTimeLine = useRef<{ path: string; time: number }[]>([]);
    const infraredTimeline = useSelector((state: RootState) => state.satalliteState.infraredTimeline);
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
                if (data.satellite && data.satellite.infrared.length > 0) {
                    data.satellite.infrared.forEach((element:{time:number, path: string},index:number) => {
                        console.log("infrared timeline", index, element);
                        dispatch(addInfraredData(element));                                       
                    });
                }
                if (data.radar && data.satellite.infrared.length > 0) {
                    satelliteTimeLine.current = data.satellite.infrared.map((item: any) => ({
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
        console.log("Loaded timeline frames:", infraredTimeline.length, infraredTimeline);
    }, [infraredTimeline]);

    useEffect(() => {
        setCurrentValue(currentFrame);
    }, [currentFrame]);

    const onPlay = () => {
        setIsPlaying(true);
        dispatch(setPlaying(true));
        framePlayInterval.current = setInterval(() => {
            const { currentFrame } = store.getState().satalliteState;
            const nextFrame = currentFrame < infraredTimeline.length ? currentFrame + 1 : 0;
            dispatch(setCurrentFrame(nextFrame));
            console.log("Play button clicked", currentFrame);
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
        if (infraredTimeline[currentFrame]?.path) {
            return (
                <SatelliteTileLayer
                    host={host.current}
                    path={infraredTimeline[currentFrame].path}
                />
            );
        }
        return null;
    }, [infraredTimeline, currentFrame, host.current]);

    return (
        <>
            <TimeComponent 
                position="bottomleft" 
                maxValue={infraredTimeline.length - 1}  
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

interface SatelliteTileLayerProps {
  host: string;
  path: string;
}

const SatelliteTileLayer: React.FC<SatelliteTileLayerProps> = ({host, path}) => {
  const layerRef = useRef<L.TileLayer>(null);
  const [opacity, setOpacity] = useState(0.6);
  const frame = useSelector((state: RootState) => state.satalliteState.currentFrame);
  useEffect(() => {
    console.log("Updating tile layer", host, path, frame);
    if (layerRef.current) {
      layerRef.current.setUrl(`${host}${path}/512/{z}/{x}/{y}/0/0_0.png`);
    }
  }, [host, path, frame]);

  const handleOpacity = (value:number) => {
    setOpacity(value);
    console.log("Opacity changed", value);
    // map.setLayerOpacity(value);
  }

  return (
    <>
        <SatelliteOpacity value={0.6} onChange={handleOpacity}/>
        <TileLayer
        ref={layerRef}
        opacity={opacity}
        url={`${host}${path}/512/{z}/{x}/{y}/0/0_0.png`}
        detectRetina
        zoomOffset={-1}
        />
    </>
  );
};

const SatelliteOpacity: FC<{ value: number, onChange: (value: number) => void}> = ({ value, onChange }) => {
    const [ctrlVal, setCtrlVal] = useState(value);
    const map = useMap();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCtrlVal(parseFloat(e.target.value));
        onChange(ctrlVal);
        // map.setLayerOpacity(value);
    }
 
    return createPortal(
        <div 
        className="opacity-slider"
            style={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                // width: "100%", 
                // height: "100%", 
                zIndex: 1000 }}>
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={ctrlVal} 
                onChange={handleChange}
                className="vertical-slider"
                 />
        </div>,
        document.body
    )
}


export default Satellite;