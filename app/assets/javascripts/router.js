'use strict';

import Backbone from 'backbone';
import EntriesIndexView from './views/entries/index';
import EntriesCollection from './collections/entries';

class AppRouter extends Backbone.Router {

  routes = {
    '': 'index',
    'entries/:id': 'show'
  }

  initialize() {
    this.collection = new EntriesCollection();
    this.collection.fetch();
  }

  index() {
    let view = new EntriesIndexView(collection: this.collection);
    document.body.appendChild(view.render().el);
  }

  show(id) {
    window.alert(`Entry show action for id ${id}`);
  }

}

export default AppRouter;
