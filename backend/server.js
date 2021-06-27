//écoutes des requêtes HTTP 
const http = require('http');

//j'importer l'app
const app = require('./app');

//cette fonction me renvoie un porte valide
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//ajout d'un port de connection, je mets le port 3000 par défaut
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//cette fonction recherche les différences erreurs et les gère ensuite
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//je crée le serveur selon l'app 
const server = http.createServer(app);

//lance le serveur, afficeh sur la console, et gère les erreurs s'il y en a 
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//le serveur écooute sur le port défini plus haut 
server.listen(port);
