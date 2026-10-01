
# Weather Predictor

A weather website where you search for any city in the world and see its current weather and the next 24 hours, hour by hour. The page background changes with the weather: drifting clouds, sunlight, falling rain, or thunder and lightning.

## Features

- City search with live suggestions that show the city, state and country
- Current temperature, feels-like temperature, humidity and wind speed
- Hourly forecast for the next 24 hours, with a weather icon, temperature and rain chance for each hour
- Animated backgrounds for sunny, cloudy, rainy, stormy and night skies

## Built with

- HTML, CSS and JavaScript for the pages
- Node.js and Express for the backend
- [Open-Meteo](https://open-meteo.com/) for weather data and city search (no API key needed)

## How to run

1. Install [Node.js](https://nodejs.org/)
2. Download this project and open a terminal in its folder
3. Install the dependencies:
```
   npm install
```
4. Start the server:
```
   node server.js
```
5. Open http://localhost:3000 in your browser

On Windows you can also double-click `start.bat` to start the server.

## Project structure

```
server.js         Backend: city suggestions and weather data
public/
  index.html      Search page
  weather.html    Weather page
  style.css       Styles and sky backgrounds
  sky.js          Cloud, rain, sun and lightning effects
```