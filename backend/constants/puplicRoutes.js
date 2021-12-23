// list of the available endpoints that dose not need for auth token
module.exports = [
  {
    path: '/auth',
    methods: ['POST'],
  },
  {
    path: '/register',
    methods: ['POST'],
  },
  {
    path: '/flight',
    methods: ['GET'],
  },
  {
    path: '/search-flights',
    methods: ['POST'],
  },
  {
    path: '/place',
    methods: ['GET'],
  },
];
