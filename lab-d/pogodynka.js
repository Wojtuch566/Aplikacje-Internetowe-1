const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.resultsBlock = document.querySelector(resultsBlockSelector);

        this.currentWeatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&APPID=${apiKey}&units=metric&lang=pl`;
        this.forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q={query}&APPID=${apiKey}&units=metric&lang=pl`;

        this.currentWeather = undefined;
        this.forecast = undefined;
    }

    getCurrentWeather(query) {
        let url = this.currentWeatherLink.replace("{query}", query);
        console.log(url);

        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", () => {
            console.log(JSON.parse(req.responseText));
            this.currentWeather = JSON.parse(req.responseText);
            this.drawWeather();
        });
        req.send();
    }

    getForecast(query) {
        let url = this.forecastLink.replace("{query}", query);
        fetch(url)
            .then((response) => {
                return response.json();
        })
            .then((data) => {
                console.log(data);
                const hourlyForecast = this.interpolateForecast(data.list);
                this.forecast = hourlyForecast;
                this.drawWeather();
            })
        ;
    }

    //funkcja interpolacji, która zmienia podziałkę prognozy na co jednogodzinną
    interpolateForecast(forecastData) {
        const interpolatedData = [];

        for (let i = 0; i < forecastData.length - 1; i++) {
            const current = forecastData[i];
            const next = forecastData[i + 1];

            //odsęp czasu między punktami w sekundach
            const currentTime = current.dt;
            const nextTime = next.dt;
            const timeDiff = (nextTime - currentTime) / 3600; //w godzinach

            //dodawanie bieżącego punktu
            interpolatedData.push(current);

            //interpolowanie brakujących godzin
            for (let t = 1; t < timeDiff; t++) {
                const factor = t / timeDiff;
                interpolatedData.push({
                    dt: currentTime + t * 3600,
                    main: {
                        temp: current.main.temp + factor * (next.main.temp - current.main.temp),
                        feels_like: current.main.feels_like + factor * (next.main.feels_like - current.main.feels_like)
                    },
                    weather: current.weather
                });
            }
        }

        //dodawanie ostatniego punktu
        interpolatedData.push(forecastData[forecastData.length - 1]);

        return interpolatedData;
    }

    getWeather(query) {
        const weatherBlock = this.createWeatherBlock('2024-12-12', '20:00', 0, -2, '13n', 'opady śniegu');
        this.resultsBlock.appendChild(weatherBlock);
    }

    drawWeather() {
        this.resultsBlock.innerHTML = '';

        if (this.currentWeather) {
            const date = new Date(this.currentWeather.dt * 1000);
            const weatherBlock = this.createWeatherBlock(
                `${date.toLocaleDateString("pl-PL")}`,
                `${date.toLocaleTimeString("pl-PL", {hour: '2-digit', minute: '2-digit'})}`,
                this.currentWeather.main.temp,
                this.currentWeather.main.feels_like,
                this.currentWeather.weather[0].icon,
                this.currentWeather.weather[0].description
            );
            this.resultsBlock.appendChild(weatherBlock);
        }

        if (this.forecast) {
            const forecastMainBlock = document.createElement("div");
            forecastMainBlock.className = "weather-dayTime";
            for (let i = 0; i < 24; i++) {
                let weather = this.forecast[i];
                const date = new Date(weather.dt * 1000);
                const forecastBlock = this.createForecastBlock(
                    `${date.toLocaleTimeString("pl-PL", {hour: '2-digit', minute: '2-digit'})}`,
                    weather.main.temp.toFixed(2),
                    weather.main.feels_like.toFixed(2),
                    weather.weather[0].icon
                );
                forecastMainBlock.appendChild(forecastBlock);
            }
            this.resultsBlock.appendChild(forecastMainBlock);
        }
    }

    createWeatherBlock(dateString, hourString, temperature, feelsLikeTemperature, iconName, description) {
        const weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-currentTime";

        //kolumna z datą i godziną
        let weatherColumn = document.createElement("div");
        weatherColumn.className = "weather-column";

        const weatherDate = document.createElement("div");
        weatherDate.className = "weather-date";
        weatherDate.innerHTML = dateString;
        weatherColumn.appendChild(weatherDate);

        const weatherDateHour = document.createElement("div");
        weatherDateHour.className = "weather-date-hour";
        weatherDateHour.innerHTML = hourString;
        weatherColumn.appendChild(weatherDateHour);

        weatherBlock.appendChild(weatherColumn);

        //kolumna z ikoną pogody
        weatherColumn = document.createElement("div");
        weatherColumn.className = "weather-column";

        const weatherIcon = document.createElement("img");
        weatherIcon.className = "weather-icon";
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`;
        weatherColumn.appendChild(weatherIcon);

        weatherBlock.appendChild(weatherColumn);

        //kolumna z informacjami o pogodzie
        weatherColumn = document.createElement("div");
        weatherColumn.className = "weather-column";

        const weatherDescription = document.createElement("div");
        weatherDescription.className = "weather-description";
        weatherDescription.innerHTML = description;
        weatherColumn.appendChild(weatherDescription);

        const weatherTemperature = document.createElement("div");
        weatherTemperature.className = "weather-temperature";
        weatherTemperature.innerHTML = `${temperature} &deg;C`;
        weatherColumn.appendChild(weatherTemperature);

        const weatherFeelsLikeTemperature = document.createElement("div");
        weatherFeelsLikeTemperature.className = "weather-temperature-feels-like";
        weatherFeelsLikeTemperature.innerHTML = `Odczuwalna: ${feelsLikeTemperature} &deg;C`;
        weatherColumn.appendChild(weatherFeelsLikeTemperature);

        weatherBlock.appendChild(weatherColumn);

        return weatherBlock;
    }

    createForecastBlock(hourString, temperature, feelsLikeTemperature, iconName) {
        const forecastBlock = document.createElement("div");
        forecastBlock.className = "weather-hourTime";

        //godzina
        const weatherDateHour = document.createElement("div");
        weatherDateHour.className = "weather-date-hour";
        weatherDateHour.innerHTML = hourString;
        forecastBlock.appendChild(weatherDateHour);

        //ikona
        const weatherIcon = document.createElement("img");
        weatherIcon.className = "weather-icon";
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`;
        forecastBlock.appendChild(weatherIcon);

        //temperatury
        const weatherTemperature = document.createElement("div");
        weatherTemperature.className = "weather-temperature";
        weatherTemperature.innerHTML = `${temperature} &deg;C`;
        forecastBlock.appendChild(weatherTemperature);

        const weatherFeelsLikeTemperature = document.createElement("div");
        weatherFeelsLikeTemperature.className = "weather-temperature-feels-like";
        weatherFeelsLikeTemperature.innerHTML = `Odczuwalna: ${feelsLikeTemperature} &deg;C`;
        forecastBlock.appendChild(weatherFeelsLikeTemperature);

        return forecastBlock;
    }
}

document.weatherApp = new WeatherApp("7093d486057c9e3ae1d705d22654e9b9", "#weather-result");
document.querySelector("#weatherCheck").addEventListener("click", function () {
    const query = document.querySelector("#weatherLocation").value;
    document.weatherApp.getCurrentWeather(query);
    document.weatherApp.getForecast(query);
});
