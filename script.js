let cityName = document.querySelector("#cityName");
let currentDate = document.querySelector("#currentDate");
let tempF = document.querySelector("#tempF");
let humidity = document.querySelector("#humidity");
let windSpeed = document.querySelector("#windSpeed");
let cityForm = document.querySelector("#cityForm");
let chosenCity = document.querySelector("#chosenCity");

function getApi(requestUrl) {
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        cityName.textContent = data.name;
        currentDate.textContent = `(${moment().format('MM/D/YYYY')})`
        tempF.textContent = data.main.temp;
        humidity.textContent = data.main.humidity;
        windSpeed.textContent = data.wind.speed;
      });
  }

cityForm.addEventListener("submit", function(e) {
    e.preventDefault();
    getApi(`https://api.openweathermap.org/data/2.5/weather?q=${chosenCity.value}&appid=bb4f4eb722b35b0afd1d0fc61d673140&units=imperial`);
})

//   TODO: response.status to provide errors if the site was down or 404'd, etc.
