let isCelsius = true; // Default temperature unit

document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather, showError);
    } else {
        document.getElementById('weatherInfo').textContent = 'Geolocation is not supported by this browser.';
    }

    // Event listener for the toggle text
    document.getElementById('toggleTempUnit').addEventListener('click', toggleTempUnit);
});

function showWeather(position) {
    const apiKey = 'e355609b76e84ef8fc66bd2de45c493c';
    const units = isCelsius ? 'metric' : 'imperial'; // Choose units based on isCelsius
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const weather = data.weather[0].main;
            const temp = Math.round(data.main.temp); // Round the temperature here
            const unitSymbol = isCelsius ? '°C' : '°F';
            const icon = getWeatherIcon(weather);
            document.getElementById('weatherInfo').innerHTML = `${icon} Weather: ${weather}, Temp: ${temp}${unitSymbol}`;
        })
        .catch(error => {
            document.getElementById('weatherInfo').textContent = 'Unable to retrieve weather data.';
        });
}


function toggleTempUnit() {
    isCelsius = !isCelsius; // Toggle the temperature unit
    document.getElementById('toggleTempUnit').textContent = isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather, showError);
    }
}

function getWeatherIcon(weatherCondition) {
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            return '<i class="fa-regular fa-sun"></i>';
        case 'rain':
            return '<i class="fa-solid fa-umbrella"></i>';
        case 'clouds':
            return '<i class="fa-solid fa-cloud"></i>';
        default:
            return ''; // Default case if the weather condition doesn't match
    }
}


function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('weatherInfo').textContent = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('weatherInfo').textContent = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            document.getElementById('weatherInfo').textContent = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('weatherInfo').textContent = "An unknown error occurred."
            break;
    }
}
