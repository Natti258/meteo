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
      updateWeatherInfo(response);
      updateTemperature(response.data.main.temp);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function updateTemperature(newTemperature) {
  document.querySelector(".current-temperature-water").textContent =
    Math.round(newTemperature); // Округляем температуру до ближайшего целого
}

function updateWeatherInfo(response) {
  let weather = response.data.weather[0];
  let humidity = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;

  // Обновляем текстовые данные о погоде
  document.querySelector(".info-weather").innerHTML = `
    ${weather.description} <br />
    Humidity: <strong>${humidity}%</strong>, Wind: <strong>${windSpeed} km/h</strong>
  `;

  // Обновляем иконку погоды в зависимости от текущей погоды
  const weatherIcon = getWeatherIcon(weather.icon ,isDaytime) ;
  document.querySelector(".gif-container img").src = weatherIcon;
}

function getWeatherIcon(weatherCode, isDaytime) {
  switch (weatherCode) {
    case "01d":
      return isDaytime ? "https://s9.gifyu.com/images/SUvPm.gif" : "https://s9.gifyu.com/images/SUve6.gif"; // Солнечно ; яркая луна
    case "02d":
    case "03d":
    case "04d":
      return isDaytime ? "https://s9.gifyu.com/images/SUvP7.gif" : "https://s9.gifyu.com/images/SUve0.gif" ; // Облачно
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
      return isDaytime ? "https://s9.gifyu.com/images/SUvPm.gif" : "https://s9.gifyu.com/images/SUve6.gif" ; // Неизвестно
  }
}
