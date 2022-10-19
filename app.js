const fs = require('fs'), http = require('http');

const port = 2222;

console.log("Webserver listening on port: " + port)

const dir = ["dist", "assets", "index.html"]

http.createServer(function (req, res) {
    // if (!req.url.includes(dir[0]) && !req.url.includes(dir[1]) && !req.url.includes(dir[2])) {
    //   console.log(req.url);
    //   res.writeHead(404);
    //   res.end();
    //   return;
    // }
    fs.readFile(__dirname + req.url.split("?")[0], function (err,data) {
      if (err) {
        console.log(req.url);
        res.writeHead(404);
        res.end();
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }).listen(port);