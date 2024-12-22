import { tileLayer } from "leaflet";
import { FC, useEffect, useRef, useState } from "react";
import { TileLayer } from "react-leaflet";
import { TileLayer as LeafletTileLayer} from "leaflet";
import RadarKey from "./RadarKey";
const Radar: FC = () => {
    const radarTimeLine = useRef<{ path: string }[]>([]);
    // const tileLayerRef = useRef<typeof TileLayer>(null);
    const [frame, setFrame] = useState(0);
    const [tlLoading, setTlLoading] = useState(true);
    const tileLayerRef = useRef<LeafletTileLayer>(null); // so i can bring to front.
    useEffect(() => {
        (async () => {
            if (tlLoading) {
                const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
                const data = await response.json();
                    if (data.radar && data.radar.past.length > 0) {
                        radarTimeLine.current = [...data.radar.past];
                    }
                console.log("radarTimeLine", radarTimeLine.current);
                setTlLoading(false);
                if (tileLayerRef.current) {
                    // tileLayerRef
                }
            }
        })()
    }, [])

    return (
        <>
        { radarTimeLine.current[frame]?.path && <TileLayer ref={tileLayerRef} opacity={0.6} url={`https://tilecache.rainviewer.com${radarTimeLine.current[frame].path}/256/{z}/{x}/{y}/1/1_1.png`} />}
        <RadarKey position="topleft"/>
        </>
    )
}


export default Radar;

