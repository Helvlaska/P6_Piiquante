const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Voilà la réponse du serveur !');
});
/*nom de la fonction = const précé.methode(fonction anonyme(arguments,arguments)=>{
    ce que la fonction doit faire
}) */
server.listen(process.env.PORT || 3000);