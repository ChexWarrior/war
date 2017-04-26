(function(Vue, DoC) {
  Vue.component('card-table', {
    template: `
      <div class="card-table">
        <button class="start-button" 
                v-on:click="startGame"
                v-if="disabled">Click to Start</button>
        <div v-bind:class="disabled ? 'game-suspended' : ''">
          <span>Deck ID: {{ deckID }}</span>
          <pile v-bind:enabled="piles['pile1'].enabled"
                v-bind:deckID="deckID"
                v-on:cardDrawn="startMatch"
                name="pile1"></pile>
          <br/>
          <pile v-bind:enabled="piles['pile2'].enabled"
                v-bind:deckID="deckID"
                v-on:cardDrawn="startMatch"
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
        'piles': {
          'pile1': {
            enabled: false
          },
          'pile2': {
            enabled: false
          }
        } 
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
        console.log('click tracked', event);

        // store drawn card for pile
        if(this.piles[event.pile]) {
          console.log(`${event.pile} drawn`);
          this.piles[event.pile].card = event.card;
          this.piles[event.pile].enabled = false;
        }

        // check that all piles have a card
        let allPilesHaveCards = false;
        for(let pile of Object.keys(this.piles)) {
          if(this.piles[pile].card) { 
            allPilesHaveCards = true;
          } else {
            allPilesHaveCards = false;
          }
        }

        // if all piles have drawn a card then perform match
        if(allPilesHaveCards) {
          console.log('all piles have drawn');
          let winners = this.determineWinner(this.piles);
          console.log('Winners', winners);
        }
      },
      determineWinner: function(piles) {
        let contenders = {};
        let winners = {};
        let current;
        for(let name of Object.keys(piles)) {
          current = piles[name];
          if(!Object.keys(contenders).length) {
            contenders[name] = current;
            winners[name] = current;
          } else {
            for(let pile of Object.keys(contenders)) {
              if(this.translateValue(current.card.value) > this.translateValue(contenders[pile].card.value)) {
                winners[pile] = false;
                winners[name] = current;
                contenders[name] = current;
              } else if(this.translateValue(current.card.value) === this.translateValue(contenders[pile].card.value)) {
                winners[name] = current;
                contenders[name] = current;
              }
            }
          }
        }

        return winners;
      },
      createDrawPiles: async function(parameters) {
        for(let name of Object.keys(parameters.pilesToCreate)) {
          console.log('pile to create', name);
          let deck = await DoC.drawFromDeck({
            deckID: parameters.deckID,
            numCards: parameters.numCards
          });

          let newPile = await DoC.addToPile({
            pileName: name,
            cardsToAdd: deck.cards,
            deckID: parameters.deckID
          });

          this.piles[name].enabled = newPile.success;
        }
      }
    }
  });
}(window.Vue, window.DoC));