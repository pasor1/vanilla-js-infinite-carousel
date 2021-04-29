# vanilla-js-infinite-carousel

A carousel coded in vanilla javascript. You can scroll the cards using the "previous" and "next" commands, or swiping (BETA) if on a touch device.
New cards are loaded dinamically when you scroll to the most right card.

There are 2 versions:

- branch [**main**](https://github.com/pasor1/vanilla-js-infinite-carousel/tree/main): uses [Parcel](https://parceljs.org/) as bundler to build the demo page web app.
- branch [**stand-alone**](https://github.com/pasor1/vanilla-js-infinite-carousel/tree/stand-alone): old school, uses [Gulp](https://gulpjs.com/) as task manager to build a stand-alone version of the carousel. In this branch you can find the ready for procuction script and style, check the folder `dist`.

## Demo

[**CAROUSEL DEMO PAGE**](https://pasor1.github.io/vanilla-js-infinite-carousel "Carousel Demo Page")

## Test & Build

You need [nodejs](https://nodejs.org/) and npm.

```js
npm install
```

**Test**

```js
npm run dev
```

Then go to [http://localhost:1234](http://localhost:1234)

**Build**

```
npm run build
```

Builded app is in `dist` folder.

## Usage

```html
<div id="my-carousel"></div>

<script>
  const data = [
    {
      image: "https://picsum.photos/seed/1/200/100",
      type: "video",
      duration: 76,
      title: "Welcome to effective time management",
      cardinality: "single",
    },
    {
      image: "https://picsum.photos/seed/2/200/100",
      type: "elearning",
      duration: 2520,
      title: "Choosing the best audio player software for your computer",
      cardinality: "single",
    },
    {
      image: "https://picsum.photos/seed/3/200/100",
      type: "learning_plan",
      duration: 4800,
      title: "The small change that creates massive results in your life",
      cardinality: "collection",
    },
    {
      image: "https://picsum.photos/seed/4/200/100",
      type: "playlist",
      duration: 4800,
      title: "Enhence your brand potential with giant advertising blimps",
      cardinality: "collection",
    },
    {
      image: "https://picsum.photos/seed/5/200/100",
      type: "elearning",
      duration: 3600,
      title: "How to get write better advertising copy...",
      cardinality: "single",
    },
    {
      image: "https://picsum.photos/seed/6/200/100",
      type: "elearning",
      duration: 3600,
      title: "title",
      cardinality: "single",
    },
  ];

  const options = {
    container: "my-carousel",
    title: "This is the title",
    subtitle: "This is the subtitle Lorem ipsum sit amet...",
    icon: "collections",
    cardWidth: 200,
    cardGutter: 10,
    cardHeight: 240,
    imgHeight: 100,
    fetchCards: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(data);
        }, 500);
      });
    },
  };

  const carousel = new Carousel(options);
</script>
```

#### Old school

in the head of your HTML file

```html
<link
  rel="stylesheet"
  type="text/css"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
<link rel="stylesheet" type="text/css" href="//css/carousel.min.css" />
<script type="text/javascript" src="//js/carousel.min.js" defer></script>
```

#### Using a bundler

```js
import Carousel from "./js/carousel.js";
import "./scss/carousel.scss";
```

Don't forget font icons

```html
<link
  rel="stylesheet"
  type="text/css"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
```

## Card structure

```js
{
  "image": "https://picsum.photos/seed/6/200/100", // image URL
  "type": "elearning", // content type. Allowed: video, elearning, learning_plan, playlist
  "duration": 3600, // content duration, in seconds
  "title": "title", // text in caption
  "cardinality": "single" // content single or multiple. Allowed: single, collection
}
```

## Options

| Option     | Type      | Default  | Description                                                                                                                                                                                                   |
| ---------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| container  | string    | carousel | The _id_ of the carousel container in the HTML markup                                                                                                                                                         |
| title      | string    |          | The title shown in the carousel header                                                                                                                                                                        |
| subtitle   | string    |          | The subtitle shown in the carousel header                                                                                                                                                                     |
| icon       | string    | tungsten | The icon shown in the carousel header, from [material icons](https://fonts.google.com/icons)                                                                                                                  |
| cardWidth  | int       | 200      | The width of a single card                                                                                                                                                                                    |
| cardHeight | int       | 240      | The height of a single card                                                                                                                                                                                   |
| cardGutter | int       | 10       | The Margin between cards (px)                                                                                                                                                                                 |
| imgHeight  | int       | 100      | The height of the image inside the card                                                                                                                                                                       |
| fetchCards | `promise` |          | **MANDATORY** - A function that return a promise containing carousel data content. In the eaxample is custome promise, but generally shoul be a response from a fetch that retrieves data from a remote JSON. |
