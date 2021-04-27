export default class Carousel {
  constructor(options) {
    const settings = {
      cardWidth: 200,
      cardGutter: 10,
      cardHeight: 240,
      imgHeight: 100,
      icon: 'tungsten',
      ...options
    };

    this.icon = settings.icon;
    this.title = settings.title;
    this.subtitle = settings.subtitle;
    this.containerSelector = settings.container;
    this.fetchCards = settings.fetchCards;

    this.cardWidth = settings.cardWidth;
    this.cardGutter = settings.cardGutter;
    this.cardHeight = settings.cardHeight;
    this.imgHeight = settings.imgHeight;

    this.stepSize = this.cardWidth + this.cardGutter * 2;
    this.chunkSize = 6;
    this.scrollPosition = 0;
    this.init();
  }

  init() {
    const carouselTemplate = (title, subtitle) => `
      <div class="header">
        <div>
          <div class="icon">
            <span class="material-icons">${this.icon}</span>
          </div>
        </div>
        <div>
          <h2 class="title">
            ${title} <span class="material-icons">chevron_right</span>
          </h2>
          <p class="subtitle">
            ${subtitle}
          </p>
        </div>
      </div>
      <div class="cards-container" style="height: ${this.cardHeight + 20}px">
        <div class="cards-scroll">
        </div>
        <a class="previous hidden" href="javascript:;" title="Previous cards" style="height: ${this.cardHeight + 16}px">
          <span class="material-icons">chevron_left</span>
        </a>
        <a class="next hidden" href="javascript:;" title="Next cards" style="height: ${this.cardHeight + 16}px">
          <span class="material-icons">chevron_right</span>
        </a>
      </div>
    `;

    // put corousel into the DOM
    this.carouselContainer = document.querySelector(`#${this.containerSelector}`);
    this.carouselContainer.classList.add('carousel');
    this.carouselContainer.innerHTML = carouselTemplate(this.title, this.subtitle);

    // set elements 
    this.cardsScrollContainer = document.querySelector(`#${this.containerSelector} .cards-container`);
    this.cardsScroll = document.querySelector(`#${this.containerSelector} .cards-scroll`);
    this.controlPrevious = document.querySelector(`#${this.containerSelector} .previous`);
    this.controlNext = document.querySelector(`#${this.containerSelector} .next`);

    // set listeners
    this.carouselContainer.addEventListener('mouseenter', () => this.showControls());
    this.carouselContainer.addEventListener('mouseleave', () => this.hideControls());
    this.controlPrevious.addEventListener('click', () => this.scrollPrevious());
    this.controlNext.addEventListener('click', () => this.scrollNext());

    // add first cards chunck
    this.appendCards(this.chunkSize);
  };


  showControls() {
    this.scrollPosition < 0
      ? this.showControlPrevious(true)
      : this.showControlPrevious(false);
    //  Hide control Next
    //  this.scrollPosition > this.cardsScrollContainer.offsetWidth - this.cardsScroll.offsetWidth
    //   ? this.showControlNext(true)
    //   : this.showControlNext(false)
    this.showControlNext(true);
  }


  hideControls() {
    this.showControlPrevious(false);
    this.showControlNext(false);
  }


  showControlPrevious(status) {
    status === true
      ? this.controlPrevious.classList.remove('hidden')
      : this.controlPrevious.classList.add('hidden');
  }


  showControlNext(status) {
    status === true
      ? this.controlNext.classList.remove('hidden')
      : this.controlNext.classList.add('hidden');
  }


  scrollPrevious() {
    const offsetLeft = this.cardsScroll.offsetLeft;
    if (offsetLeft + this.stepSize > 0) {
      this.scrollPosition = 0
    } else {
      this.scrollPosition = this.cardsScroll.offsetLeft + this.stepSize
    }
    this.cardsScroll.style.left = `${this.scrollPosition}px`;
    this.showControls();
  }


  scrollNext() {
    const offsetRight = this.cardsScroll.offsetWidth - this.cardsScrollContainer.offsetWidth + this.cardsScroll.offsetLeft;
    if (offsetRight - this.stepSize < 0) {
      this.appendCards();
    }
    this.scrollPosition = this.cardsScroll.offsetLeft - this.stepSize;
    this.cardsScroll.style.left = `${this.scrollPosition}px`;
    this.showControls();
  }


  showLoader(status) {
    if (status === true) {
      // loader template
      const placeholderCardTemplate = `
      <div class="card loader" style="width: ${this.cardWidth}px; height:${this.cardHeight}px; margin: 0 ${this.cardGutter}px;">
        <div class="img placeholder" style="height: ${this.imgHeight}px">
        </div>
        <div class="caption" style="height: ${this.cardHeight - this.imgHeight}px;">
          <div class="placeholder" style="width:100%"></div>
          <div class="placeholder" style="width:40%"></div>
          <div class="placeholder" style="width:80%"></div>
        </div>
      </div>
    `;
      let loader = '';
      for (let i = 0; i < this.chunkSize; i++) {
        loader += placeholderCardTemplate
      }
      // append loader
      this.cardsScroll.innerHTML += loader;
    } else if (status === false) {
      document.querySelectorAll(`#${this.containerSelector} .card.loader`).forEach(element => element.remove());
    }
  }


  appendCards(cardsNum) {
    // card template
    const cardTemplate = (card) => `
    <div>
      <div class="card" style="width: ${this.cardWidth}px; height:${this.cardHeight}px; margin: 0 ${this.cardGutter}px;">
        <div class="img" style="height: ${this.imgHeight}px; background-image: url('${card.image}');">
          <div class="type">${typesMap[card.type]}</div>
          <div class="duration">${toReadableDuration(card.duration)}</div>
        </div>
        <div class="caption" style="height: ${this.cardHeight - this.imgHeight}px;">
          ${card.title}
        </div>
      </div>
      ${card.cardinality === 'collection'
        ? `
          <div class="collection" style="margin: -5px ${this.cardGutter}px;">
            <div class="sublayer level1">
            </div>
            <div class="sublayer level2">
            </div>
          </div>
        `
        : ''}
      </div>
    `;

    // HELPERS
    // map content type label
    const typesMap = {
      'video': 'VIDEO',
      'elearning': 'ELEARNING',
      'learning_plan': 'LEARNING PLAN',
      'playlist': 'PLAYLIST',
    }
    // transforms duration (seconds) into human readable time string
    const toReadableDuration = (duration) => {
      const hours = Math
        .floor(duration / 3600).toString()
      const minutes = Math
        .floor((duration % 3600) / 60)
        .toString();
      const seconds = (duration % 60).toString()
        .padStart(2, '0');
      if (duration >= 3600) {
        return `${hours}h ${minutes}min`
      }
      return `${minutes}:${seconds}`
    }

    // append loader
    this.showLoader(true);

    // append cards
    this.fetchCards(cardsNum)
      .then(resolve => {
        // remove loader
        this.showLoader(false);
        // append loaded cards
        const newCards = resolve.reduce((acc, curr) => {
          return acc + cardTemplate(curr)
        }, this.cardsScroll.innerHTML);
        this.cardsScroll.innerHTML = newCards;
      });
  }
}