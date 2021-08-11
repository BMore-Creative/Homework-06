const searchEl = document.querySelector('#searchedCity');
const searchBtn = document.querySelector('#search');
const curCityEl = document.querySelector('#currentCity');
const fiveDayEl = document.querySelector('#fiveDay');

function citySearch(city) {
    const currentSearch = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=db4bfdf57ac03972792c74c1239c237e`

    fetch (currentSearch)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
};

searchBtn.onclick = function () {
    let searchedCity = searchEl.value;
    citySearch(searchedCity);
};
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=db4bfdf57ac03972792c74c1239c237e