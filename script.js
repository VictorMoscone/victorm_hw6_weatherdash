let callCity = function asd(cityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Fresno&appid=bb4f4eb722b35b0afd1d0fc61d673140')
        .then(response => response.json())
        .then(data => console.log(data));
}

callCity();