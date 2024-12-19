import { FC, SetStateAction, useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useDispatch } from "react-redux";
import { setBounds, setLocation } from "./MapStateSlice";
import LocalWeather from "../LocalWeather/LocalWeather";

interface GeoJsonContext {
    "@context": (string | {
        "@version": string;
        "wx": string;
        "s": string;
        "geo": string;
        "unit": string;
        "@vocab": string;
        "geometry": {
            "@id": string;
            "@type": string;
        };
        "city": string;
        "state": string;
        "distance": {
            "@id": string;
            "@type": string;
        };
        "bearing": {
            "@type": string;
        };
        "value": {
            "@id": string;
        };
        "unitCode": {
            "@id": string;
            "@type": string;
        };
        "forecastOffice": {
            "@type": string;
        };
        "forecastGridData": {
            "@type": string;
        };
        "publicZone": {
            "@type": string;
        };
        "county": {
            "@type": string;
        };
    })[];
    id: string;
    type: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    properties: {
        "@id": string;
        "@type": string;
        cwa: string;
        forecastOffice: string;
        gridId: string;
        gridX: number;
        gridY: number;
        forecast: string;
        forecastHourly: string;
        forecastGridData: string;
        observationStations: string;
        relativeLocation: {
            type: string;
            geometry: {
                type: string;
                coordinates: number[];
            };
            properties: {
                city: string;
                state: string;
                distance: {
                    unitCode: string;
                    value: number;
                };
                bearing: {
                    unitCode: string;
                    value: number;
                };
            };
        };
        forecastZone: string;
        county: string;
        fireWeatherZone: string;
        timeZone: string;
        radarStation: string;
    };
}

const MapInteraction: FC = () => {
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number }>({lat: 42.456882503116724, lng: -74.0643310546875});
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [forcastData, setForecastData] = useState({});
    const mapObj = useMap()
    const dispatch = useDispatch()

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const successCallback = (position: GeolocationPosition) => {
                    setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                    mapObj.flyTo([position.coords.latitude, position.coords.longitude] as LatLngExpression, 11);
                    const bbox = mapObj.getBounds();
                    dispatch(setBounds({east: bbox.getEast(), west: bbox.getWest(), south: bbox.getSouth(), north: bbox.getNorth()}));
                    dispatch(
                        setLocation(
                            {
                                lat:position.coords.latitude, 
                                lng: position.coords.longitude
                            }));
                    console.log("Position received: ", position);
                }
                const options = {
                    enableHighAccuracy: true, // Request high-accuracy location (if available)
                    timeout: 5000, // Set a timeout of 5 seconds
                    maximumAge: 0, // Don't use cached location data
                  };

                const errorCallback = (error: { message: SetStateAction<string | null>; }) => {
                    setError(error.message);
                };

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
                } else {
                    setError('Geolocation is not supported by this browser.');
                }

                const response = await fetch(`https://api.weather.gov/points/${userLocation.lat},${userLocation.lng}`, {
                    method: 'GET',
                });
                const data = await response.json();
                console.log("data=",data.properties.fireWeatherZone);
                // mapObj.flyTo([location.lat, location.lng] as LatLngExpression, 13);
                // setLocation({lat: location.lat, lng: location.lng  });
                setForecastData(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        })();
    }, []);

    // useEffect(() => {}, [forcastData])

    const map = useMapEvents({        
        click: (e) => {
            const loc = e.latlng;
            setLocation(loc);
            map.flyTo([loc.lat, loc.lng] as LatLngExpression, 13);
          },
    })

    return (
        <><LocalWeather/></>
    )
}

export default MapInteraction;
