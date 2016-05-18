'use strict';

import Serializer from './index';

Serializer.register('authors', {
  id: 'id',
  blacklist: [],
  links: {
    self: (data) =>{
      return `/authors/${data.id}`;
    }
  },
  relationships: {
    articles: {
      type: 'articles'
    }
  },
  topLevelMeta: {
    count: (options) => {
      return options ? options.count : 0;
    },
    total: (options) => {
      return options ? options.total : 0;
    },
    total_pages: (options) => {
      return options ? Math.ceil(options.total / options.perPage) : 0;
    }
  },
  topLevelLinks: {
    self: '/authors'
  }
});