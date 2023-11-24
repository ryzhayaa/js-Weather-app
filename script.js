const api = '7c68db74cfb21851796c2a72b8fdb14d';

const iconImg = document.getElementById('weather-icon');
const loc = document.querySelector('#location');
const tempC = document.querySelector('.c');
const tempF = document.querySelector('.f');
const desc = document.querySelector('.desc');
const sunriseDOM = document.querySelector('.sunrise');
const sunsetDOM = document.querySelector('.sunset');

// New variables for the input fields and button
const longitudeInput = document.getElementById('longitude');
const latitudeInput = document.getElementById('latitude');
const submitButton = document.getElementById('submit-coordinates');

submitButton.addEventListener('click', () => {
  const long = longitudeInput.value;
  const lat = latitudeInput.value;
  
  const base = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api}&units=metric`;

  fetch(base)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const { temp, feels_like } = data.main;
      const place = data.name;
      const { description, icon } = data.weather[0];
      const { sunrise, sunset } = data.sys;

      const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      const fahrenheit = (temp * 9) / 5 + 32;

      const sunriseGMT = new Date(sunrise * 1000);
      const sunsetGMT = new Date(sunset * 1000);

      iconImg.src = iconUrl;
      loc.textContent = `${place}`;
      desc.textContent = `${description}`;
      tempC.textContent = `${temp.toFixed(2)} °C`;
      tempF.textContent = `${fahrenheit.toFixed(2)} °F`;
      sunriseDOM.textContent = `${sunriseGMT.toLocaleDateString()}, ${sunriseGMT.toLocaleTimeString()}`;
      sunsetDOM.textContent = `${sunsetGMT.toLocaleDateString()}, ${sunsetGMT.toLocaleTimeString()}`;
    });
});