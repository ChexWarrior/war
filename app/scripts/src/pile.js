(function(Vue, DoC) {
  Vue.component('pile', {
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
    props: ['enabled', 'name', 'deckID'],
    methods: {
      drawCard: async function() {
        if(this.enabled) {
          const draw = await DoC.drawFromPile({ 
            deckID: this.deckID, 
            pileName: this.name
          });
          
          console.log(draw);
          this.drawnCardUrl = draw.cards[0].image;
          this.remaining = draw.piles[this.name].remaining;
          this.$emit('cardDrawn', {
            pile: this.name,
            card: draw.cards[0]
          });
        }
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
}(window.Vue, window.DoC));