const currentDate = new Date();
const options = { weekday: "long", hour: "2-digit", minute: "2-digit" };
const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
  currentDate
);

document.getElementById("searchForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const cityInput = document.getElementById("cityInput");
  const city = cityInput.value;
  document.getElementById("cityName").textContent = city;
  getWeather(city); // Вызываем функцию для получения погоды
  console.log(city); // Проверяем значение city в консоли
  getForecast(city); // Вызываем функцию для получения прогноза погоды
});

function updateCurrentDate() {
  const currentDate = new Date();
  const options = { weekday: "long", hour: "2-digit", minute: "2-digit" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(currentDate);
  document.getElementById("currentDateTime").textContent = formattedDate;
}


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
      updateCurrentDate(); // Добавляем вызов функции обновления текущей даты и времени
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}
document.addEventListener("DOMContentLoaded", function() {
  updateCurrentDate(); // Вызываем функцию для обновления текущей даты и времени при загрузке страницы
});




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

  getForecast(response.data.city)


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

function getForecast(city){
  let apiKey = "59a99bf814c1d687d082fbb625caab0c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
 console.log(apiUrl); 
 axios(apiUrl).then(displayForecast); // Исправленная опечатка
}



function getNextDayOfWeek(currentDayOfWeekIndex) {
  return (currentDayOfWeekIndex + 1) % 7;
}

function displayForecast(response) {
  console.log(response.data);

  const forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date();
  const currentDayOfWeekIndex = today.getDay(); // Получаем индекс текущего дня недели

  const forecastList = response.data.list; // Получаем список прогнозов

  // Начинаем с 1, чтобы пропустить сегодняшний день, и берем прогнозы только на следующие 5 дней
  for (let i = 1; i < 6; i++) {
    const forecastDate = new Date(forecastList[i].dt * 1000); // Преобразуем время из Unix в миллисекунды
    const dayOfWeekIndex = getNextDayOfWeek(currentDayOfWeekIndex + i); // Индекс дня недели для прогноза
    const maxTemp = Math.round(forecastList[i].main.temp_max);
    const minTemp = Math.round(forecastList[i].main.temp_min);
    const weatherCode = forecastList[i].weather[0].icon; // Получаем код погоды
     
    const weatherIcon = getWeatherIcon(weatherCode, true);


    forecastHTML += `
      <div class="weather-day">
        <div class="weather-forecast-date">${daysOfWeek[dayOfWeekIndex]}</div>
         <img src="${weatherIcon}" id="weather-day-icon" alt="icons">
        <div class="weather-forecast-temperature">
          <div class="weather-forecast-temperature-max">
            <strong>${maxTemp}°C</strong>
          </div>
          <div class="weather-forecast-temperature-min">${minTemp}°C</div>
        </div>
      </div>`;
  }

  forecastElement.innerHTML = forecastHTML;
}

// Функция getNextDayOfWeek не требует изменений
function getNextDayOfWeek(currentDayOfWeekIndex) {
  return currentDayOfWeekIndex % 7;
}

getForecast("Zurich");
