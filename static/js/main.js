// DOM elements
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const clearLastSearchBtn = document.getElementById('clearLastSearchBtn');
const lastSearchIndicator = document.getElementById('lastSearchIndicator');
const loading = document.getElementById('loading');
const weatherResult = document.getElementById('weatherResult');
const errorMessage = document.getElementById('errorMessage');

// Weather data elements
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const weatherIcon = document.getElementById('weatherIcon');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const sunriseTime = document.getElementById('sunriseTime');
const sunsetTime = document.getElementById('sunsetTime');
const forecastContainer = document.getElementById('forecastContainer');
const hourlyContainer = document.getElementById('hourlyContainer');
const errorText = document.getElementById('errorText');

// Event listeners
getWeatherBtn.addEventListener('click', getWeather);
clearLastSearchBtn.addEventListener('click', clearLastSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});
cityInput.addEventListener('input', () => {
    // Show clear button when user is typing or there's content
    if (cityInput.value.length > 0) {
        clearLastSearchBtn.style.display = 'flex';
    } else {
        updateClearButtonVisibility();
    }
});

// Main function to get weather data
async function getWeather() {
    const city = cityInput.value.trim();
    
    // Validate input
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    // Show loading state
    showLoading();
    
    try {
        // Make request to Flask backend
        const response = await fetch('/get_weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city: city })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save successful search to localStorage
            saveLastSearch(city);
            // Display weather data
            displayWeatherData(data);
        } else {
            // Handle API errors
            throw new Error(data.error || 'Failed to fetch weather data');
        }
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError(error.message || 'Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

// Display weather data
function displayWeatherData(data) {
    const current = data.current;
    
    // Basic info
    cityName.textContent = `${current.city}, ${current.country}`;
    currentDate.textContent = formatCurrentDate();
    temperature.textContent = current.temperature;
    weatherDescription.textContent = current.description;
    feelsLike.textContent = `Feels like ${current.feels_like}°C`;
    
    // Weather icon
    const iconUrl = `https://openweathermap.org/img/wn/${current.weather_icon}@4x.png`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = current.description;
    
    // Detailed weather info
    humidity.textContent = `${current.humidity}%`;
    windSpeed.textContent = `${current.wind_speed} m/s`;
    pressure.textContent = `${current.pressure} hPa`;
    visibility.textContent = `${current.visibility} km`;
    
    // Sun times
    const sunrise = formatTime(current.sunrise, current.timezone);
    const sunset = formatTime(current.sunset, current.timezone);
    sunriseTime.textContent = sunrise;
    sunsetTime.textContent = sunset;
    
    // Display forecast data if available
    if (data.forecast) {
        displayForecast(data.forecast.daily);
        displayHourlyForecast(data.forecast.hourly);
    }
    
    // Hide error and show weather result
    hideError();
    weatherResult.style.display = 'block';
}

// Display 5-day forecast
function displayForecast(forecastData) {
    forecastContainer.innerHTML = '';
    
    forecastData.forEach((day, index) => {
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.style.animationDelay = `${index * 0.1}s`;
        
        const date = new Date(day.date);
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayMonth = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        forecastCard.innerHTML = `
            <div class="forecast-date">
                <strong>${dayName}</strong><br>
                <small>${dayMonth}</small>
            </div>
            <img class="forecast-icon" 
                 src="https://openweathermap.org/img/wn/${day.icon}@2x.png" 
                 alt="${day.description}">
            <div class="forecast-temps">
                <span class="temp-max">${day.temp_max}°</span>
                <span class="temp-min">${day.temp_min}°</span>
            </div>
            <div class="forecast-desc">${day.description}</div>
        `;
        
        forecastContainer.appendChild(forecastCard);
    });
}

// Display hourly forecast
function displayHourlyForecast(hourlyData) {
    hourlyContainer.innerHTML = '';
    
    hourlyData.forEach((hour, index) => {
        const hourlyCard = document.createElement('div');
        hourlyCard.className = 'hourly-card';
        hourlyCard.style.animationDelay = `${index * 0.05}s`;
        
        const time = new Date(hour.timestamp * 1000);
        const timeString = time.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            hour12: true 
        });
        
        hourlyCard.innerHTML = `
            <div class="hourly-time">${timeString}</div>
            <img class="hourly-icon" 
                 src="https://openweathermap.org/img/wn/${hour.icon}.png" 
                 alt="${hour.description}">
            <div class="hourly-temp">${hour.temperature}°</div>
        `;
        
        hourlyContainer.appendChild(hourlyCard);
    });
}

// Format current date
function formatCurrentDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
}

// Format timestamp to local time string
function formatTime(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'UTC'
    });
}

// Show loading state
function showLoading() {
    loading.style.display = 'flex';
    weatherResult.style.display = 'none';
    hideError();
    hideLastSearchIndicator();
    getWeatherBtn.disabled = true;
    getWeatherBtn.textContent = 'Loading...';
}

// Hide loading state
function hideLoading() {
    loading.style.display = 'none';
    getWeatherBtn.disabled = false;
    getWeatherBtn.textContent = 'Search';
}

// Show error message
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    weatherResult.style.display = 'none';
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
}

// Save last successful search to localStorage
function saveLastSearch(city) {
    try {
        localStorage.setItem('lastWeatherSearch', city);
    } catch (error) {
        console.log('Could not save to localStorage:', error);
    }
}

// Load last search from localStorage
function loadLastSearch() {
    try {
        const lastSearch = localStorage.getItem('lastWeatherSearch');
        if (lastSearch) {
            // Show loading indicator
            showLastSearchIndicator();
            cityInput.value = lastSearch;
            updateClearButtonVisibility();
            // Auto-load weather for the last searched city
            setTimeout(() => {
                getWeather();
            }, 500); // Small delay to show the indicator
        }
    } catch (error) {
        console.log('Could not load from localStorage:', error);
    }
}

// Show last search indicator
function showLastSearchIndicator() {
    lastSearchIndicator.style.display = 'flex';
    setTimeout(() => {
        hideLastSearchIndicator();
    }, 2000);
}

// Hide last search indicator
function hideLastSearchIndicator() {
    if (lastSearchIndicator.style.display !== 'none') {
        lastSearchIndicator.style.display = 'none';
    }
}

// Clear last search from localStorage
function clearLastSearch() {
    try {
        localStorage.removeItem('lastWeatherSearch');
        cityInput.value = '';
        weatherResult.style.display = 'none';
        hideError();
        updateClearButtonVisibility();
        cityInput.focus();
    } catch (error) {
        console.log('Could not clear localStorage:', error);
    }
}

// Update clear button visibility
function updateClearButtonVisibility() {
    try {
        const hasLastSearch = localStorage.getItem('lastWeatherSearch');
        clearLastSearchBtn.style.display = hasLastSearch ? 'flex' : 'none';
    } catch (error) {
        clearLastSearchBtn.style.display = 'none';
    }
}

// Auto-focus on city input when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateClearButtonVisibility();
    cityInput.focus();
    loadLastSearch();
});