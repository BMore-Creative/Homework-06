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
                city: data.name,
                lat: data.coord.lat,
                lon: data.coord.lon
            };
            console.log(newCoords);
            let searchedCoords = JSON.parse(localStorage.getItem('searchedCoords')) || [];
            searchedCoords.push(newCoords);
            localStorage.setItem('searchedCoords', JSON.stringify(searchedCoords));
        })
};



function citySearch() {
    const currCoords = JSON.parse(localStorage.getItem('searchedCoords'));
    const h2 = document.createElement('h2');
    const p = document.createElement('p');
    const img = document.createElement('img');

    const city = currCoords[currCoords.length - 1].city;
    const lat = currCoords[currCoords.length - 1].lat;
    const lon = currCoords[currCoords.length - 1].lon;
    const coordSearch = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=alerts,minutely,hourly&units=imperial&appid=db4bfdf57ac03972792c74c1239c237e`

    h2.textContent = city;
    curCityEl.appendChild(h2);

    fetch(coordSearch)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(data);
            const currUnix = data.current.dt;
            const date = new Date(currUnix * 1000);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const year = date.getUTCFullYear();

            p.textContent = `${month}/${day}/${year}`;
            h2.appendChild(p);
            
            const currWeather = data.current.weather[0].icon;
            const weatherImg = `http://openweathermap.org/img/wn/${currWeather}@2x.png`

            img.src = weatherImg;
            p.appendChild(img);

        })
};

searchBtn.onclick = function () {
    let searchedCity = searchEl.value;
    getCoords(searchedCity);
    setTimeout(citySearch, 1000);
};