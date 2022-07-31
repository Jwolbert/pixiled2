const fs = require('fs'), http = require('http');

const port = 2222;

console.log("Webserver listening on port: " + port)

http.createServer(function (req, res) {
    fs.readFile(__dirname + req.url, function (err,data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }).listen(port);