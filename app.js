import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

const __dirname = path.resolve();

const { apiKey, latitude, longitude } = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, 'utf8'));

go();

async function go() {
  const data = await get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`, 'json');
  const { temp, weather } = data.daily[0];
  let { min, max } = temp;
  min = fahrenheit(min);
  max = fahrenheit(max);
  let { icon } = weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
  const iconImage = await Jimp.read(iconUrl);
  await iconImage.resize(32, 32);
  const image = await new Jimp(64, 32, 'black');
  image.blit(iconImage, 32, 0);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
  await image.print(font, 0, 0, max);
  await image.print(font, 0, image.bitmap.height - 16, min);
  await image.write('weather.png');
}

function fahrenheit(kelvin) {
  const celsius = kelvin - 273.15;
  return Math.round(celsius * (9 / 5) + 32);
}

async function get(url, type) {
  const response = await fetch(url);
  return response[type]();
}