let windSpeed = document.querySelector("#windSpeed");
let requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=Fresno&appid=bb4f4eb722b35b0afd1d0fc61d673140';

function getApi(requestUrl) {
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        windSpeed.textContent = data.wind.speed
      });
  }
  
  getApi(requestUrl);
