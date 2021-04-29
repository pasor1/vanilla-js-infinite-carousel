# vanilla-js-infinite-carousel

A carousel coded in vanilla javascript. You can scroll the cards using the "previous" and "next" commands, or swiping (BETA) if on a touch device.
New cards are loaded dinamically when you scroll at the most right card.

There are 2 version:

- branch `main`: uses [Parcel](https://parceljs.org/) as bundler to build the demo page web app.
- branch `stand-alone`: uses [Gulp](https://gulpjs.com/) as task manager to build a stand-alone version of the carousel. In this branch you can find the ready for procuction script and style, check the folder `dist`.

### Install

You need [nodejs](https://nodejs.org/) and npm.

`npm install`

### Test

`npm run dev`
Then go to [http://localhost:1234](http://localhost:1234)

### Build

`npm run dev`
Builded app is in the `dist` folder.
