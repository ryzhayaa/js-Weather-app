const api = '7c68db74cfb21851796c2a72b8fdb14d';
const yandexApiKey = '0c2b78b7-c237-4d6f-876a-8357fa98d13e'; // API-ключ для Яндекс карт

const widgets = document.querySelectorAll('.container');

document.getElementById('create-widget').addEventListener('click', function() {
    const widget = document.createElement('div');
    const uniqueId = Date.now();
    widget.className = 'widget';
    widget.innerHTML = `
    <div class="container" id="widget-${uniqueId}">
  <img src="" alt="" srcset="" id="weather-icon">
  <div id="location">Welcome to the weather forecast app!</div>
  <div class="desc">Enter the coordinates below, to get weather information</div>
  <div class="weather">
      <div class="c"></div>
      <div class="circle"></div>
      <div class="f"></div>
  </div>
  <div class="info" style="display: none;">
      <h4>Sunrise: <span class="sunrise"></span></h4>
      <h4>Sunset: <span class="sunset"></span></h4>
  </div>
  <div class="coordinates">
      <input type="text" id="longitude" placeholder="Enter the longitude">
      <input type="text" id="latitude" placeholder="Enter the latitude">
      <button id="submit-coordinates">Get the weather</button>
  </div>
  <div class="map" id="map-${uniqueId}"></div>
  <button id="create-widget">Create a widget</button>
  <div id="widgets-container"></div>
</div>
  `;
  document.getElementById('widgets-container').appendChild(widget);
});

let activeWidget = null;
let initialX = 0;
let initialY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousedown', function(event) {
    if (event.target.classList.contains('widget')) {
        activeWidget = event.target;
        initialX = event.clientX - currentX;
        initialY = event.clientY - currentY;
    }
});

document.addEventListener('mousemove', function(event) {
    if (activeWidget) {
        event.preventDefault();
        currentX = event.clientX - initialX;
        currentY = event.clientY - initialY;
        activeWidget.style.transform = 'translate3d(' + currentX + 'px, ' + currentY + 'px, 0)';
    }
});

document.addEventListener('mouseup', function() {
    initialX = currentX;
    initialY = currentY;
    activeWidget = null;
});

widgets.forEach((widget) => {
    const iconImg = widget.querySelector('#weather-icon');
    const loc = widget.querySelector('#location');
    const tempC = widget.querySelector('.c');
    const tempF = widget.querySelector('.f');
    const desc = widget.querySelector('.desc');
    const sunriseDOM = widget.querySelector('.sunrise');
    const sunsetDOM = widget.querySelector('.sunset');
    const info = widget.querySelector('.info');

    const longitudeInput = widget.querySelector('#longitude');
    const latitudeInput = widget.querySelector('#latitude');
    const submitButton = widget.querySelector('#submit-coordinates');
    const mapContainer = widget.querySelector('.map');

    submitButton.addEventListener('click', function () {
        const long = longitudeInput.value;
        const lat = latitudeInput.value;

        if (long && lat) {
            fetchWeatherData(long, lat, widget);
        } else {
            alert("Please, enter longitude and latitude");
        }
    });
});

function fetchWeatherData(long, lat, widget, mapContainer) {
    const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;

    fetch(base)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network error");
            }
            return response.json();
        })
        .then((data) => {
            displayWeatherData(data, widget);
            displayMap(long, lat, mapContainer);
            info.style.display = "block";
        })
        .catch((error) => {
            alert(error.message);
        });
}

function displayWeatherData(data, widget) {
    const { temp, feels_like } = data.main;
    const place = data.name;
    const { description, icon } = data.weather[0];
    const { sunrise, sunset } = data.sys;
const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    const fahrenheit = (temp * 9) / 5 + 32;

    const sunriseGMT = new Date(sunrise * 1000);
    const sunsetGMT = new Date(sunset * 1000);

    const iconImg = widget.querySelector('#weather-icon');
    const loc = widget.querySelector('#location');
    const tempC = widget.querySelector('.c');
    const tempF = widget.querySelector('.f');
    const desc = widget.querySelector('.desc');
    const sunriseDOM = widget.querySelector('.sunrise');
    const sunsetDOM = widget.querySelector('.sunset');

    iconImg.src = iconUrl;
    loc.textContent = `${place}`;
    desc.textContent = `${description}`;
    tempC.textContent = `${temp.toFixed(2)} °C`;
    tempF.textContent = `${fahrenheit.toFixed(2)} °F`;
    sunriseDOM.textContent = `${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}`;
    sunsetDOM.textContent = `${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;
}

function fetchWeatherData(long, lat, widget) {
  const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;

  fetch(base)
      .then((response) => {
          if (!response.ok) {
              throw new Error("Network error");
          }
          return response.json();
      })
      .then((data) => {
          displayWeatherData(data, widget);

          // Добавлен вызов функции для отображения карты
          displayMap(long, lat);
      })
      .catch((error) => {
          alert(error.message);
      });
}

// Функция для отображения карты
function displayMap(long, lat) {
  // Проверка наличия глобальной переменной ymaps
  if (typeof ymaps === 'undefined') {
      console.error('Yandex Maps API не загружен.');
      return;
  }

  // Инициализация карты
  ymaps.ready(function () {
      const myMap = new ymaps.Map("map", {
          center: [lat, long],
          zoom: 10
      });

      // Создание метки
      const myPlacemark = new ymaps.Placemark([lat, long], {
          hintContent: 'Место',
          balloonContent: 'Координаты: ' + lat + ', ' + long
      });

      // Добавление метки на карту
      myMap.geoObjects.add(myPlacemark);
  });
}
