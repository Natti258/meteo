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
      let temperature = response.data.main.temp;
      updateTemperature(temperature);
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
    let weather = response.date.weather[0];
    let temperature = response.date.mein.temp;
    let humidity = response.data.mein.humidity;
    let windSpeed = response.data.wind.speed;

     // Обновляем текстовые данные о погоде
    document.querySelector(".info-weather").innerHTML = `
    ${weather.description} <br />
    Humidity: <strong>${humidity}%</strong>, Wind: <strong>${windSpeed} km/h</strong>
  `;
    // Обновляем иконку погоды в зависимости от текущей погоды
  const weatherIcon = getWeatherIcon(weather.icon);
  document.querySelector(".gif-container img").src = weatherIcon;

}

function getWeatherIcon(weatherCode) {
    switch (weatherCode) {
      case "01d":
        return "https://s9.gifyu.com/images/SUvJZ.gif"; // Солнечно
      case "02d":
      case "03d":
      case "04d":
        return "https://s9.gifyu.com/images/SUvJF.gif"; // Облачно
      case "09d":
        return "https://s9.gifyu.com/images/SUvJU.gif"; // Дождь
      case "10d":
        return "https://s9.gifyu.com/images/heavy-rain.gif"; // Ливень
      case "11d":
        return "https://s9.gifyu.com/images/thunderstorm.gif"; // Гроза
      case "13d":
        return "https://s9.gifyu.com/images/snowy.gif"; // Снег
      case "50d":
        return "https://s9.gifyu.com/images/misty.gif"; // Туман
      default:
        return "https://s9.gifyu.com/images/unknown.gif"; // Неизвестно
    }
  }

  axios
  .get(url)
  .then((response) => {
    console.log(response.data);
    updateWeatherInfo(response);
  })
  .catch((error) => {
    console.error("Error fetching weather data:", error);
  });
