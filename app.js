import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();

const { apiKey, latitude, longitude } = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, 'utf8'));

go();

async function go() {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
  const data = await response.json();
  console.log(typeof data);
  console.log(data.daily[0]);
  // console.log(data);
  const { temp, weather } = data.daily[0];
  let { min, max } = temp;
  min = fahrenheit(min);
  max = fahrenheit(max);
  let { icon } = weather[0];
  icon = `https://openweathermap.org/img/wn/${icon}.png`;
  console.log(min, max, icon);
}

function fahrenheit(kelvin) {
  const celsius = kelvin - 273.15;
  return Math.round(celsius * (9 / 5) + 32);
}