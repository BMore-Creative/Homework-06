const searchEl = document.querySelector("#searchedCity");
const searchBtn = document.querySelector("#search");
const clearBtn = document.querySelector('#clear');
const cityHistoryEl = document.querySelector("#cityHistory");
const currCityEl = document.querySelector("#currentCity");
const currInfoEl = document.querySelector("#currentInfo");
const currUVEl = document.querySelector("#currentUV");
const currUVIndexEl = document.querySelector("#currentUVIndex");
const fiveDayEl = document.querySelector("#fiveDay");

function getCoords(city) {
  const currSearch = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=db4bfdf57ac03972792c74c1239c237e`;

  fetch(currSearch)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      let newCoords = {
        city: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
      };
      console.log(newCoords);

      let historyCoords =
        JSON.parse(localStorage.getItem("historyCoords")) || [];

      let searchedCoords =
        JSON.parse(localStorage.getItem("searchedCoords")) || [];

      let newCity = true;

      newCity = historyCoords.every(function (val) {
        console.log(val.city);
        if (newCoords.city !== val.city) {
          return true;
        } else {
          return false;
        }
      });

      console.log(newCity);

      if (newCity === true) {
        historyCoords.push(newCoords);
        searchedCoords.push(newCoords);
        console.log("New City Added");
      } else {
        searchedCoords.push(newCoords);
        console.log("Old City Added");
      }

      localStorage.setItem("historyCoords", JSON.stringify(historyCoords));
      localStorage.setItem("searchedCoords", JSON.stringify(searchedCoords));
    });
}

function addHistory() {
  const historyCoords = JSON.parse(localStorage.getItem("historyCoords"));

  if (historyCoords !== null) {
    for (let i = 0; i < historyCoords.length; i++) {
      const btn = document.createElement("button");
      let cityName = historyCoords[i].city;

      btn.textContent = cityName;

      cityHistoryEl.appendChild(btn);

      btn.onclick = function (event) {
          let oldCity = event.target.textContent
          apiCall(oldCity);
      }
    }
  }
}

function clearHistory() {
    localStorage.removeItem('historyCoords');
    window.location.reload();
}

function citySearch() {
  const currCoords = JSON.parse(localStorage.getItem("searchedCoords"));
  const h2 = document.createElement("h2");
  const h2Date = document.createElement("h2");
  const img = document.createElement("img");
  const pTemp = document.createElement("p");
  const pWind = document.createElement("p");
  const pHumi = document.createElement("p");
  const pUV = document.createElement("p");
  const pUVIndex = document.createElement("p");

  const city = currCoords[currCoords.length - 1].city;
  const lat = currCoords[currCoords.length - 1].lat;
  const lon = currCoords[currCoords.length - 1].lon;
  const coordSearch = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=alerts,minutely,hourly,daily&units=imperial&appid=db4bfdf57ac03972792c74c1239c237e`;

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

      h2Date.textContent = `${month}/${day}/${year}`;
      currCityEl.appendChild(h2Date);

      const currImg = data.current.weather[0].icon;
      const weatherImg = `http://openweathermap.org/img/wn/${currImg}.png`;

      img.src = weatherImg;
      currCityEl.appendChild(img);

      const currTemp = data.current.temp;

      pTemp.textContent = `Temp: ${currTemp}\u00B0F`;
      currInfoEl.appendChild(pTemp);

      const currWind = data.current.wind_speed;

      pWind.textContent = `Wind: ${currWind} MPH`;
      currInfoEl.appendChild(pWind);

      const currHumi = data.current.humidity;

      pHumi.textContent = `Humidity: ${currHumi}%`;
      currInfoEl.appendChild(pHumi);

      const currUV = data.current.uvi;

      pUV.textContent = `UV Index:  `;
      pUVIndex.textContent = `${currUV}`;
      currUVEl.appendChild(pUV);
      currUVIndexEl.appendChild(pUVIndex);

      if (currUV < 3) {
        currUVIndexEl.setAttribute("class", "uvLow");
      } else if (currUV < 6) {
        currUVIndexEl.setAttribute("class", "uvMid");
      } else if (currUV < 8) {
        currUVIndexEl.setAttribute("class", "uvHigh");
      } else {
        currUVIndexEl.setAttribute("class", "uvVHigh");
      }
    });
}

function fiveDay() {
  const currCoords = JSON.parse(localStorage.getItem("searchedCoords"));
  const lat = currCoords[currCoords.length - 1].lat;
  const lon = currCoords[currCoords.length - 1].lon;
  const fiveDayCoords = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=alerts,minutely,hourly,current&units=imperial&appid=db4bfdf57ac03972792c74c1239c237e`;

  fetch(fiveDayCoords)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);

      for (let i = 1; i < 6; i++) {
        const dayBox = document.createElement("div");
        const h3 = document.createElement("h3");
        const imgFive = document.createElement("img");
        const pTempFive = document.createElement("p");
        const pWindFive = document.createElement("p");
        const pHumiFive = document.createElement("p");

        dayBox.setAttribute("class", "dayBox");
        fiveDayEl.appendChild(dayBox);

        const currUnixFive = data.daily[i].dt;
        const dateFive = new Date(currUnixFive * 1000);
        const monthFive = dateFive.getMonth() + 1;
        const dayFive = dateFive.getDate();
        const yearFive = dateFive.getUTCFullYear();

        h3.textContent = `${monthFive}/${dayFive}/${yearFive}`;
        dayBox.appendChild(h3);

        const currTempFive = data.daily[i].temp.max;

        pTempFive.textContent = `Temp: ${currTempFive}\u00B0F`;
        dayBox.appendChild(pTempFive);

        const currImgFive = data.daily[i].weather[0].icon;
        const weatherImgFive = `http://openweathermap.org/img/wn/${currImgFive}.png`;

        imgFive.src = weatherImgFive;
        dayBox.insertBefore(imgFive, pTempFive);

        const currWindFive = data.daily[i].wind_speed;

        pWindFive.textContent = `Wind: ${currWindFive} MPH`;
        dayBox.appendChild(pWindFive);

        const currHumiFive = data.daily[i].humidity;

        pHumiFive.textContent = `Humidity: ${currHumiFive}%`;
        dayBox.appendChild(pHumiFive);
      }
    });
}

function removePrevious() {
  currCityEl.innerHTML = "";
  currInfoEl.innerHTML = "";
  currUVEl.innerHTML = "";
  currUVIndexEl.innerHTML = "";
  fiveDayEl.innerHTML = "";
  cityHistoryEl.innerHTML = "";
}

function apiCall(city) {
  let searchedCity = searchEl.value || city;
  if (searchedCity !== "") {
    removePrevious();
    getCoords(searchedCity);
    setTimeout(citySearch, 1000);
    setTimeout(fiveDay, 1000);
    setTimeout(addHistory, 1000);
  }
}

function enterCheck(event) {
  if (event.key === "Enter") {
    apiCall();
  }
}

addHistory();

searchBtn.onclick = apiCall;

searchEl.onkeyup = enterCheck;

clearBtn.onclick = clearHistory;