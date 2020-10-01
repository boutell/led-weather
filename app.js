const fs = require('fs');
const fetch = require('node-fetch');
const Jimp = require('jimp');
const createImage = require('util').promisify((w, h, callback) => {
  return new Jimp(w, h, callback);
});

(async () => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=40.030564&lon=-75.166984&appid=${process.env.OPENWEATHERMAP_API_KEY}');
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
      const image = await Jimp.read(iconBuffer);
      await image.resize(32, 32);
      const outputImage = await createImage(64, 32);
      outputImage.blit(image, 16, 0, 0, 0, 32, 32);
      outputImage.write(`${iconPath}.png`);
      const outputBuffer = Buffer.alloc(64 * 32 * 3);
      let i = 0;
      for (let y = 0; (y < 32); y++) {
        for (let x = 0; (x < 64); x++) {
          const p = outputImage.getPixelColor(x, y);
          const rgba = Jimp.intToRGBA(p);
          outputBuffer[i++] = rgba.r;
          outputBuffer[i++] = rgba.g;
          outputBuffer[i++] = rgba.b;
        }
      }
      fs.writeFileSync(iconPath, outputBuffer);
    }
    // fs.writeSync(1, fs.readFileSync(iconPath));
    await sleep(100);
  }
})().then(() => {}).catch(e => {
  console.error(e);
  process.exit(1);
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
