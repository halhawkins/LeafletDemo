import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents, useMap } from "react-leaflet"
import L from "leaflet"
import { GeoPoint, GeoPoly } from "../GeoData"
import MapInteraction from "./MapInteraction"
import Radar from "./Radar/Radar"
import Selector from "../MapControls/Selector"
import "./MapComponent.css"
import LayerSelector from "../MapControls/LayerSelector"
import { useSelector } from "react-redux"
import { RootState, store } from "../store"
import { useEffect, useState } from "react"
import Satellite from "./Satellite/Satellite"
import RadarKey from "./Radar/RadarKey"
import marker from "leaflet/dist/images/marker-icon.png"
import Temperature, {TemperatureLegend} from "./Temperature/Temperature"
import Precipitation, {PrecipitationLegend} from "./Precipitation/Precipitation"
import Pressure from "./Pressure/Pressure"
import WindSpeed from "../WindSpeed/WindSpeed"
import Stations from "./Stations/Stations"
import CurrentConditions from "../CurrentConditions/CurrentConditions"
import LocationSearch from "../LocationSearch/LocationSearch"
import LocationSearchResults from "../LocationSearch/LocationSearchResults"
import { useDispatch } from "react-redux"
import { toggleInSearch } from "../Slices/SearchSlice"
import WeatherAlerts from "../WeatherAlert/WeatherAlert"
function MapComponent(){
    const poly = GeoPoly.map(p => {return {lat: p[0], lng: p[1]}})
    const layers = useSelector((state: RootState) => state.selector.layers);
    const [location, setLocation] = useState<{ lat: number, lng: number }>({lat: 42.456882503116724, lng: -74.06433105468751});
    const trackLocation = {lat: useSelector((state: RootState) => state.mapState.lat), lng: useSelector((state: RootState) => state.mapState.lng)};
    const [radarVisible, setRadarVisible] = useState(true);
    const [cloudsVisible, setCloudsVisible] = useState(true);
    const [temperatureVisible, setTemperatureVisible] = useState(true);
    const [precipitationVisible, setPrecipitationVisible] = useState(true);
    const [pressureVisible, setPressureVisible] = useState(true);
    const [windVisible, setWindVisible] = useState(true);
    const [stationsVisible, setStationsVisible] = useState(false);
    const alerts = useSelector((state: RootState) => state.mapState.weatherData?.alerts);
    const showSearchResults = useSelector((state: RootState) => state.search.inSearch)
    useEffect(() => {
        // console.log("layers changed", layers);
        if (layers.includes("radar")) {
            setRadarVisible(true);
        } else {
            setRadarVisible(false);
        }
        if (layers.includes("clouds")) {
            setCloudsVisible(true);
        } else {
            setCloudsVisible(false);
        }

        if (layers.includes("temperature")) {
            setTemperatureVisible(true);
        } else {
            setTemperatureVisible(false);
        }

        if (layers.includes("precipitation")) {
            setPrecipitationVisible(true);
        } else {
            setPrecipitationVisible(false);
        }

        if (layers.includes("pressure")) {
            setPressureVisible(true);
        } else {
            setPressureVisible(false);
        }

        if (layers.includes("wind")) {
            setWindVisible(true);
        } else {
            setWindVisible(false);
        }

        if (layers.includes("stations")) {
            setStationsVisible(true);
        } else {
            setStationsVisible(false);
        }
    }, [layers])

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({lat: latitude, lng: longitude});
                    console.log("User's current position: ", latitude, longitude);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                }
            );
        } else {
            setLocation({lat: 42.456882503116724, lng: -74.06433105468})
        }
    }

    useEffect(() => {
        getLocation();
    }, [])

    return (
        <div style={{width: "100%", height: '100%', position: "absolute"}}>
            <MapContainer center={GeoPoint} zoom={13} scrollWheelZoom={true} style={{ width:"100%", height: "100%", position: "fixed"}}>
            <LocationSearch position="bottomleft"/>
            {showSearchResults && <LocationSearchResults position="bottomleft"/>}
            <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // url="http://localhost:8000/api/weather/base/{s}/{z}/{x}/{y}.png"
                />
                <MapInteraction />
                { (() => {
                    if (radarVisible) {
                        console.log("Radar visible");
                        return (<Radar />)
                    } else {
                        console.log("Radar not visible");
                        return (<></>)
                    }
                })() }
                { (() => {
                    if (cloudsVisible) {
                        console.log("clouds visible");
                        return (<Satellite />)
                    } else {
                        console.log("clouds not visible");
                        return (<></>)
                    }
                })() }
                {temperatureVisible &&
                <Temperature />}
                {precipitationVisible &&
                <Precipitation />}
                {pressureVisible &&
                <Pressure />}
                {windVisible &&
                <WindSpeed />}
                {stationsVisible &&
                <Stations />}
                <LayerSelector />
                <Marker position={trackLocation} icon={L.icon({iconUrl: marker, iconSize: [25, 41]})}>
                    {/* <Popup>
                        You are here!
                    </Popup> */}
                </Marker>
                <CurrentConditions position="bottomright"/>
                {alerts && alerts.length > 0 && <WeatherAlerts position="bottomright" />}
                <FlyToLocation location={trackLocation} />
            </MapContainer>
        </div>
    )
}

const FlyToLocation: React.FC<{ location: { lat: number; lng: number } }> = ({ location }) => {
    const map = useMap();
    const dispatch = useDispatch();
  
    useEffect(() => {
        console.log("Flying to location", location);
     // Fly to the current position when component mounts or whenever the location changes
      if (map) {
        // map.on('moveend', () => {
        //     dispatch(toggleInSearch(false))
        // })
        map.flyTo([location.lat, location.lng], map.getZoom(), {
          animate: true,
          duration: 1.5,
        });
      }
    }, [location, map]);
  
    return null;
  };  

export default MapComponent;