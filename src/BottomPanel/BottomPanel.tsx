import { FC } from "react";
import "./BottomPanel.css"
import { useSelector } from "react-redux";
import { RootState } from "../store";

const BottomPanel: FC = () => {
    const currentWeather = useSelector((state: RootState) => state.mapState.weatherData);
    return (
        <div className="bottom-panel">
            {currentWeather && (
                <div>
                    <h2>{currentWeather.current.weather[0].main}</h2>
                    {/* <p>{currentWeather.weather[0].description}</p> */}
                    <p>Temperature: {currentWeather.current.temp}°F</p>
                    <p>Humidity: {currentWeather.current.humidity}%</p>
                </div>
            )}
            {!currentWeather && <p>Loading...</p>}
        </div>
    );
}

export default BottomPanel;