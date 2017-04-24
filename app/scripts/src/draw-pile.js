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