//DOM element variables
const searchEl = document.querySelector("#searchedCity");
const searchBtn = document.querySelector("#search");
const clearBtn = document.querySelector("#clear");
const cityHistoryEl = document.querySelector("#cityHistory");
const currCityEl = document.querySelector("#currentCity");
const currInfoEl = document.querySelector("#currentInfo");
const currUVEl = document.querySelector("#currentUV");
const currUVIndexEl = document.querySelector("#currentUVIndex");
const fiveDayEl = document.querySelector("#fiveDay");

function getCoords(city) {
  //sets API call
  const currSearch = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=db4bfdf57ac03972792c74c1239c237e`;

  fetch(currSearch)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);

      //sets newCoords object with API data based on user input
      let newCoords = {
        city: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
      };
      console.log(newCoords);

      //pulls unique coordinates from localStorage or sets an empty array
      let historyCoords =
        JSON.parse(localStorage.getItem("historyCoords")) || [];

      //pulls all coordinates from localStorage or sets an empty array
      let searchedCoords =
        JSON.parse(localStorage.getItem("searchedCoords")) || [];

      //sets variable type to boolean
      let newCity = true;

      //checks uniqueness of current user input to previous searches
      newCity = historyCoords.every(function (val) {
        console.log(val.city);
        if (newCoords.city !== val.city) {
          return true;
        } else {
          return false;
        }
      });

      console.log(newCity);

      //saves city/coordinates to both localStorage arrays, if city is new
      //saves city/coordinates to general localStorage array, if city is a repeat
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
  //pulls coords from localStorage
  const historyCoords = JSON.parse(localStorage.getItem("historyCoords"));

  //
  if (historyCoords !== null) {
    for (let i = 0; i < historyCoords.length; i++) {
      //creates button elements for each saved city
      const btn = document.createElement("button");
      let cityName = historyCoords[i].city;

      //sets text of button to corresponding city
      btn.textContent = cityName;

      //appends created button el to existing element on page
      cityHistoryEl.appendChild(btn);

      //ties event listener that runs function as if it had been entered into search bar
      btn.onclick = function (event) {
        let oldCity = event.target.textContent;
        apiCall(oldCity);
      };
    }
  }
}

function clearHistory() {
  //clears localStorage, removing all cities/coords
  //reloads page to display change
  localStorage.removeItem("historyCoords");
  window.location.reload();
}

function citySearch() {
  //pulls coords from localStorage
  const currCoords = JSON.parse(localStorage.getItem("searchedCoords"));
  //creates all necessary elements to display weather info
  const h2 = document.createElement("h2");
  const h2Date = document.createElement("h2");
  const img = document.createElement("img");
  const pTemp = document.createElement("p");
  const pWind = document.createElement("p");
  const pHumi = document.createElement("p");
  const pUV = document.createElement("p");
  const pUVIndex = document.createElement("p");

  //sets API calls using most recent user input
  const city = currCoords[currCoords.length - 1].city;
  const lat = currCoords[currCoords.length - 1].lat;
  const lon = currCoords[currCoords.length - 1].lon;
  const coordSearch = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=alerts,minutely,hourly,daily&units=imperial&appid=db4bfdf57ac03972792c74c1239c237e`;

  //sets city name and appends to page
  h2.textContent = city;
  currCityEl.appendChild(h2);

  fetch(coordSearch)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);

      //converts provided Unix number into conventional date/time format
      const currUnix = data.current.dt;
      const date = new Date(currUnix * 1000);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getUTCFullYear();

      //formats date/time and appends to page
      h2Date.textContent = `${month}/${day}/${year}`;
      currCityEl.appendChild(h2Date);

      //pulls provided icon and appends to page
      const currImg = data.current.weather[0].icon;
      const weatherImg = `http://openweathermap.org/img/wn/${currImg}.png`;

      img.src = weatherImg;
      currCityEl.appendChild(img);

      //pulls/formats provided temperature and appends to page
      const currTemp = data.current.temp;

      pTemp.textContent = `Temp: ${currTemp}\u00B0F`;
      currInfoEl.appendChild(pTemp);

      //pulls/formats provided wind speed and appends to page
      const currWind = data.current.wind_speed;

      pWind.textContent = `Wind: ${currWind} MPH`;
      currInfoEl.appendChild(pWind);

      //pulls/formats provided humidity percentage and appends to page
      const currHumi = data.current.humidity;

      pHumi.textContent = `Humidity: ${currHumi}%`;
      currInfoEl.appendChild(pHumi);

      //pulls/formats provided UV Index and appends to page
      const currUV = data.current.uvi;

      pUV.textContent = `UV Index:  `;
      pUVIndex.textContent = `${currUV}`;
      currUVEl.appendChild(pUV);
      currUVIndexEl.appendChild(pUVIndex);

      //changes visual indicator depending on UV Index severity
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
  //sets API calls using most recent user input
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

      //sets loop to get info for five day forecast
      for (let i = 1; i < 6; i++) {
        //creates all necessary elements to display single day weather info
        const dayBox = document.createElement("div");
        const h3 = document.createElement("h3");
        const imgFive = document.createElement("img");
        const pTempFive = document.createElement("p");
        const pWindFive = document.createElement("p");
        const pHumiFive = document.createElement("p");

        //sets/formats single day container and appends to page
        dayBox.setAttribute("class", "dayBox");
        fiveDayEl.appendChild(dayBox);

        //converts provided Unix number into conventional date/time format
        const currUnixFive = data.daily[i].dt;
        const dateFive = new Date(currUnixFive * 1000);
        const monthFive = dateFive.getMonth() + 1;
        const dayFive = dateFive.getDate();
        const yearFive = dateFive.getUTCFullYear();

        //formats date/time and appends to page
        h3.textContent = `${monthFive}/${dayFive}/${yearFive}`;
        dayBox.appendChild(h3);

        //pulls provided icon and appends to page
        const currImgFive = data.daily[i].weather[0].icon;
        const weatherImgFive = `http://openweathermap.org/img/wn/${currImgFive}.png`;

        imgFive.src = weatherImgFive;
        dayBox.appendChild(imgFive);

        //pulls/formats provided temperature and appends to page
        const currTempFive = data.daily[i].temp.max;

        pTempFive.textContent = `Temp: ${currTempFive}\u00B0F`;
        dayBox.appendChild(pTempFive);

        //pulls/formats provided wind speed and appends to page
        const currWindFive = data.daily[i].wind_speed;

        pWindFive.textContent = `Wind: ${currWindFive} MPH`;
        dayBox.appendChild(pWindFive);

        //pulls/formats provided humidity percentage and appends to page
        const currHumiFive = data.daily[i].humidity;

        pHumiFive.textContent = `Humidity: ${currHumiFive}%`;
        dayBox.appendChild(pHumiFive);

        //sets id to last day in array for formatting purposes
        if (i === 5) {
          dayBox.setAttribute("id", "day5");
        }
      }
    });
}

function removePrevious() {
  //clears previously appended information to prevent duplication
  currCityEl.innerHTML = "";
  currInfoEl.innerHTML = "";
  currUVEl.innerHTML = "";
  currUVIndexEl.innerHTML = "";
  fiveDayEl.innerHTML = "";
  cityHistoryEl.innerHTML = "";
}

function apiCall(city) {
  //formats function parameters to accept both a new search term or one from history
  let searchedCity = city || searchEl.value;
  if (searchedCity !== "") {
    removePrevious();
    getCoords(searchedCity);
    //timeouts set to allow time for API response
    setTimeout(citySearch, 1000);
    setTimeout(fiveDay, 1000);
    setTimeout(addHistory, 1000);
  }
}

function enterCheck(event) {
  //runs function if enter key is pressed
  if (event.key === "Enter") {
    apiCall();
  }
}

//runs history function on page load to provide previous searches, if any
addHistory();

//ties city search function to correct button el
searchBtn.onclick = function () {
  //passes function parameter to ensure current user input is used
  apiCall(null);
};

//ties enter key check function to correct input el
searchEl.onkeyup = enterCheck;

//ties clear history function to correct button el
clearBtn.onclick = clearHistory;
