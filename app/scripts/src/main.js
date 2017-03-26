((DoC, Vue) => {

 Vue.component('card-table', {
  template: `
    <div class="card-table">
      <button class="start-button" 
              v-on:click="startGame"
              v-if="disabled">Click to Start</button>
      <div v-bind:class="disabled ? 'game-suspended' : ''">
        <span>Deck ID: {{ deck_id }}</span>
        <span>Cards Remaining: {{ remaining }}</span>
        <draw-pile v-bind:cards="drawPile1Cards"
                   name="drawPile1"
                   v-bind:deckID="deck_id"></draw-pile>
        <br/>
        <draw-pile v-bind:cards="drawPile2Cards"
                   name="drawPile2"
                   v-bind:deckID="deck_id"></draw-pile>
      </div>
    </div>`,
  beforeCreate: function() {
    DoC.createDeck({ shuffle: true }).then((response) => {
      this.deck_id = response.deck_id;
      this.remaining = response.remaining;
      this.disabled = response.success;
    })
  },
  data: function() {
    return {
      'disabled': true,
      'deck_id': 'not set',
      'remaining': 0,
      'drawPile1Cards': {},
      'drawPile2Cards': {}
    };
  },
  methods: {
    startGame: function() {
      this.disabled = false;
      this.createDrawPiles({
        deckID: this.deck_id,
        pileName1: 'drawPile1',
        pileName2: 'drawPile2',
        numCards: 26
      });
    },
    createDrawPiles: function(parameters) {
      let drawnCards = [];
      DoC.drawFromDeck({
        deckID: parameters.deckID,
        numCards: parameters.numCards
      }).then((response) => {
        drawnCards = response.cards;
        this.remaining = response.remaining;
        return DoC.addToPile({
          pileName: parameters.pileName1,
          cardsToAdd: drawnCards,
          deckID: parameters.deckID
        });
      }).then((response) => {
        this.drawPile1Cards = drawnCards;
        return DoC.drawFromDeck({
          deckID: parameters.deckID,
          numCards: parameters.numCards
        });
      }).then((response) => {
        drawnCards = response.cards;
        this.remaining = response.remaining;
        return DoC.addToPile({
          pileName: parameters.pileName2,
          cardsToAdd: drawnCards,
          deckID: parameters.deckID
        });
      }).then((response) => {
        this.drawPile2Cards = drawnCards;
      });
    }
  }
 });

 Vue.component('draw-pile', {
  template: `
    <div>
      <span>Pile Name: {{ name }}</span>
      <span>Cards Remaining: {{ remaining }}</span>
      <div v-on:click="drawCard" class="pile"></div>
      <div class="current-card">
        <img v-bind:src="drawnCardUrl"/>
      </div>
    </div>
  `,
  props: ['cards', 'name', 'deckID'],
  computed: {
    remaining: function() {
      return this.cards.length;
    }
  },
  methods: {
    drawCard: function() {
      DoC.drawFromPile({
        deckID: this.deckID,
        pileName: this.name
      }).then((response) => {
        console.log(response);
        this.drawnCardUrl = response.cards[0].image;
      });
    }
  },
  data: function() {
    return {
      drawnCardUrl: '',
    };
  }
 });

 let app = new Vue({
  el: '#app'
 });

})(window.DoC, window.Vue);
