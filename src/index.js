const currentDate = new Date();
const options = { weekday: "long", hour: "2-digit", minute: "2-digit" };
const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
  currentDate
);

document.getElementById("currentDateTime").textContent = formattedDate;

document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value;
    document.getElementById("cityName").textContent = city;
    getWeather(city); // Вызываем функцию для получения погоды
  });

function getWeather(city) {
  let apiKey = "59a99bf814c1d687d082fbb625caab0c";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios
    .get(url)
    .then((response) => {
      console.log(response.data);
      const sunrise = response.data.sys.sunrise * 1000; // Преобразуем время из секунд в миллисекунды
      const sunset = response.data.sys.sunset * 1000; // Преобразуем время из секунд в миллисекунды
      const isDaytime = isDay(sunrise, sunset);
      updateWeatherInfo(response, isDaytime);
      updateTemperature(response.data.main.temp);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function isDay(sunrise, sunset) {
  const currentDate = new Date();
  return currentDate > sunrise && currentDate < sunset;
}

function updateTemperature(newTemperature) {
  document.querySelector(".current-temperature-water").textContent =
    Math.round(newTemperature); // Округляем температуру до ближайшего целого
}

function updateWeatherInfo(response, isDaytime) {
  let weather = response.data.weather[0];
  let humidity = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;

  // Обновляем текстовые данные о погоде
  document.querySelector(".info-weather").innerHTML = `
    ${weather.description} <br />
    Humidity: <strong>${humidity}%</strong>, Wind: <strong>${windSpeed} km/h</strong>
  `;

  // Обновляем иконку погоды в зависимости от текущей погоды и времени суток
  const weatherIcon = getWeatherIcon(weather.icon, isDaytime);
  document.querySelector(".gif-container img").src = weatherIcon;
}

function getWeatherIcon(weatherCode, isDaytime) {
  switch (weatherCode) {
    case "01d":
      return isDaytime ? "https://s9.gifyu.com/images/SUvPm.gif" : "https://s9.gifyu.com/images/SUve6.gif"; // Солнечно ; яркая луна
    case "02d":
    case "03d":
    case "04d":
      return isDaytime ? "https://s9.gifyu.com/images/SUvP7.gif" : "https://s9.gifyu.com/images/SUve0.gif"; // Облачно
    case "09d":
      return "https://s9.gifyu.com/images/SUvPd.gif"; // Дождь
    case "10d":
      return "https://s9.gifyu.com/images/SUvPQ.gif"; // Ливень
    case "11d":
      return "https://s9.gifyu.com/images/SUvPg.gif"; // Гроза
    case "13d":
      return "https://s9.gifyu.com/images/SUvP5.gif"; // Снег
    case "50d":
      return isDaytime ? "https://s9.gifyu.com/images/SUvX2.gif" : "https://s9.gifyu.com/images/SUve5.gif"; // Туман
    default:
      return isDaytime ? "https://s9.gifyu.com/images/SUvPm.gif" : "https://s9.gifyu.com/images/SUve6.gif"; // Неизвестно
  }
}

function displeyForecast() {
  let forecastElement = document.querySelector("#forecast"); // Объявление переменной для доступа к элементу DOM
  let forcastHTML = "";

  let days = ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  days.forEach(function (day) {
    forcastHTML += `
      <div class="weather-day">
        <div class="weather-forcast-date">${day}</div>
        <img src="https://s9.gifyu.com/images/SUvPm.gif" id="weather-day-icon" alt="icons">
        <div class="weather-forecast-temperature">
          <div class="weather-forecast-temperature-max">
            <strong>15°C</strong>
          </div>
          <div class="weather-forecast-temperature-min">10°C</div>
        </div>
      </div>`;
  });

  forecastElement.innerHTML = forcastHTML; // Вставка сгенерированного HTML в элемент DOM
}

displeyForecast(); // Вызов функции после определения всех необходимых переменных и элементов
