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

/**
 * Fetches and displays weather information based on user's current location.
 *
 * @param {Object} position - The current position of the user.
 * @property {Object} coords - Coordinates of the user's location.
 * @property {number} latitude - Latitude coordinate.
 * @property {number} longitude - Longitude coordinate.
 *
 * @throws {Error} If unable to fetch weather data.
 */
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


/**
 * Toggles the temperature unit between Celsius and Fahrenheit, updates the button text accordingly,
 * and fetches the current weather using geolocation if available.
 *
 * @returns {void}
 */
function toggleTempUnit() {
    isCelsius = !isCelsius; // Toggle the temperature unit
    document.getElementById('toggleTempUnit').textContent = isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showWeather, showError);
    }
}

/**
 * Retrieves an HTML icon representing the given weather condition.
 *
 * @param {string} weatherCondition - The weather condition to retrieve the icon for. Must be one of 'clear', 'rain', or 'clouds'. Case-insensitive.
 * @return {string} An HTML string containing the icon, or an empty string if the input is invalid.
 *
 * Example:
 * getWeatherIcon('Clear'); // Returns '<i class="fa-regular fa-sun"></i>'
 * getWeatherIcon('rainy'); // Returns '<i class="fa-solid fa-umbrella"></i>'
 * getWeatherIcon('Clouds'); // Returns '<i class="fa-solid fa-cloud"></i>'
 * getWeatherIcon('snow'); // Returns ''
 */
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


/**
 * Displays an error message based on the provided error object.
 *
 * @param {Object} error - The error object containing the error code.
 */
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
