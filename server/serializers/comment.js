'use strict';

import Serializer from './index';

Serializer.register('comments', {
  id: 'id',
  blacklist: ['articleId'],
  links: {
    self: (data) => {
      return `/comments/${data.id}`;
    }
  },
  relationships: {
    article: {
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
    self: '/comments'
  }
});