/** Class representing a carousel */

class Carousel {
  /**
   * set the carousel.
   * @param {Object} options - Carousel options.
   * @param {string} [options.title=] - Title shown in header.
   * @param {string} [options.subtitle=] - Subtitle shown in header.
   * @param {string} [options.icon=tungsten] - Icon shown in header, from material icons https://fonts.google.com/icons.
   * @param {!number} [options.cardWidth=200] - Card width (px).
   * @param {!number} [options.cardGutter=10] - Space between cards (px).
   * @param {!number} [options.cardHeight=240] - Card height (px).
   * @param {!number} [options.imgHeight=100] - Image inside card height (px)..
   * @param {!string} options.containerSelector - ID selector where render the carousel.
   * @callback options.fetchCards - function returning an object representing the carousel content (cards).
   * options.fetchCards
   */
  constructor(options) {
    const settings = {
      title: '',
      subtitle: '',
      icon: 'tungsten',
      cardWidth: 200,
      cardGutter: 10,
      cardHeight: 240,
      imgHeight: 100,
      ...options
    };

    this.containerSelector = settings.container;
    this.fetchCards = settings.fetchCards;
    this.icon = settings.icon;
    this.title = settings.title;
    this.subtitle = settings.subtitle;
    this.cardWidth = settings.cardWidth;
    this.cardGutter = settings.cardGutter;
    this.cardHeight = settings.cardHeight;
    this.imgHeight = settings.imgHeight;
    this.stepSize = this.cardWidth + this.cardGutter * 2;
    this.chunkSize = 6;
    this.scrollPosition = 0;
    this.init();
  }

  /**
   * Initialize the carousel and put it into the DOM.
   */
  init() {
    const carouselTemplate = () => `
      <div class="header">
        <div>
          <div class="icon">
            <span class="material-icons">${this.icon}</span>
          </div>
        </div>
        <div>
          <h2 class="title">
            ${this.title} <span class="material-icons">chevron_right</span>
          </h2>
          <p class="subtitle">
            ${this.subtitle}
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
    this.controlPrevious = document.querySelector(`#${this.containerSelector} .previous`);
    this.controlNext = document.querySelector(`#${this.containerSelector} .next`);
    this.cardsScrollContainer = document.querySelector(`#${this.containerSelector} .cards-container`);
    this.cardsScroll = document.querySelector(`#${this.containerSelector} .cards-scroll`);

    // set listeners
    this.carouselContainer.addEventListener('mouseenter', () => this.showControls());
    this.carouselContainer.addEventListener('mouseleave', () => this.hideControls());
    this.controlPrevious.addEventListener('mousedown', () => this.scrollPrevious());
    this.controlNext.addEventListener('mousedown', () => this.scrollNext());

    // add first cards chunck
    this.appendCards(this.chunkSize);
  };

  /**
   * Check controls (previous and next) visbility permissions and show it.
   */
  showControls() {
    this.scrollPosition < 0
      ? this.showControlPrevious(true)
      : this.showControlPrevious(false);
    //  Hide control Next
    this.scrollPosition > this.cardsScrollContainer.offsetWidth - this.cardsScroll.offsetWidth
      ? this.showControlNext(true)
      : this.showControlNext(false)
    // this.showControlNext(true);
  }

  /**
   * Hide both (previous and next) controls.
   */
  hideControls() {
    this.showControlPrevious(false);
    this.showControlNext(false);
  }

  /**
   * Show/Hide "previous" control.
   * @param {boolean} status
   */
  showControlPrevious(status) {
    status === true
      ? this.controlPrevious.classList.remove('hidden')
      : this.controlPrevious.classList.add('hidden');
  }

  /**
   * Show/Hide "next" control.
   * @param {boolean} status
   */
  showControlNext(status) {
    status === true
      ? this.controlNext.classList.remove('hidden')
      : this.controlNext.classList.add('hidden');
  }

  /**
   * scroll to the previous card (back).
   */
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

  /**
   * scroll to the next card (forward).
   */
  scrollNext() {
    const offsetRight = this.cardsScroll.offsetWidth - this.cardsScrollContainer.offsetWidth + this.cardsScroll.offsetLeft;
    if (offsetRight - this.stepSize < 0) {
      this.appendCards();
    }
    this.scrollPosition = this.cardsScroll.offsetLeft - this.stepSize;
    this.cardsScroll.style.left = `${this.scrollPosition}px`;
    this.showControls();
  }

  /**
   * Show/Hide cards loader when a new chunk is loading.
   * @param {boolean} status
   */
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

  /**
   * Append a new chunk of cards to the carousel.
   * @param {number} [cardsNum] - Number of cards to load by the fetchCards function
   */
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

    /**
     * helper - map the content type property to the output string.
     */
    const typesMap = {
      'video': 'VIDEO',
      'elearning': 'ELEARNING',
      'learning_plan': 'LEARNING PLAN',
      'playlist': 'PLAYLIST',
    }
    /**
     * helper - transforms duration property (seconds) into human readable time string.
     */
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
      .then(response => {
        // remove loader
        this.showLoader(false);
        // append loaded cards
        const newCards = response.reduce((acc, curr) => {
          return acc + cardTemplate(curr)
        }, this.cardsScroll.innerHTML);
        this.cardsScroll.innerHTML = newCards;
      });
  }
}