import { FC, useEffect, useRef, useState } from "react";
import { TileLayer } from "react-leaflet";

const Radar: FC = () => {
    const radarTimeLine = useRef<{ path: string }[]>([]);
    const [frame, setFrame] = useState(0);
    const [tlLoading, setTlLoading] = useState(true);
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
            }
        })()
    }, [])

    return (
        <>
        { radarTimeLine.current && <TileLayer url={`https://tilecache.rainviewer.com${radarTimeLine.current[frame].path}/256/{z}/{x}/{y}/1/1_1.png`} />}
        </>
    )
}


export default Radar;
