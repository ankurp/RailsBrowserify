import { View } from 'backbone';
import _ from 'backbone/node_modules/underscore';

export default View.extend({
  el: 'main',

  template: _.template(`<div>Entries#Index</div>`),

  initialize() {

  },

  render() {
    this.$el.html(this.template());
    return this;
  }
});
