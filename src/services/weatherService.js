import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const API_KEY = 'afdca070fd81c317260c232787b713fe';

// Function to get weather data based on latitude and longitude is being defined.
export const fetchWeatherData = async (lat, lon) => {
    try {
        const response = await axios.get(`${BASE_URL}forecast`, {
            params: {
                lat: lat,
                lon: lon,
                appid: API_KEY,
                units: 'metric',
                lang: 'en',
            },
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred while fetching the current weather data:', error);
        throw error;
    }
};