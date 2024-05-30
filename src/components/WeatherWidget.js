import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiStrongWind,
  WiBarometer,
} from "react-icons/wi";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Coordenadas de Valle Nevado
        const latitude = -33.3506;
        const longitude = -70.2515;
        // Solicitud a la API de Open-Meteo
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m&current_weather=true`
        );
        setWeather(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (weathercode) => {
    switch (weathercode) {
      case 0: // Clear sky
        return <WiDaySunny />;
      case 1: // Mainly clear
      case 2: // Partly cloudy
      case 3: // Overcast
        return <WiCloud />;
      case 61: // Rain showers
      case 63: // Rain
      case 65: // Heavy rain
        return <WiRain />;
      case 71: // Snow showers
      case 73: // Snow
      case 75: // Heavy snow
        return <WiSnow />;
      case 95: // Thunderstorm
        return <WiThunderstorm />;
      default:
        return <WiCloud />;
    }
  };

  const getWindDirection = (degree) => {
    if (degree > 337.5) return "N";
    if (degree > 292.5) return "NW";
    if (degree > 247.5) return "W";
    if (degree > 202.5) return "SW";
    if (degree > 157.5) return "S";
    if (degree > 122.5) return "SE";
    if (degree > 67.5) return "E";
    if (degree > 22.5) return "NE";
    return "N";
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Clima en Valle Nevado</h2>
      {weather.current_weather && (
        <>
          <p>Temperatura: {weather.current_weather.temperature}°C</p>
          {/* <p>Humedad: {weather.current_weather.relative_humidity}%</p> */}
          <p>
            Descripción: {getWeatherIcon(weather.current_weather.weathercode)}{" "}
            {/* {weather.current_weather.weathercode} */}
          </p>
          <p>
            <WiStrongWind /> Viento: {weather.current_weather.windspeed} m/s,
            Dirección: {getWindDirection(weather.current_weather.winddirection)}
          </p>
          <p>
            <WiBarometer /> Elevación: {weather.elevation} metros
          </p>
        </>
      )}
    </div>
  );
};

export default WeatherWidget;
