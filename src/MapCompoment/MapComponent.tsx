import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from "react-leaflet"
import { GeoPoint, GeoPoly } from "../GeoData"
import MapInteraction from "./MapInteraction"
import Radar from "./Radar/Radar"
function MapComponent(){

    const poly = GeoPoly.map(p => {return {lat: p[0], lng: p[1]}})

    return (
        <div style={{width: "100%", height: "100%", position: "absolute"}}>
            <MapContainer center={GeoPoint} zoom={13} scrollWheelZoom={true} style={{position: 'static', width:"100%",height:"100%"}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapInteraction />
                <Radar />
            {/* <Polygon positions={poly} color="red" fillColor="red" fillOpacity={0.8} /> */}
            {/* <Marker position={GeoPoint}>
                    <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker> */}
            </MapContainer>
        </div>
    )
}

export default MapComponent;