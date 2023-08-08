import React from "react";
import { useState, useEffect } from "react";
import logo from "./assets/logo.gif";
import backday from "./assets/backday.png";
import backnight from "./assets/backnight.png";

export const WeatherApp = () => {
  const urlBase = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = import.meta.env.VITE_API_KEY;
  /* ----------------------------------------------------------------- */
  const [ciudad, setCiudad] = useState("");
  const [dataClima, setDataClima] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  /* ----------------------------------------------------------------- */
  const setBackgroundImageByTime = () => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 6 && currentHour < 12) {
      setBackgroundImage("url(./assets/backday.png)");
    } else if (currentHour >= 12 && currentHour < 19) {
      setBackgroundImage(`url(${backday})`);
    } else {
      setBackgroundImage(`url(${backnight})`);
    }
  };
  /* ----------------------------------------------------------------- */
  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByGeolocation(latitude, longitude);
        },
        (error) => {
          alert("Error obteniendo la geolocalización");
        }
      );
    } else {
      console.error("La geolocalización no está soportada");
    }
  };
  /* ----------------------------------------------------------------- */
  const fetchWeatherByGeolocation = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `${urlBase}?lat=${latitude}&lon=${longitude}&lang=es&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();

      setDataClima(data);
    } catch (error) {}
  };
  /* ----------------------------------------------------------------- */
  useEffect(() => {
    setBackgroundImageByTime();
    getGeolocation();

    document.body.style.backgroundImage = backgroundImage;

    return () => {
      document.body.style.backgroundImage = "none";
    };
  }, [backgroundImage]);
  /* ----------------------------------------------------------------- */
  const handleCambioCiudad = (event) => {
    setCiudad(event.target.value);
  };
  /* ----------------------------------------------------------------- */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (ciudad.length > 0) fetchClima();
  };
  /* ----------------------------------------------------------------- */
  const fetchClima = async () => {
    try {
      const response = await fetch(
        `${urlBase}?q=${ciudad}&lang=es&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();

      setDataClima(data);
    } catch (error) {
      if (error.message.includes("404")) {
        alert("La ciudad no está disponible (Error 404)");
      } else {
        alert(`Ocurrió el siguiente problema: ${error.message}`);
      }
    }
  };
  /* ----------------------------------------------------------------- */
  return (
    <div className="container">
      <h1>Clima en mi ciudad</h1>
      <img id="logo" src={logo}></img>
      <form onSubmit={handleSubmit}>
        <button id="geoloc" onClick={getGeolocation}>auto</button>
        <input
          type="text"
          placeholder="Ingrese una ciudad"
          value={ciudad}
          onChange={handleCambioCiudad}
        />
        <button type="submit">buscar</button>
      </form>
      {dataClima && (
        <div className="datos">
          <div className="ciudad">
            <h5>ciudad</h5>
            <h2>{dataClima.name}</h2>
          </div>
          <div className="cond">
            <h5>{dataClima.weather[0].description}</h5>
            <img
              src={`https://openweathermap.org/img/wn/${dataClima.weather[0].icon}@2x.png`}
              alt="Weather Icon"
            />
          </div>
          <div className="temp">
            <h5>temperatura</h5>
            <h2>🌡 {parseInt(dataClima.main.temp)}ºC</h2>
          </div>
          <div className="humedad">
            <h5>humedad</h5>
            <h2>💧 {dataClima.main.humidity}%</h2>
          </div>
          <div className="presion">
            <h5>presión</h5>
            <h2>🎈 {dataClima.main.pressure - 10}hPa</h2>
          </div>
          <div className="viento">
            <h5>viento</h5>
            <h2>🌬{parseInt(dataClima.wind.speed * 3.6)}Km/h</h2>
          </div>
        </div>
      )}
      <div className="footer">
        <footer>
          <p>Maxi Valli. Derechos reservados ©</p>
        </footer>
      </div>
    </div>
  );
};
