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
let recentSearch = localStorage.getItem("recentSearch");

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
    if (refresh == 1) {
        return;
    } else {
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
        // checks for duplication or if there's 10 results already.
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
    } else if (searchHistory == 10) {
        searchHistory.shift()
        // Checks to see if the array is at 10. If so, removes the oldest value.
    }
}

function popList() {
    if (recentSearch == null) {
        return;
    } else {
        let returnArray = JSON.parse(recentSearch)
        searchHistory.push(returnArray);
        console.log(searchHistory)
        for (let i = 0; i < 3; i++) {
            buildHistory(returnArray[i], 1);
        }
    }
}

popList();

cityForm.addEventListener("submit", function(e) {
    // triggers when user inputs text.
    e.preventDefault();
    primaryFetch(chosenCity.value);
    // Fetches the input's respective API data for display.
    duplicateCheck(chosenCity.value);
    // checks for duplication or if there's 10 results already.
    buildHistory(chosenCity.value);
    // Adds the input city to the search history bar.
})

for (let i = 0; i < clickSearch.length; i++) {
    eventClicks(clickSearch[i]);
    // On page load, all existing searches are given an event listener.
}

// TODO: response.status to provide errors if the site was down or 404'd, etc.
