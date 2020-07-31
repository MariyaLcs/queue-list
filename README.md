- express, body-parser (npm i express body-parser)
  body-parser extract the entire body portion of an incoming request stream and exposes it on req. body . The middleware was a part of Express. js earlier but now you have to install it separately. This body-parser module parses the JSON, buffer, string and URL encoded data submitted using HTTP POST request.

- EJS+express (npm i ejs)
  EJS is a simple templating language that lets you generate HTML markup with plain JavaScript.
  app.set("view engine", "ejs");

- for css
  app.use(express.static("public"));
