let cityName = document.querySelector("#cityName");
let currentDate = document.querySelector("#currentDate");
let mainWeather = document.querySelector("#mainWeather");
let tempF = document.querySelector("#tempF");
let humidity = document.querySelector("#humidity");
let windSpeed = document.querySelector("#windSpeed");
let cityForm = document.querySelector("#cityForm");
let chosenCity = document.querySelector("#chosenCity");
let weatherInfo = document.querySelector("#weatherInfo");
let fiveForecast = document.querySelector("#fiveForecast");
let fiveDate1 = document.querySelector("#fiveDate1");
let fiveTemp1 = document.querySelector("#fiveTemp1");
let fiveHumid1 = document.querySelector("#fiveHumid1");
let fiveIcon1 = document.querySelector("#fiveIcon1");
let searchList = document.querySelector("#searchList");
let clickSearch = document.getElementsByClassName("clickSearch");
let searchHistory = [];
let recentSearch = localStorage.getItem("recentSearch");

function getApi(requestUrl) {
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        cityName.textContent = data.name;
        currentDate.textContent = `(${moment().format('MM/D/YYYY')})`
        mainWeather.setAttribute("src", `http://openweathermap.org/img/w/${data.weather[0].icon}.png`)
        tempF.textContent = data.main.temp;
        humidity.textContent = data.main.humidity;
        windSpeed.textContent = data.wind.speed;
      });
  }

function forecastApi(foreCastUrl) {
    fetch(foreCastUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        fiveIcon1.setAttribute("src", `http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`)
        fiveTemp1.textContent = data.list[0].main.temp;
        fiveHumid1.textContent = data.list[0].main.humidity;
      });  
}

function fiveDayPop(source) {
    forecastApi(`https://api.openweathermap.org/data/2.5/forecast?q=${source}&appid=bb4f4eb722b35b0afd1d0fc61d673140&units=imperial`)
    let oneDay = new moment().add(1, 'day');
    fiveDate1.textContent = oneDay.format(`MM/D/YYYY`);
}

function primaryFetch(source) {
    weatherInfo.classList.remove("d-none");
    fiveForecast.classList.remove("d-none");
    fiveDayPop(source);
    // This will show the weather info and five day forecast after searching a city.
    // TODO: I need to implement response.status as an IF statement, so this isn't run if a 404 occurs.
    getApi(`https://api.openweathermap.org/data/2.5/weather?q=${source}&appid=bb4f4eb722b35b0afd1d0fc61d673140&units=imperial`); 
}

function buildHistory(source, refresh) {
    searchHistory.push(source);
    // Adds the most recent search to the end of the searchHistory array.
    let currSearch = document.createElement("li");
    // Creates a new list item in our search history bar.
    // TODO: Needs to see if there's 8 already. If so, it deletes the oldest too.
    // TODO: Needs to use local storage.
    currSearch.setAttribute("class", "list-group-item list-group-item-action clickSearch");
    // Adds all of our list item classes to the new element.
    currSearch.setAttribute("a", "href=``");
    // Adds the href a attribute to our new element.
    currSearch.setAttribute("id", `result${source}`)
    currSearch.textContent = source;
    // Will allow the new list item to display the city name it just used.
    eventClicks(currSearch);
    // The new list item will have the same event listener that the rest do.
    searchList.prepend(currSearch);
    // Prepends it to our list.
    if (refresh !== 1) {
        localStorage.setItem("recentSearch", JSON.stringify(searchHistory));
        // Saves the search history array to local storage anytime new input is received. 
    }

}

function eventClicks(source) {
    source.addEventListener("click", function(e){
        e.preventDefault();
        primaryFetch(this.textContent);
        // Fetches the saved history entry respective API data for display.
        duplicateCheck(this.textContent);
        // checks for duplication or if there's 8 results already.
        buildHistory(this.textContent);
        // Adds the click search to the history list.
        // TODO: The same search result cannot appear in the search history. Instead, it is the newest.
    })
}

function duplicateCheck(source) {
    if (searchHistory.includes(source)) {
        // if the searchHistory array includes the current value being used...
        let currValue = searchHistory.indexOf(`${source}`);
        // find the index of the used value...
        searchHistory.splice(currValue, 1);
        // and remove it...
        let removedEl = document.getElementById(`result${source}`)
        // Also finds the respective element...
        removedEl.parentNode.removeChild(removedEl);
        // and removes it too...
    } else if (searchHistory.length == 8) {
        let removedEl = document.getElementById(`result${searchHistory[0]}`);
        // If the search history is at 8, finds the oldest search result...
        removedEl.parentNode.removeChild(removedEl);
        // and removes it.
        searchHistory.shift()
        // Removes it from the array too.
    }
}

function popList() {
    if (recentSearch !== null) {
        // if the recentSearch localStorage value is present...
        let returnArray = JSON.parse(recentSearch)
        // convert the local storage into a usable array...
        searchHistory.push(returnArray);
        // then, push it to our global array.
        for (let i = 0; i < searchHistory[0].length; i++) {
            buildHistory(returnArray[i], 1);
            // Build search history for each item in the array.
        }
        searchHistory.shift()
        // Remove the array of the array.
    }
}

popList();

cityForm.addEventListener("submit", function(e) {
    // triggers when user inputs text.
    e.preventDefault();
    primaryFetch(chosenCity.value);
    // Fetches the input's respective API data for display.
    duplicateCheck(chosenCity.value);
    // checks for duplication or if there's 8 results already.
    buildHistory(chosenCity.value);
    // Adds the input city to the search history bar.
})

// TODO: response.status to provide errors if the site was down or 404'd, etc.
