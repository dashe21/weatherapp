import os
import requests
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Get OpenWeatherMap API key from environment
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
OPENWEATHER_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/get_weather', methods=['POST'])
def get_weather():
    """
    Proxy endpoint to fetch weather data from OpenWeatherMap API
    """
    try:
        # Get city name from request
        data = request.get_json()
        city_name = data.get('city')
        
        if not city_name:
            return jsonify({'error': 'City name is required'}), 400
        
        if not OPENWEATHER_API_KEY:
            return jsonify({'error': 'API key not configured'}), 500
        
        # Prepare parameters for OpenWeatherMap API
        params = {
            'q': city_name,
            'appid': OPENWEATHER_API_KEY,
            'units': 'metric'  # Get temperature in Celsius
        }
        
        # Make request to OpenWeatherMap API for current weather
        current_response = requests.get(OPENWEATHER_BASE_URL, params=params)
        
        if current_response.status_code == 200:
            weather_data = current_response.json()
            
            # Get coordinates for forecast API
            lat = weather_data['coord']['lat']
            lon = weather_data['coord']['lon']
            
            # Make request for 5-day forecast
            forecast_params = {
                'lat': lat,
                'lon': lon,
                'appid': OPENWEATHER_API_KEY,
                'units': 'metric'
            }
            forecast_response = requests.get(OPENWEATHER_FORECAST_URL, params=forecast_params)
            
            # Extract current weather data
            current_weather = {
                'city': weather_data['name'],
                'country': weather_data['sys']['country'],
                'temperature': round(weather_data['main']['temp']),
                'description': weather_data['weather'][0]['description'].title(),
                'humidity': weather_data['main']['humidity'],
                'feels_like': round(weather_data['main']['feels_like']),
                'pressure': weather_data['main']['pressure'],
                'wind_speed': weather_data.get('wind', {}).get('speed', 0),
                'wind_direction': weather_data.get('wind', {}).get('deg', 0),
                'visibility': weather_data.get('visibility', 0) // 1000,  # Convert to km
                'weather_icon': weather_data['weather'][0]['icon'],
                'weather_main': weather_data['weather'][0]['main'],
                'sunrise': weather_data['sys']['sunrise'],
                'sunset': weather_data['sys']['sunset'],
                'timezone': weather_data['timezone']
            }
            
            result = {'current': current_weather}
            
            # Add forecast data if available
            if forecast_response.status_code == 200:
                forecast_data = forecast_response.json()
                
                # Process 5-day forecast (daily)
                daily_forecast = []
                hourly_forecast = []
                
                # Group forecast by days for daily forecast
                daily_temps = {}
                
                for item in forecast_data['list'][:40]:  # 5 days * 8 (3-hour intervals)
                    dt = item['dt']
                    date_str = str(item['dt_txt'].split(' ')[0])
                    hour = int(item['dt_txt'].split(' ')[1].split(':')[0])
                    
                    # Collect hourly data for next 24 hours (8 items)
                    if len(hourly_forecast) < 8:
                        hourly_forecast.append({
                            'time': item['dt_txt'],
                            'timestamp': dt,
                            'temperature': round(item['main']['temp']),
                            'description': item['weather'][0]['description'].title(),
                            'icon': item['weather'][0]['icon'],
                            'humidity': item['main']['humidity'],
                            'wind_speed': item.get('wind', {}).get('speed', 0)
                        })
                    
                    # Group by day for daily forecast
                    if date_str not in daily_temps:
                        daily_temps[date_str] = {
                            'temps': [],
                            'descriptions': [],
                            'icons': [],
                            'humidity': [],
                            'wind_speed': [],
                            'dt': dt
                        }
                    
                    daily_temps[date_str]['temps'].append(item['main']['temp'])
                    daily_temps[date_str]['descriptions'].append(item['weather'][0]['description'])
                    daily_temps[date_str]['icons'].append(item['weather'][0]['icon'])
                    daily_temps[date_str]['humidity'].append(item['main']['humidity'])
                    daily_temps[date_str]['wind_speed'].append(item.get('wind', {}).get('speed', 0))
                
                # Create daily forecast from grouped data
                for date_str, day_data in list(daily_temps.items())[:5]:  # Limit to 5 days
                    daily_forecast.append({
                        'date': date_str,
                        'timestamp': day_data['dt'],
                        'temp_max': round(max(day_data['temps'])),
                        'temp_min': round(min(day_data['temps'])),
                        'description': max(set(day_data['descriptions']), key=day_data['descriptions'].count).title(),
                        'icon': max(set(day_data['icons']), key=day_data['icons'].count),
                        'humidity': round(sum(day_data['humidity']) / len(day_data['humidity'])),
                        'wind_speed': round(sum(day_data['wind_speed']) / len(day_data['wind_speed']), 1)
                    })
                
                result['forecast'] = {
                    'daily': daily_forecast,
                    'hourly': hourly_forecast
                }
            
            return jsonify(result)
        elif current_response.status_code == 404:
            return jsonify({'error': 'City not found'}), 404
        else:
            return jsonify({'error': 'Failed to fetch weather data'}), 500
            
    except requests.RequestException:
        return jsonify({'error': 'Network error occurred'}), 500
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True)