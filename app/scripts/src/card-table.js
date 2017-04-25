(function(Vue, DoC) {
  Vue.component('card-table', {
    template: `
      <div class="card-table">
        <button class="start-button" 
                v-on:click="startGame"
                v-if="disabled">Click to Start</button>
        <div v-bind:class="disabled ? 'game-suspended' : ''">
          <span>Deck ID: {{ deckID }}</span>
          <pile v-bind:enabled="piles.get('pile1').enabled"
                v-bind:deckID="deckID"
                v-on:drawn="startMatch"
                name="pile1"></pile>
          <br/>
          <pile v-bind:enabled="piles.get('pile2').enabled"
                v-bind:deckID="deckID"
                v-on:drawn="startMatch"
                name="pile2"></pile>
        </div>
      </div>`,
    beforeCreate: async function() {
      const deck = await DoC.createDeck({ shuffle: true });
      this.deckID = deck.deck_id;
      this.disabled = deck.success;
    },
    data: function() {
      return {
        'disabled': true,
        'deckID': null,
        'piles': new Map([
          ['pile1', { enabled: false }],
          ['pile2', { enabled: false }]
        ])
      };
    },
    methods: {
      startGame: function() {
        this.disabled = false;
        this.createDrawPiles({
          deckID: this.deckID,
          pilesToCreate: this.piles,
          numCards: 26
        });
      },
      translateValue: function(value) {
        switch(value) {
          case 'ACE':
            return 14;
          break;
          case 'KING':
            return 13;
          break;
          case 'QUEEN':
            return 12;
          break;
          case 'JACK':
            return 11;
          break;
          default:
            return parseInt(value, 10);
        }
      },
      startMatch: function(event) {
        //TODO handling of cards after match
        //TODO handle tie
        console.log('Event Received!', event);
        if(event.pile == 'pile1') {
          this.pile1Card = this.translateValue(event.value);
          this.pile1Enabled = false;
        } else if(event.pile == 'pile2') {
          this.pile2Card = this.translateValue(event.value);
          this.pile2Enabled = false;
        }

        if(this.pile1Card && this.pile2Card) {
          this.pile1Enabled = true;
          this.pile2Enabled = true;
          console.log('Both piles have drawn a card!');
          if(this.pile1Card > this.pile2Card) {
            console.log('Player 1 wins!');
            this.pile1Card = false;
            this.pile2Card = false;
          } else if (this.pile2Card > this.pile1Card) {
            console.log('Player 2 wins!');
            this.pile1Card = false;
            this.pile2Card = false;
          } else {
            console.log('Tie!');
            this.pile1Card = false;
            this.pile2Card = false;
          }
        } else {
          console.log('Both piles have not drawn a card!');
        }
      },
      createDrawPiles: async function(parameters) {
        for(let name  of parameters.pilesToCreate.keys()) {

          let deck = await DoC.drawFromDeck({
            deckID: parameters.deckID,
            numCards: parameters.numCards
          });

          let newPile = await DoC.addToPile({
            pileName: name,
            cardsToAdd: deck.cards,
            deckID: parameters.deckID
          });

          // to ensure vue actually tracks this change we need
          // to assign this.piles to a new map...
          let temp = new Map();
          for(let [key, value] of this.piles) {
            temp.set(key, value);
          }

          temp.set(name, {
            enabled: newPile.success
          });

          this.piles = temp;
        }
      }
    }
  });
}(window.Vue, window.DoC));