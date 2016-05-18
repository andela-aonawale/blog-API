'use strict';

import Serializer from './index';

Serializer.register('articles', {
  id: 'id',
  blacklist: ['authorId'],
  links: {
    self: (data) =>{
      return `/articles/${data.id}`;
    }
  },
  relationships: {
    author: {
      type: 'authors'
    },
    comments: {
      type: 'comments'
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
    self: '/articles'
  }
});