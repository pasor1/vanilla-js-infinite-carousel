import Carousel from './carousel.js';

import data1 from './data1.json';
import data2 from './data2.json';

const options1 = {
  container: 'my-carousel',
  title: 'Fresh and just uploaded content',
  subtitle: 'Lorem ipsum sit amet, adipiscing elit. Cras dapibus vulputate diam eu pretium.',
  fetchCards: (chunkSize) => {
    const itemLimit = chunkSize || Math.ceil(Math.random() * 6);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(data1.slice(0, itemLimit));
      }, 500);
    });
  }
}

const options2 = {
  container: 'my-carousel2',
  title: 'Other fresh and just uploaded content',
  subtitle: 'Lorem ipsum sit amet, adipiscing elit. Cras dapibus vulputate diam eu pretium.',
  icon: 'collections',
  cardWidth: 260,
  cardGutter: 10,
  cardHeight: 235,
  imgHeight: 235,
  fetchCards: (chunkSize) => {
    const itemLimit = chunkSize || Math.ceil(Math.random() * 6);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(data2.slice(0, itemLimit));
      }, 2500);
    });
  }
}

const carousel1 = new Carousel(options1);
const carousel2 = new Carousel(options2);

// console.log(carousel1);

