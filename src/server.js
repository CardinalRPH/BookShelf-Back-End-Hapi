/* eslint-disable no-console */
/* eslint-disable import/extensions */
import Hapi from '@hapi/hapi';
import router from './router/router.js';

const server = Hapi.server({
  port: 9000,
  host: 'localhost',
  routes: {
    cors: {
      origin: ['*'],
    },
  },
});
server.route(router);
server.start().then(() => {
  console.log(`Server running on ${server.info.uri}`);
}).catch((error) => {
  console.log(`Error starting server: ${error}`);
});
