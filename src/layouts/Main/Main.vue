<script setup>
import { ref, onMounted } from 'vue';
import { getUserLocation } from '../../services/locationService.js';
import { fetchWeatherData } from '../../services/weatherService.js';

const weatherData = ref(null);
const errorMessage = ref('');

onMounted(async () => {
    try {
        const location = await getUserLocation();
        weatherData.value = await fetchWeatherData(location.lat, location.lon);
    } catch (error) {
        errorMessage.value = error;
        console.error(error);
    }
});

// Function: Organizing 5-day forecasts
function getDailyForecasts(list) {
    const dailyForecasts = [];
    const seenDates = new Set();

    for (const forecast of list) {
        const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        if (!seenDates.has(date)) {
            seenDates.add(date);
            dailyForecasts.push(forecast);
        }
        if (dailyForecasts.length === 5) break; // 5-day data
    }
    return dailyForecasts;
}
</script>

<template>
    <main class="w-94">
        <!-- Location message -->
        <div v-if="locationMessage"
            class="container flex flex-col items-center gap-6 font-normal bg-black/15 shadow-md rounded-3xl">
            {{ locationMessage }}
        </div>

        <!-- Show error message if there is one -->
        <div v-if="errorMessage"
            class="container flex flex-col items-center gap-6 font-normal bg-black/15 shadow-md rounded-3xl">
            {{ errorMessage }}
        </div>
        <!-- Show weather data if it exists -->
        <div v-else-if="weatherData" class="flex flex-col items-center gap-6">

            <!-- Current Weather -->
            <div class="container w-full flex flex-col items-center gap-3 bg-black/15 shadow-md rounded-3xl">
                <p class="text-3xl font-medium">{{ weatherData.city.name }}<span class="text-sm"> / {{
                    weatherData.city.country }}</span></p>
                <img :src="`http://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@4x.png`"
                    :alt="weatherData.list[0].weather[0].description" class="currentImg w-50">
                <p class="text-2xl font-semibold">{{ weatherData.list[0].main.temp }}°C</p>
                <p class="text-2xl font-normal capitalize">{{ weatherData.list[0].weather[0].description }}</p>

                <!-- Hourly Weather -->
                <div class="hourlyWeatherContainer max-w-83 flex flex-row gap-5 overflow-auto">
                    <div v-for="(forecast, index) in weatherData.list.slice(0, 8)" :key="index"
                        class="hourlyWeather min-w-38 text-lg bg-black/10 shadow-md flex flex-col items-center rounded-2xl">
                        <p class="font-semibold">{{ new Date(forecast.dt * 1000).toLocaleTimeString([], {
                            hour:
                                '2-digit', minute: '2-digit'
                        }) }}</p>
                        <img :src="`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`"
                            alt="weather-icon">
                        <p class="font-semibold">{{ forecast.main.temp }}°C</p>
                        <p class="font-normal capitalize text-center whitespace-nowrap">{{ forecast.weather[0].description }}</p>
                    </div>
                </div>
            </div>

            <!-- 5-Day Weather -->
            <div class="dailyWeatherContainer w-full flex flex-col gap-4 mt-6">
                <div v-for="(forecast, index) in getDailyForecasts(weatherData.list)" :key="index"
                    class="dailyWeather w-full bg-black/10 shadow-md flex items-center justify-between p-4 rounded-3xl">
                    <p class="days font-semibold w-28">{{ new Date(forecast.dt * 1000).toLocaleDateString('en-US', {
                        weekday: 'long'
                    }) }}</p>
                    <img :src="`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`" alt="weather-icon"
                        class="w-20">
                    <div class="text-center grow">
                        <p class="font-semibold">{{ forecast.main.temp }}°C</p>
                        <p class="font-normal capitalize">{{ forecast.weather[0].description }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Show if data is loading -->
        <div v-else class="container flex flex-col items-center gap-6 font-normal bg-black/15 shadow-md rounded-3xl">
            <p>Loading data...</p>
            <p>Make sure your device's location is enabled.</p>
        </div>
    </main>
</template>

<style scoped>
/* Due to issues with margins and paddings in Tailwind 4.0, they were manually defined using CSS. */
main {
    margin: 2.6rem auto;
}

.currentImg {
    margin: -2.5rem 0;
}

.container {
    padding: 1.4rem;
}

.hourlyWeatherContainer {
    padding: 1.4rem 0.25rem;
    margin-bottom: -1rem;
}

.hourlyWeather {
    padding: 1rem;
}

.dailyWeatherContainer {
    padding: 1rem 0;
}

.dailyWeather {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.days {
    margin-left: 2rem;
}
</style>