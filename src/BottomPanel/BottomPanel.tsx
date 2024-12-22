import { FC, useState } from "react";
import "./BottomPanel.css"
import { useSelector } from "react-redux";
import { RootState } from "../store";
import GraphComponent from "./GraphComponent";
import DailyForecast from "./DailyForecast";

const weatherTypes = [
    {
        icon: '01d',
        description: 'Clear daytime',
    },
    {
        icon: '01n',
        description: 'Clear nighttime',
    },
    {
        icon: '02d',
        description: 'Few clouds daytime',
    },
    {
        icon: '02n',
        description: 'Few clouds nighttime',
    },
    {
        icon: '03d',
        description: 'Scattered clouds daytime',
    },
    {
        icon: '03n',
        description: 'Scattered clouds nighttime',
    },
    {
        icon: '04d',
        description: 'Broken clouds daytime',
    },
    {
        icon: '04n',
        description: 'Broken clouds nighttime',
    },
    {
        icon: '09d',
        description: 'Shower rain daytime',
    },
    {
        icon: '09n',
        description: 'Shower rain nighttime',
    },
    {
        icon: '10d',
        description: 'Rain daytime',
    },
    {
        icon: '10n',
        description: 'Rain nighttime',
    },
    {
        icon: '11d',
        description: 'Thunderstorm daytime',
    },
    {
        icon: '11n',
        description: 'Thunderstorm nighttime',
    },
    {
        icon: '13d',
        description: 'Snow daytime',
    },
    {
        icon: '13n',
        description: 'Snow nighttime',
    },
    {
        icon: '50d',
        description: 'Mist daytime',
    }
]
const BottomPanel: FC = () => {
    const currentWeather = useSelector((state: RootState) => state.mapState.weatherData);
    const [showTemps, setShowTemps] = useState(true);
    const [hidePanel, setHidePanel] = useState(true);
    const hourlyTemps = currentWeather?.hourly.map(hourlyTemp => hourlyTemp.temp)
    const times = currentWeather?.hourly.map(hourlyTemp => new Date(hourlyTemp.dt * 1000).toLocaleTimeString());
    let xAxisLabels: number[] = [];
    if (hourlyTemps) {
        const highEnd = Math.max(...hourlyTemps) + 10;
        const lowEnd = Math.min(...hourlyTemps) - 10;

        const divisions = 3

        const difference = highEnd - lowEnd;
        const step = difference / divisions;

        const newLocal = divisions + 1;
    }
    const toggleDisplay = () => setShowTemps(!showTemps);
    console.log("showTemps", showTemps);
    const handleCollapse = () => setHidePanel(!hidePanel);
    return (
        <div className={!hidePanel ? "bottom-panel" : "bottom-panel hidden"}>
            <div className="tab-button" onClick={handleCollapse}>Current conditions</div>
            {hourlyTemps && times && (
                <>
                <span className="switch-display" onClick={toggleDisplay}>Go to Daily Forecast</span>
                {showTemps ? (
                    <GraphComponent 
                    yValues={hourlyTemps}
                    xValues={times}
                    yLabel='Temperature'
                    xLabel='Time'
                    chartTitle='Hourly Temperature Forecast'
                    />
                ) : 
                (
                    <DailyForecast />
                )}
                </>
            )}
            {!currentWeather && <p>Loading...</p>}
        </div>
    );
}


export default BottomPanel;