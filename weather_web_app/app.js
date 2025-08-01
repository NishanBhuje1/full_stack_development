class WeatherApp {
  constructor() {
    this.locationAddress = "";
    this.apiKey = "K8W7HK2LFWC2QHTVBPFFRY5UM";
    this.apiUrl =
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
  }

  init() {
    const locationInput = document.getElementById("location");
    locationInput.addEventListener(
      "keyup",
      this.handleLocationSearch.bind(this)
    );
  }

  handleLocationSearch(event) {
    const locationInput = document.getElementById("location");
    const locationValue = locationInput.value.trim();
    this.locationAddress = locationValue;
    if (event.key === "Enter") {
      this.fetchWeatherData(locationValue);
    }
  }
  async fetchWeatherData(location) {
    if (location === "") {
      alert("Please enter a valid address.");
      return;
    }
    if (location.length < 3) {
      alert("Location must be atleast 3 characters long.");
      return;
    }

    const url = `${this.apiUrl}${location}?key=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const weatherFilterData = this.filterWeatherData(data);
    this.displayWeatherData(weatherFilterData);
  }

  filterWeatherData(data) {
    console.log(data.currentConditions);
    const temperature = data.currentConditions.temp;
    const windSpeed = data.currentConditions.windspeed;
    const likelyhoodOfRain = data.currentConditions.preciptype || "None";
    const generalWeather = data.currentConditions.conditions;
    return {
      temperature,
      windSpeed,
      likelyhoodOfRain,
      generalWeather,
    };
  }

  displayWeatherData(weatherData) {
    const weatherContainer = document.getElementById("weather-data");
    const weatherHtml = `
    <h2 class="text-3xl text-bold">Weather Data for ${this.locationAddress}<h2>
    <p><strong>Temperature:</strong> ${weatherData.temperature}°F<p>
    <p><strong>Wind speed:</strong> ${weatherData.windSpeed}miles/hrs<p>
    <p><strong>Likelyhood Of Rain:</strong> ${weatherData.likelyhoodOfRain}<p>
    <p><strong>General Weather:</strong> ${weatherData.generalWeather}<p>

    `;
    weatherContainer.innerHTML = weatherHtml;
  }
}

const app = new WeatherApp();
app.init();
