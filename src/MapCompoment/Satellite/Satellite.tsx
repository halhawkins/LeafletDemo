import { FC, useEffect, useRef, useState } from "react";
import { TileLayer } from "react-leaflet";

const Satellite: FC = () => {
    const satelliteTimeLine = useRef<{ path: string }[]>([]);
    const [frame, setFrame] = useState(0);
    const [tlLoading, setTlLoading] = useState(true);
    useEffect(() => {
        (async () => {
            if (tlLoading) {
                const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
                const data = await response.json();
                    if (data.radar && data.satellite.infrared.length > 0) {
                        satelliteTimeLine.current = [...data.satellite.infrared];
                    }
                console.log("radarTimeLine", satelliteTimeLine.current);
                setTlLoading(false);
            }
        })()
    }, [])

    return (
        <>
        { satelliteTimeLine.current[frame]?.path && <TileLayer opacity={0.6} url={`https://tilecache.rainviewer.com${satelliteTimeLine.current[frame].path}/512/{z}/{x}/{y}/0/0_0.png`} />}
        </>
    )
}

export default Satellite;