import { FC, useState } from "react";
import "./BottomPanel.css"
import { useSelector } from "react-redux";
import { RootState } from "../store";
import icon01d from './01d@2x.png';
import icon01n from './01n@2x.png';
import icon02d from './02d@2x.png';
import icon03d from './03d@2x.png';
import icon04n from './04d@2x.png';
import icon09d from './09d@2x.png';
import icon10d from './10d@2x.png';
import icon11d from './11d@2x.png';
import icon13d from './13d@2x.png';
import icon50d from './50d@2x.png';
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
        // xAxisLabels = Array.from({ length: newLocal }, (_, i) => lowEnd + i * step);
    }
    const toggleDisplay = () => setShowTemps(!showTemps);
    console.log("showTemps", showTemps);
    return (
        <div className="bottom-panel">
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