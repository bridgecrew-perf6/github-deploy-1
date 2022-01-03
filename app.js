var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var exec = require("child_process").exec;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.htm");
  console.log("get /");
});

app.get("/lillefar-com", function (req, res) {
  res.sendStatus(200);
  console.log("get /lillefar-com");
});

app.post("/lillefar-com", function (req, res) {
  //verify that the payload is a push from the correct repo
  //verify repository.name == 'wackcoon-device' or repository.full_name = 'DanielEgan/wackcoon-device'
  console.log(
    req.body.pusher.name + " just pushed to " + req.body.repository.name
  );

  console.log("pulling code from GitHub...");

  // reset any changes that have been made locally
  exec("git -C ~/sites/lillefar.com reset --hard", execCallback);

  // and ditch any files that have been added locally too
  exec("git -C ~/sites/lillefar.com clean -df", execCallback);

  // now pull down the latest
  exec("git -C ~/sites/lillefar.com pull -f", execCallback);

  // and npm install with --production
  /* exec('npm -C ~/sites/test.lillefar.com install --production', execCallback); */

  // and run tsc
  exec("tsc", execCallback);
});

app.listen(3030, function () {
  console.log("listening on port 3030");
});

function execCallback(err, stdout, stderr) {
  if (stdout) console.log(stdout);
  if (stderr) console.log(stderr);
}
