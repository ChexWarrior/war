((DoC, Vue) => {

 Vue.component('card-table', {
  template: `
    <div class="card-table">
      <span>Deck ID: {{ deck_id }}</span>
      <span>Cards Remaining: {{ remaining }}</span>
      <button v-on:click="startGame">Click to Start</button>
      <draw-pile v-bind:cards="drawPile1Cards" id="drawPile1"></draw-pile>
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
      'drawnCardUrl': ''
    };
  },
  methods: {
    drawCard: function() {
      DoC.drawFromDeck({
        deckID: this.deck_id,
        numCards: 1
      }).then((response) => {
        console.log(response);
        this.drawnCardUrl = response.cards[0].image;
        this.remaining = response.remaining;
      });
    }
  }
 });

 Vue.component('pile', {
  template: `
    <div v-bind:class="currentCardSrc ? 'pile' : 'pile pile-empty'"
         v-on:click="draw">
      <img v-bind:src="currentCardSrc" />
    </div>`,
  props: ['currentCardSrc'],
  methods: {
    draw: function() {
      console.log('Draw card!');
      this.$emit('draw');
    }
  }
 });

 let app = new Vue({
  el: '#app'
 });

})(window.DoC, window.Vue);
