import { FC, useEffect, useState } from "react";
import { useMapEvents } from "react-leaflet";
import { LatLngExpression } from "leaflet";

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
    const [location, setLocation] = useState<{ lat: number, lng: number }>({lat: 42.456882503116724, lng: -74.0643310546875});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [forcastData, setForecastData] = useState({});

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://api.weather.gov/points/${location.lat},${location.lng}`, {
                    method: 'GET',
                });
                const data = await response.json();
                console.log("data=",data);
                setForecastData(data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        })();
    }, [location]);

    // useEffect(() => {}, [forcastData])

    const map = useMapEvents({        
        click: (e) => {
            const loc = e.latlng;
            setLocation(loc);
            map.flyTo([loc.lat, loc.lng] as LatLngExpression, 13);
          },
    })

    return (
        <></>
    )
}

export default MapInteraction;
