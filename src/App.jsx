import "./App.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const App = () => {
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const kelvinToCelsius = (kelvin) => {
    return Math.round(kelvin - 273.15);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=es&appid=0ccea184ca4646ab9340fa406f3b37d3`
      );
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
      } else {
        setError(
          data.message || t("Hubo un error al obtener los datos del clima.")
        );
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(t("Hubo un error al obtener los datos del clima."));
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (city) {
      fetchData();
    }
  };

  const getWeatherIcon = () => {
    if (weatherData) {
      const iconCode = weatherData.weather[0].icon;
      return `http://openweathermap.org/img/w/${iconCode}.png`;
    }
    return null;
  };

  return (
    <div className="weather-app">
      <h1>{t("Aplicación de Clima")}</h1>
      <label>
        {t("Ingrese la ciudad")}:
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </label>
      <button onClick={handleButtonClick} disabled={!city || loading}>
        {t("Obtener clima")}
      </button>

      <div className="weather-info">
        {loading ? (
          <p>{t("Cargando datos...")}</p>
        ) : (
          <>
            {weatherData ? (
              <div>
                <div className="weather-box">
                  <img
                    className="weather-icon"
                    src={getWeatherIcon()}
                    alt="Weather Icon"
                  />
                  <h2>{t(weatherData.name)}</h2>
                  <p>{t(weatherData.weather[0].description)}</p>
                  <p>
                    {t("Temperature")}:{" "}
                    {kelvinToCelsius(weatherData.main.temp).toFixed(2)}°C
                  </p>
                  <p>
                    {t("Latitude")}: {weatherData.coord.lat}
                  </p>
                  <p>
                    {t("Longitude")}: {weatherData.coord.lon}
                  </p>
                  <p>
                    {t("Station")}: {weatherData.weather[0].main}
                  </p>
                </div>
              </div>
            ) : (
              <p className="error">{error}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
