# Countdown

Lunar New Year countdown. Static HTML, CSS, and JavaScript — open the files in a browser, no build step required.

It counts down to Xuân Đinh Mùi (6 February 2027). After that time it shows “CHÚC MỪNG NĂM MỚI”.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

Then open `http://localhost:3000/`.

## Project layout

```
index.html          Countdown page
styles.css          Countdown styles
script.js           Countdown logic
assets/             Background images and favicon
```

The target date is set in `script.js` (`countDownDate`).