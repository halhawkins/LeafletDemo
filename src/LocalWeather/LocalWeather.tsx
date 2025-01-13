import { FC, useState, useEffect } from "react";
import { Root } from "react-dom/client";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useDispatch } from "react-redux";
import { setWeatherData } from "../MapCompoment/MapStateSlice";

const LocalWeather: FC = () => {
    const dispatch = useDispatch()
    const latSelector = useSelector((state: RootState) => state.mapState.lat);
    const lngSelector = useSelector((state: RootState) => state.mapState.lng);
    const location = {lat: useSelector((state: RootState) => state.mapState.lat), lng: useSelector((state: RootState) => state.mapState.lng)};
    const [tlLoading, setTlLoading] = useState(true);
    useEffect(() => {
        (async () => {
            const loc = location;
            const lat = loc.lat;
            const lng = loc.lng;
            console.log("LOCATION = ", lat, lng);
            if (tlLoading && lat !== 0 && lng !== 0) {
                const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&units=imperial&appid=dfba23226395d24a4c6293b1c3e8821b`);

                const data = await response.json();

                console.log("openweathermap data = ", data);
                dispatch(setWeatherData(data))
                setTlLoading(false);
            }
        })()
    }, [location, latSelector, lngSelector])

    
    return (
        <></>
    );
}

export default LocalWeather;