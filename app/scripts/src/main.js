((DoC, Vue) => {
    
 Vue.component('card-table', {
  template: `
    <div class="card-table">\
      <pile currentCardSrc="https://deckofcardsapi.com/static/img/8C.png"></pile>
    </div>`,
  data: function() {
    return {
      'deck_id': false,
      'remaining': 0,
      'piles': {}
    };
  },
  methods: {
    drawCard: function() {

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