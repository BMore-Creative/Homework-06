const searchEl = document.querySelector('#searchedCity');
const searchBtn = document.querySelector('#search');
const currCityEl = document.querySelector('#currentCity');
const currTempEl = document.querySelector('#currentTemp');
const currWindEl = document.querySelector('#currentWind');
const currHumiEl = document.querySelector('#currentHumidity');
const currUVEl = document.querySelector('#currentUV');
const currUVIndexEl =document.querySelector('#currentUVIndex');
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
    const h4 = document.createElement('h4');
    const img = document.createElement('img');
    const pTemp = document.createElement('p');
    const pWind = document.createElement('p');
    const pHumi = document.createElement('p');
    const pUV = document.createElement('p');
    const pUVIndex = document.createElement('p');

    const city = currCoords[currCoords.length - 1].city;
    const lat = currCoords[currCoords.length - 1].lat;
    const lon = currCoords[currCoords.length - 1].lon;
    const coordSearch = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=alerts,minutely,hourly&units=imperial&appid=db4bfdf57ac03972792c74c1239c237e`

    h2.textContent = city;
    currCityEl.appendChild(h2);

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

            h4.textContent = `${month}/${day}/${year}`;
            h2.appendChild(h4);
            
            const currImg = data.current.weather[0].icon;
            const weatherImg = `http://openweathermap.org/img/wn/${currImg}.png`;

            img.src = weatherImg;
            h4.appendChild(img);

            const currTemp = data.current.temp;
            
            pTemp.textContent = `Temp: ${currTemp}\u00B0F`;
            currTempEl.appendChild(pTemp);

            const currWind = data.current.wind_speed;
            
            pWind.textContent = `Wind: ${currWind} MPH`;
            currWindEl.appendChild(pWind);

            const currHumi = data.current.humidity;
            
            pHumi.textContent = `Humidity: ${currHumi} %`;
            currHumiEl.appendChild(pHumi);

            const currUV = data.current.uvi;
            
            pUV.textContent = `UV Index: `;
            pUVIndex.textContent = `${currUV}`;
            currUVEl.appendChild(pUV);
            currUVIndexEl.appendChild(pUVIndex);
        })
};

searchBtn.onclick = function () {
    let searchedCity = searchEl.value;
    getCoords(searchedCity);
    setTimeout(citySearch, 1000);
};