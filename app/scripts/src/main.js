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
        <draw-pile v-bind:cards="drawPile1Cards" id="drawPile1"></draw-pile>
      </div>
    </div>`,
  beforeCreate: function() {
    DoC.createDeck({ shuffled: true }).then((response) => {
      this.deck_id = response.deck_id;
      this.remaining = response.remaining;
      this.disabled = response.success;
    });
  },
  data: function() {
    return {
      'disabled': true,
      'deck_id': 'not set',
      'remaining': 0,
      'drawnCardUrl': '',
      'drawPile1Cards': {}
    };
  },
  methods: {
    startGame: function() {
      this.disabled = false;
      this.createPile({
        deckID: this.deck_id,
        pileName: 'drawPile1',
        numCards: 26
      });
    },
    createPile: function(parameters) {
      let drawnCards = [];
      DoC.drawFromDeck({
        deckID: parameters.deckID,
        numCards: parameters.numCards
      }).then((response) => {
        drawnCards = response.cards;
        this.remaining = response.remaining;
        return DoC.addToPile({
          pileName: parameters.pileName,
          cardsToAdd: drawnCards,
          deckID: parameters.deckID
        });
      }).then((response) => {
        this.drawPile1Cards = drawnCards;
      });
    }
  }
 });

 Vue.component('draw-pile', {
  template: `
    <div v-bind:class="drawnCard ? 'pile' : 'pile pile-empty'">
    </div>
  `,
  props: ['cards'],
  data: function() {
    return {
      drawnCard: false
    };
  }
 });

 let app = new Vue({
  el: '#app'
 });

})(window.DoC, window.Vue);
