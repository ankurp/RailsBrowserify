'use strict';

import { Router } from 'backbone';
import EntriesIndexView from './views/entries/index';

export default Router.extend({

  routes: {
    '': 'index'
  },

  initialize() {
    // this.collection = new EntriesCollection();
    // this.collection.fetch();
  },

  index() {
    const view = new EntriesIndexView();
    view.render();
  }

});
