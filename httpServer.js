var http = require("http");
var fs = require("fs");
var path = require("path");

http.createServer(function (req, res) {
  // Check the URL of the current request
  if (req.url === "/") {
    fs.readFile(path.join(__dirname, "Home", "ServerPage.html"), function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  }

  if (req.url === "/login") {
    fs.readFile(path.join(__dirname, "Home", "Loginpage.html"), function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  }
}).listen(8881);


// https://www.geeksforgeeks.org/node-js-web-server/

// node .\httpServer.js