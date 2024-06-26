import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Verbum API',
    description: 'List of APIs for Verbum App',
  },
  host: 'localhost:5000'
};

const outputFile = './swagger.json';
const routes = ['./index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc).then(async () => {
    await import('./index.js'); // Your project's root file
  });