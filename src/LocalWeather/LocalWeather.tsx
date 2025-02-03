// import { FC, useState, useEffect } from "react";
// import { Root } from "react-dom/client";
// import { useSelector } from "react-redux";
// import { RootState } from "../store";
// import { useDispatch } from "react-redux";
// import { setWeatherData } from "../MapCompoment/MapStateSlice";

// const LocalWeather: FC = () => {
//     const dispatch = useDispatch()
//     const latSelector = useSelector((state: RootState) => state.mapState.lat);
//     const lngSelector = useSelector((state: RootState) => state.mapState.lng);
//     const location = {lat: useSelector((state: RootState) => state.mapState.lat), lng: useSelector((state: RootState) => state.mapState.lng)};
//     const [tlLoading, setTlLoading] = useState(true);
//     useEffect(() => {
//         (async () => {
//             const loc = location;
//             const lat = loc.lat;
//             const lng = loc.lng;
//             console.log("LOCATION = ", lat, lng);
//             if (tlLoading && lat !== 0 && lng !== 0) {
//                 const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&units=imperial&appid=dfba23226395d24a4c6293b1c3e8821b`);

//                 const data = await response.json();

//                 console.log("openweathermap data = ", data);
//                 dispatch(setWeatherData(data))
//                 setTlLoading(false);
//             }
//         })()
//     }, [location, latSelector, lngSelector])

    
//     return (
//         <></>
//     );
// }

// export default LocalWeather;

import { FC, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setWeatherData } from "../MapCompoment/MapStateSlice";

const LocalWeather: FC = () => {
    const dispatch = useDispatch();
    const lat = useSelector((state: RootState) => state.mapState.lat);
    const lng = useSelector((state: RootState) => state.mapState.lng);
    const [tlLoading, setTlLoading] = useState(true);

    useEffect(() => {
        let alertTimeout: NodeJS.Timeout | null = null;

        const fetchWeatherData = async () => {
            if (lat !== 0 && lng !== 0) {
                try {
                    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&units=imperial&appid=dfba23226395d24a4c6293b1c3e8821b`);
                    const data = await response.json();

                    console.log("OpenWeatherMap data = ", data);
                    dispatch(setWeatherData(data));
                    // localStorage.setItem("location")

                    // Find the earliest alert expiration time
                    if (data.alerts && data.alerts.length > 0) {
                        const now = Math.floor(Date.now() / 1000); // Current time in seconds
                        const nextExpiration = Math.min(...data.alerts.map((alert: any) => alert.end));

                        const timeUntilExpiration = nextExpiration - now;

                        if (timeUntilExpiration > 0) {
                            console.log(`Next alert expires in ${timeUntilExpiration} seconds.`);
                            alertTimeout = setTimeout(fetchWeatherData, timeUntilExpiration * 1000);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch weather data:", error);
                } finally {
                    setTlLoading(false);
                }
            }
        };

        fetchWeatherData();

        return () => {
            if (alertTimeout) clearTimeout(alertTimeout);
        };
    }, [lat, lng, dispatch]);

    return null;
};

export default LocalWeather;
