import Backbone from 'backbone';

class EntriesIndexView extends Backbone.View {
  template = `<div></div>`;

  initialize() {
    this.collection.on('reset', this.render, this);
  }

  render() {
    this.$el.html(this.template(entries: this.collection));
    return this;
  }
}

export default EntriesIndexView;