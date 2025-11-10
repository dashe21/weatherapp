# Weather Dashboard

A comprehensive weather dashboard with a full-page design built with Flask (Python) backend and vanilla JavaScript frontend.

## Features

### 🌤️ **Current Weather**
- Real-time weather data from OpenWeatherMap API
- Large, immersive weather display with hero section
- Temperature in Celsius with "feels like" indicator
- Comprehensive weather details (humidity, wind, pressure, visibility, sunrise/sunset)

### 📅 **Weather Forecasting**
- **5-Day Forecast**: Daily weather predictions with high/low temperatures
- **Hourly Forecast**: Next 24 hours broken down by hour
- Visual weather icons and descriptions for each forecast period

### 🎨 **Modern Full-Page Design**
- Immersive full-screen weather dashboard
- Fixed navigation header with search functionality
- Beautiful gradient backgrounds and glass-morphism effects
- Smooth animations and hover effects
- Fully responsive design for all devices

### 💾 **Smart Memory Features**
- **Remember last successful search** - automatically loads your last searched city when you return
- **Visual loading indicators** - shows when loading your saved search
- **Clear saved search** - easily clear your saved search with the clear button
- **Smart persistence** - only successful searches are remembered

## Project Structure

```
weather-dashboard/
├── app.py                 # Flask backend with current weather + forecast APIs
├── templates/
│   └── index.html        # Full-page weather dashboard template
├── static/
│   ├── css/
│   │   └── style.css     # Modern dashboard styling with animations
│   └── js/
│       └── main.js       # Enhanced frontend with forecast functionality
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Setup Instructions

### 1. Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

```bash
# Copy the environment template
cp .env.example .env

# Edit .env and add your API key
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 4. Run the Application

```bash
python app.py
```

The application will be available at `http://localhost:5000`

## Usage

1. **Search**: Enter a city name in the navigation search bar
2. **Click "Search"** or press Enter to get comprehensive weather data
3. **View Full Weather Dashboard** including:

   ### 🏠 **Hero Section - Current Weather**
   - Large city name and current date
   - Main temperature with large weather icon
   - "Feels like" temperature and weather description

   ### 📊 **Details Grid**
   - Humidity, wind speed, pressure
   - Visibility, sunrise, and sunset times
   - Interactive cards with hover effects

   ### 📈 **5-Day Forecast**
   - Daily weather predictions
   - High/low temperatures for each day
   - Weather icons and descriptions
   - Organized in responsive grid layout

   ### ⏰ **Hourly Forecast**
   - Next 24 hours broken down by hour
   - Temperature and weather icons for each hour
   - Horizontal scrollable layout

### 💾 **Smart Memory System**

- **Auto-Load**: Returns to your last successful search automatically
- **Visual Feedback**: Blue indicator shows when loading saved search
- **Easy Clear**: Red "✕" button to clear saved search
- **Intelligent**: Only saves successful searches, ignores failed attempts

## Technical Details

### Backend (Flask)

- **Dual API Integration**: Combines OpenWeatherMap Current Weather + 5-day Forecast APIs
- **Smart Data Processing**: Groups forecast data into daily and hourly predictions
- **Secure Proxy Design**: Backend acts as secure proxy, hiding API keys from frontend
- **Comprehensive Error Handling**: Graceful handling of network issues and invalid cities
- **RESTful JSON API**: Enhanced `/get_weather` endpoint with current + forecast data

### Frontend (Vanilla JavaScript)

- **Modern ES6+ JavaScript**: async/await, fetch API, template literals, and destructuring
- **Dynamic Content Generation**: Programmatically creates forecast cards and hourly displays
- **Advanced Animations**: Staggered animations, smooth transitions, and interactive hover effects
- **Responsive Grid Layouts**: CSS Grid and Flexbox for optimal layout on all devices
- **Smart State Management**: Handles current weather, forecasts, and user preferences

### API Integration & Data Processing

- **OpenWeatherMap Current Weather API**: Real-time weather conditions
- **OpenWeatherMap 5-day Forecast API**: Extended weather predictions with 3-hour intervals
- **Intelligent Data Aggregation**: Groups hourly data into meaningful daily forecasts
- **Coordinate-based Forecasting**: Uses lat/lon from current weather for accurate forecasts
- **Multiple Icon Sizes**: Optimized weather icons for different UI sections

## Security Considerations

- API key is stored securely in environment variables
- Backend acts as a proxy to prevent API key exposure to frontend
- Input validation and sanitization
- Error handling without exposing sensitive information

## Browser Compatibility

- Modern browsers supporting ES6+ features
- Responsive design works on desktop, tablet, and mobile devices

## Development Notes

- Flask runs in debug mode for development
- Static files are served through Flask's static file handling
- CSS uses modern features like CSS Grid and Flexbox
- JavaScript follows modern best practices with proper error handling