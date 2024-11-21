const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {

    }

    getCurrentWeather(query) {

    }

    getForecast(query) {

    }

    getWeather(query) {

    }

    drawWeather() {

    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {

    }
}

document.weatherApp = new WeatherApp("7093d486057c9e3ae1d705d22654e9b9", "#weather-result");
document.querySelector("#weatherCheck").addEventListener("click", function () {
    const query = document.querySelector("#weatherLocation").value;
    document.weatherApp.getCurrentWeather(query);
});
