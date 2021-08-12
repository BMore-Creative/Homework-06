const searchEl = document.querySelector('#searchedCity');
const searchBtn = document.querySelector('#search');
const curCityEl = document.querySelector('#currentCity');
const fiveDayEl = document.querySelector('#fiveDay');

function getCoords(city) {
    const currSearch = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=db4bfdf57ac03972792c74c1239c237e`

    fetch (currSearch)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            let newCoords = {
                lat: data.coord.lat,
                lon: data.coord.lon
            };
            let searchedCoords = JSON.parse(localStorage.getItem('searchedCoords')) || [];
            searchedCoords.push(newCoords);
            localStorage.setItem('searchedCoords', JSON.stringify(searchedCoords));
        })
};



function citySearch() {
    const currCoords = JSON.parse(localStorage.getItem('searchedCoords'));
    console.log(currCoords);
    const lat = currCoords[currCoords.length - 1].lat;
    const lon = currCoords[currCoords.length - 1].lon;
    const coordSearch = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=&appid=db4bfdf57ac03972792c74c1239c237e`

    fetch(coordSearch)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
        })
};

searchBtn.onclick = function () {
    let searchedCity = searchEl.value;
    getCoords(searchedCity);
    setTimeout(citySearch, 500);
}

//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=db4bfdf57ac03972792c74c1239c237e