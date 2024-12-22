import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import "./DailyForecast.css";
import moment from "moment";

const DailyForecast: FC = () => {
    const day = {
        dt: 1734364800,
        sunrise: 1734351657,
        sunset: 1734384110,
        moonrise: 1734388080,
        moonset: 1734357540,
        moon_phase: 0.55,
        summary: "You can expect partly cloudy with snow in the morning, with rain in the afternoon",
        temp: {
            day: 32.94,
            min: 29.46,
            max: 34.52,
            night: 34.11,
            eve: 34.16,
            morn: 30.69
        },
        feels_like: {
            day: 30.06,
            night: 34.11,
            eve: 34.16,
            morn: 30.69
        },
        pressure: 1032,
        humidity: 98,
        dew_point: 32.16,
        wind_speed: 4.5,
        wind_deg: 148,
        wind_gust: 20.07,
        weather: [
            {
                id: 616,
                main: "Snow",
                description: "rain and snow",
                icon: "13d"
            }
        ],
        clouds: 100,
        pop: 1,
        rain: 0.4,
        snow: 6.24,
        uvi: 0.23
    }
    const dailyForecastData = useSelector((state:RootState) => state.mapState.weatherData?.daily);

    // Render daily forecast component here
    return (
        <div className="daily-forecast">
            {dailyForecastData && dailyForecastData.map((forecast,index) => (
            <div className="day-panel" key={index}>
            <h3>{moment.unix(forecast.dt).format("ddd")}</h3>
                <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt={forecast.weather[0].description} style={{width: "75px", height: "75px"}} />
                <p style={{textTransform: "capitalize", fontSize:"0.8rem"}}>{forecast.weather[0].description}</p>
                <p style={{fontSize: "1.2rem", fontWeight: '600'}}>{Math.round(forecast.temp.day)}°F</p>
                <div style={{textAlign: "left"}}>
                    {forecast.pressure && <p style={{fontSize: "0.7rem"}}>Prs. {forecast.pressure} hPa</p>}
                    {forecast.humidity && <p style={{fontSize: "0.7rem"}}>Hum. {forecast.humidity}%</p>}
                    {forecast.wind_speed && <p style={{fontSize: "0.7rem"}}>WS {Math.round(forecast.wind_speed)}mph</p>}
                    {forecast.wind_deg && <p style={{fontSize: "0.7rem"}}>WD {forecast.wind_deg}°</p>}
                    {forecast.rain && <p style={{fontSize: "0.7rem"}}>Rain {forecast.rain}mm</p>}
                </div>
            </div>
            ))}
        </div>
    );
}

export default DailyForecast;