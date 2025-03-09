import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "eb6d75a05b00484ed9aba7e98becc56a";
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";

const WeatherApp = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setDarkMode(savedMode === "true");
    }
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const fetchWeather = async (city) => {
    if (!city) return;
    setLoading(true);
    try {
      const weatherResponse = await axios.get(`${WEATHER_API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      setWeather(weatherResponse.data);

      const forecastResponse = await axios.get(`${FORECAST_API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      setForecast(forecastResponse.data.list.filter((_, index) => index % 8 === 0));
    } catch (error) {
      alert("City not found! Please try again.");
    }
    setLoading(false);
  };

  const fetchUserLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setLoading(true);
        try {
          const weatherResponse = await axios.get(
            `${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          setWeather(weatherResponse.data);

          const forecastResponse = await axios.get(
            `${FORECAST_API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          setForecast(forecastResponse.data.list.filter((_, index) => index % 8 === 0));
        } catch (error) {
          alert("Could not fetch weather for your location.");
        }
        setLoading(false);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    fetchUserLocationWeather();
  }, []);

  return (
    <div className="container">
      <h1>My Weather App</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter your city name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={() => fetchWeather(query)}>Search</button>
      </div>
      {loading && <p className="loading">Loading...</p>}
      {weather && (
        <div className="weather-info">
          <h2>Today's weather</h2>
          <h2>City: {weather.name}, Country: {weather.sys.country}</h2>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
      
      {forecast.length > 0 && (
  <div className="forecast">
    <h2>5-Day Forecast</h2>
    <div className="forecast-cards">
      {forecast.map((day, index) => (
        <div key={index} className="forecast-card">
          <h3>{new Date(day.dt * 1000).toLocaleDateString()}</h3>
          <p>{day.weather[0].description}</p>
          <p>Temp: {day.main.temp}°C</p>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
};

export default WeatherApp;

