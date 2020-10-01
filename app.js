const fs = require('fs');
const fetch = require('node-fetch');
const jimp = require('jimp');

(async () => {
  const response = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=40.030564&lon=-75.166984&appid=d7f7c5048c6be884aede27ec9cf8ce92');
  const data = await response.json();
  const hourly = data.hourly;
  const iconsPath = `${__dirname}/icons`;
  if (!fs.existsSync(iconsPath)) {
    fs.mkdirSync(iconsPath);
  }
  for (const hour of hourly) {
    const weather = hour.weather[0];
    const icon = weather.icon;
    const iconPath = `${iconsPath}/${icon}.rgb`;
    if (!fs.existsSync(iconPath)) {
      const response = await fetch(`http://openweathermap.org/img/wn/${icon}@2x.png`);
      const iconBuffer = await response.buffer();
      const image = await jimp.read(iconBuffer);
      await image.resize(32, 32);
      const outputBuffer = Buffer.alloc(32 * 32 * 3);
      let i = 0;
      for (let y = 0; (y < 32); y++) {
        for (let x = 0; (x < 32); x++) {
          const p = image.getPixelColor(x, y);
          const rgba = jimp.intToRGBA(p);
          outputBuffer[i++] = rgba.r;
          outputBuffer[i++] = rgba.g;
          outputBuffer[i++] = rgba.b;
        }
      }
      fs.writeFileSync(iconPath, outputBuffer);
    }
    fs.writeSync(1, fs.readFileSync(iconPath));
    await sleep(100);
  }
})().then(() => {}).catch(e => {
  console.error(e);
  process.exit(1);
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
