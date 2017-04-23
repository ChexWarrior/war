((DoC, Vue) => {

 Vue.component('card-table', {
  template: `
    <div class="card-table">
      <button class="start-button" 
              v-on:click="startGame"
              v-if="disabled">Click to Start</button>
      <div v-bind:class="disabled ? 'game-suspended' : ''">
        <span>Deck ID: {{ deckID }}</span>
        <span>Cards Remaining: {{ remaining }}</span>
        <draw-pile v-bind:isCreated="drawPile1Created"
                   v-bind:deckID="deckID"
                   v-on:drawn="startMatch"
                   name="drawPile1"></draw-pile>
        <br/>
        <draw-pile v-bind:isCreated="drawPile2Created"
                   v-bind:deckID="deckID"
                   v-on:drawn="startMatch"
                   name="drawPile2"></draw-pile>
      </div>
    </div>`,
  beforeCreate: async function() {
      const deck = await DoC.createDeck({ shuffle: true });
      this.deckID = deck.deck_id;
      this.remaining = deck.remaining;
      this.disabled = deck.success;
  },
  data: function() {
    return {
      'disabled': true,
      'deckID': 'not set',
      'remaining': 0,
      'drawPile1Created': false,
      'drawPile2Created': false
    };
  },
  methods: {
    startGame: function() {
      this.disabled = false;
      this.createDrawPiles({
        deckID: this.deckID,
        pileName1: 'drawPile1',
        pileName2: 'drawPile2',
        numCards: 26
      });
    },
    translateValue: function(value) {
      switch(value) {
        case 'KING':
          return 13;
        break;
        case 'QUEEN':
          return 12;
        break;
        case 'JACK':
          return 11;
        break;
        case 'ACE':
          return 14;
        break;
        default:
          return parseInt(value, 10);
      }
    },
    startMatch: function(event) {
      console.log('Event Received!', event);
      if(event.pile == 'drawPile1') {
        this.pile1Card = this.translateValue(event.value);
      } else if(event.pile == 'drawPile2') {
        this.pile2Card = this.translateValue(event.value);
      }

      if(this.pile1Card && this.pile2Card) {
        console.log('Both piles have drawn a card!');
        if(this.pile1Card > this.pile2Card) {
          console.log('Player 1 wins!');
        } else if (this.pile2Card > this.pile1Card) {
          console.log('Player 2 wins!');
        } else {
          console.log('Tie!');
        }
      } else {
        console.log('Both piles have not drawn a card!');
      }
    },
    createDrawPiles: async function(parameters) {
      let deck = await DoC.drawFromDeck({
        deckID: parameters.deckID,
        numCards: parameters.numCards
      });

      console.log(deck);
      this.remaining = deck.remaining;
      const pile1 = await DoC.addToPile({
        pileName: parameters.pileName1,
        cardsToAdd: deck.cards,
        deckID: parameters.deckID
      });

      console.log(pile1);
      this.drawPile1Created = pile1.success;
      deck = await DoC.drawFromDeck({
        deckID: parameters.deckID,
        numCards: parameters.numCards
      });

      console.log(deck);
      this.remaining = deck.remaining;
      const pile2 = await DoC.addToPile({
        pileName: parameters.pileName2,
        cardsToAdd: deck.cards,
        deckID: parameters.deckID
      });

      console.log(pile2);
      this.drawPile2Created = pile2.success;
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
  props: ['isCreated', 'name', 'deckID'],
  methods: {
    drawCard: async function() {
      const draw = await DoC.drawFromPile({ 
        deckID: this.deckID, 
        pileName: this.name
      });
      
      console.log(draw);
      this.drawnCardUrl = draw.cards[0].image;
      this.remaining = draw.piles[this.name].remaining;
      this.$emit('drawn', {
        pile: this.name,
        value: draw.cards[0].value
      });
    }
  },
  data: function() {
    return {
      drawnCardUrl: '',
      remaining: 0
    };
  }
 });

 let app = new Vue({
  el: '#app'
 });

})(window.DoC, window.Vue);
