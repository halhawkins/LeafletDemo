import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from "react-leaflet"
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
function MapComponent(){
    const poly = GeoPoly.map(p => {return {lat: p[0], lng: p[1]}})
    const layers = useSelector((state: RootState) => state.selector.layers);
    const [location, setLocation] = useState<{ lat: number, lng: number }>({lat: 42.456882503116724, lng: -74.06433105468751});
    const [radarVisible, setRadarVisible] = useState(true);
    const [cloudsVisible, setCloudsVisible] = useState(true);
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
                    // setLocation({lat: 42.456882503116724, lng: -74.06433105468751});
                }
            );
        } else {
            setLocation({lat: 42.456882503116724, lng: -74.06433105468})
        }
    }

    useEffect(() => {
        getLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={{width: "100%", height: '100%', position: "absolute"}}>
            <MapContainer center={GeoPoint} zoom={13} scrollWheelZoom={true} style={{ width:"100%", height: "100%"}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                <Selector position="topright" >
                    <LayerSelector />
                </Selector>
            </MapContainer>
        </div>
    )
}


export default MapComponent;