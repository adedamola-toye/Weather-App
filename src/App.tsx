
import "./App.css";
import { useState } from "react";

const api = {
  key: "4910364845a7e756ad758004a6888094",
  base: "https://api.openweathermap.org/data/2.5/"
}

interface WeatherResponse {
  name: string;
  sys: {
    country: string;
  };
  weather: Array<{ description: string }>;
  main: {
    temp: number;
    humidity: number;
  };
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  const dateBuilder = (dateObject: Date) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    const day = days[dateObject.getDay()];
    const date = dateObject.getDate();
    const month = months[dateObject.getMonth()];
    const currYear = dateObject.getFullYear();
  
    return `${date} ${day} ${month} ${currYear}`;
  }

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`${api.base}weather?q=${query}&appid=${api.key}&units=metric`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setWeather(result);
      setQuery('');
      console.log(result);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      fetchWeatherData();
    }
  }

  return (
    <>
      <div className="weather-app">
        <h1>Weather App</h1>

        <div className="search-section">
          <input
            type="text"
            className="search-bar"
            placeholder="Enter location"
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            onKeyDown={handleKeyDown}
          />
          <button onClick={fetchWeatherData}>Search</button>
        </div>
        
        <div className="location-box">
          {weather && (
            <>
              <div className="location">
                <h2>{weather.name}, {weather.sys.country}</h2>
              </div>
              <p className="date">{dateBuilder(new Date())}</p>
              <div className="weather-info">
                <p>{weather.weather[0].description}</p>
                <p>Temperature: {weather.main.temp}°C</p>
                <p>Humidity: {weather.main.humidity}%</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
