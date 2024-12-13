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
function MapComponent(){
    const poly = GeoPoly.map(p => {return {lat: p[0], lng: p[1]}})
    const layers = useSelector((state: RootState) => state.selector.layers);
    const [radarVisible, setRadarVisible] = useState(true);
    useEffect(() => {
        console.log("layers changed", layers);
        if (layers.includes("radar")) {
            setRadarVisible(true);
        } else {
            setRadarVisible(false);
        }
    }, [layers])

    return (
        <div style={{width: "100%", height: "100%", position: "absolute"}}>
            <MapContainer center={GeoPoint} zoom={13} scrollWheelZoom={true} style={{position: 'static', width:"100%",height:"100%"}}>
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
                <Selector position="topright" >
                    <LayerSelector />
                </Selector>
            </MapContainer>
        </div>
    )
}


export default MapComponent;