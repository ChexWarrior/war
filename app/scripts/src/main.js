((DoC, Vue) => {
    
 Vue.component('card-table', {
  template: `
    <div class="card-table">
      <span>Deck ID: {{ deck_id }} Cards Remaining: {{ remaining }}</span>
      <pile v-bind:currentCardSrc="drawnCardUrl"></pile>
      <button v-on:click="drawCard">Draw a Card</button>
    </div>`,
  beforeCreate: function() {
    DoC.createDeck({ shuffled: true }).then((response) => {
        this.deck_id = response.deck_id;
        this.remaining = response.remaining;
    });
  },
  data: function() {
    return {
      'deck_id': 'not set',
      'remaining': 0,
      'drawnCardUrl': 'https://deckofcardsapi.com/static/img/8C.png'
    };
  },
  methods: {
    drawCard: function() {
      DoC.drawFromDeck({
        deckID: this.deck_id,
        numCards: 1
      }).then((response) => {
        console.dir(response);
        this.drawnCardUrl = response.cards[0].image;
      });
    }
  }
 });

 Vue.component('pile', {
  template: `
    <div class="pile">
      <img v-bind:src="currentCardSrc"/>
    </div>`,
  props: ['currentCardSrc']
 });

 let app = new Vue({
  el: '#app'
 });

})(window.DoC, window.Vue);