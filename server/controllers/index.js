'use strict';

import {read} from './posts';

export default function (router) {
  router.get('/posts', read);
}