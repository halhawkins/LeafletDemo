import { FC, useEffect, useState } from "react";
import { Circle, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import { Marker, Popup } from "react-leaflet";
import { RootState } from "../../store";

const Stations: FC = () => {
    const map = useMap();
    const [stations, setStations] = useState<[]>([]); // Fetch data from API and populate this array with stations
    const lat = useSelector((state: RootState) => state.mapState.lat);
    const lng = useSelector((state: RootState) => state.mapState.lng);
    const east = useSelector((state: RootState) => state.mapState.east);
    const west = useSelector((state: RootState) => state.mapState.west);
    const south = useSelector((state: RootState) => state.mapState.south);
    const north = useSelector((state: RootState) => state.mapState.north);

    useEffect(() => {
        console.log("Map = ", map);
        const url = `https://api.synopticdata.com/v2/stations/latest?radius=${lat},${lng},100&limit=300&token=b95e26e6dd5d482c8c4d222c835d7e37`;
        const fetchStationData = async () => {
            const data = await fetch(url)
            const jsonData = await data.json();
            setStations(jsonData.STATION.slice(0, Math.min(300, jsonData.STATION.length) - 1));
        }
        if (east !== 0 && west !==0 && lat !== 0 && lng !== 0) {
            console.log("Map bounds = ", map.getBounds());
            console.log("Fetching station data " + url);
            // alert("Fetching station data " + url);
            fetchStationData();
        }
    }, []);
    return (
        <div style={{ zIndex:1050}}>
            {stations.map((station: any, index: number) => {
                return (
                    <Circle radius={12} stroke={true} fillColor="#ff7800" color="#000" key={index} center={[station.LATITUDE, station.LONGITUDE]} />
                    // <Marker key={index} position={[station.LATITUDE, station.LONGITUDE]}>
                    //     <Popup>
                    //         {/* {station.name} */}
                    //     </Popup>
                    // </Marker>
                );
            })
        }
        </div>
    );
}

export default Stations;