# LED Weather

Generates a tiny 64x32 image of today's weather forecast as a PNG file, for use on
a pixel display. Uses the openweathermap API and the jimp library.

You'll need to create a `config.json` file with `latitude`, `longitude` and `apiKey` properties. The `apiKey` must be an api key registered with openweathermap.

When you run the application `weather.png` is updated in the same folder.
