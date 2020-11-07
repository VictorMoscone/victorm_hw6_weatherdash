let cityName = document.querySelector("#cityName");
let currentDate = document.querySelector("#currentDate");
let tempF = document.querySelector("#tempF");
let humidity = document.querySelector("#humidity");
let windSpeed = document.querySelector("#windSpeed");
let cityForm = document.querySelector("#cityForm");
let chosenCity = document.querySelector("#chosenCity");
let weatherInfo = document.querySelector("#weatherInfo");
let fiveForecast = document.querySelector("#fiveForecast");
let searchList = document.querySelector("#searchList");
let clickSearch = document.getElementsByClassName("clickSearch");
let searchHistory = [];

function getApi(requestUrl) {
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        cityName.textContent = data.name;
        currentDate.textContent = `(${moment().format('MM/D/YYYY')})`
        // TODO: The appropriate weather icon needs to appear next to the date.
        tempF.textContent = data.main.temp;
        humidity.textContent = data.main.humidity;
        windSpeed.textContent = data.wind.speed;
      });
  }

function primaryFetch(source) {
    weatherInfo.classList.remove("d-none");
    fiveForecast.classList.remove("d-none");
    // This will show the weather info and five day forecast after searching a city.
    // TODO: I need to implement response.status as an IF statement, so this isn't run if a 404 occurs.
    getApi(`https://api.openweathermap.org/data/2.5/weather?q=${source}&appid=bb4f4eb722b35b0afd1d0fc61d673140&units=imperial`); 
}

function buildHistory(source) {
    searchHistory.push(source);
    let currSearch = document.createElement("li");
    currSearch.setAttribute("class", "list-group-item list-group-item-action clickSearch")
    currSearch.setAttribute("a", "href=``");
    searchList.append(currSearch);
}

cityForm.addEventListener("submit", function(e) {
    e.preventDefault();
    primaryFetch(chosenCity.value);
    buildHistory(chosenCity.value);
})

for (let i = 0; i < clickSearch.length; i++) {
    console.log(clickSearch[i]);
    clickSearch[i].addEventListener("click", function(e){
        e.preventDefault();
        primaryFetch(this.textContent);
        buildHistory(this.textContent);
    })
}

// TODO: response.status to provide errors if the site was down or 404'd, etc.
// TODO: The same search result cannot appear in the search history. Instead, it is the newest.
