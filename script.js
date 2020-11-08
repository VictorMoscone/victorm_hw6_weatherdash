let cityName = document.querySelector("#cityName");
let currentDate = document.querySelector("#currentDate");
let mainWeather = document.querySelector("#mainWeather");
let tempF = document.querySelector("#tempF");
let humidity = document.querySelector("#humidity");
let windSpeed = document.querySelector("#windSpeed");
let uvIndex = document.querySelector("#uvIndex");
let cityForm = document.querySelector("#cityForm");
let chosenCity = document.querySelector("#chosenCity");
let weatherInfo = document.querySelector("#weatherInfo");
let fiveForecast = document.querySelector("#fiveForecast");
let fiveDateArray = [
    fiveDate1 = document.querySelector("#fiveDate1"),
    fiveDate2 = document.querySelector("#fiveDate2"),
    fiveDate3 = document.querySelector("#fiveDate3"),
    fiveDate4 = document.querySelector("#fiveDate4"),
    fiveDate5 = document.querySelector("#fiveDate5"),
]
let fiveTempArray = [
    fiveTemp1 = document.querySelector("#fiveTemp1"),
    fiveTemp2 = document.querySelector("#fiveTemp2"),
    fiveTemp3 = document.querySelector("#fiveTemp3"),
    fiveTemp4 = document.querySelector("#fiveTemp4"),
    fiveTemp5 = document.querySelector("#fiveTemp5"),
]
let fiveHumidArray = [
    fiveHumid1 = document.querySelector("#fiveHumid1"),
    fiveHumid2 = document.querySelector("#fiveHumid2"),
    fiveHumid3 = document.querySelector("#fiveHumid3"),
    fiveHumid4 = document.querySelector("#fiveHumid4"),
    fiveHumid5 = document.querySelector("#fiveHumid5"),
]
let fiveIconArray = [
    fiveIcon1 = document.querySelector("#fiveIcon1"),
    fiveIcon2 = document.querySelector("#fiveIcon2"),
    fiveIcon3 = document.querySelector("#fiveIcon3"),
    fiveIcon4 = document.querySelector("#fiveIcon4"),
    fiveIcon5 = document.querySelector("#fiveIcon5"),
]
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
        uvIndexApi(`http://api.openweathermap.org/data/2.5/uvi?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=bb4f4eb722b35b0afd1d0fc61d673140&units=imperial`)
        // When this fetch function is run, it will display the returned data in the main section.
      });
  }

function forecastApi(foreCastUrl) {
    fetch(foreCastUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
          for (let i = 0; i < 5; i++) {
            let currentDay = new moment().add(i + 1, 'day');
            fiveDateArray[i].textContent = currentDay.format(`MM/D/YYYY`);
            fiveIconArray[i].setAttribute("src", `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`)
            fiveTempArray[i].textContent = data.list[i].main.temp;
            fiveHumidArray[i].textContent = data.list[i].main.humidity;
            // When this fetch function is run, it will display the returned data in all 5 forecasts.
          }
      });  
}

function uvIndexApi(uvIndexUrl) {
    fetch(uvIndexUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data)
        uvIndex.textContent = data.value
      });  
}

function fiveDayPop(source) {
    forecastApi(`https://api.openweathermap.org/data/2.5/forecast?q=${source}&appid=bb4f4eb722b35b0afd1d0fc61d673140&units=imperial`)
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
