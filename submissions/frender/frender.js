// SETUP
var express = require("express");
var app = express();
app.get("/", (req,res) => {
  res.send("Consequences...")
});
app.listen(process.env.PORT || 5000);
var mongoose = require("mongoose");

//////////////// TODO ////////////////
//  Ping Heroku to keep app awake
var http = require("http");
setInterval( _ =>{
  http.get("https://frender.herokuapp.com/")
}, 600000); // 600000 = every 10 minutes

// Setup Twitter API
var Twitter = require("twitter");
var twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Stream filters by keywords
var options = {track: 'french career, french teach, frenchedhack'};

var search = "statuses/filter";

twitterClient.stream(search, options, (stream) => {
  console.log("streaming twitter feed");

  stream.on("data", (tweet) =>{
    console.log("+++++++++++++++");



    // Check if tweet text contains "french career teaching"
    if (tweet.text.includes("career")) {
      console.log(tweet.user.screen_name + ": " + tweet.text);

      replyCareer(tweet)

    }

    if (tweet.text.includes("teach")) {
      console.log(tweet.user.screen_name + ": " + tweet.text);

      replyTeach(tweet)

    }

    if (tweet.text.includes("frenchedhack")) {
      console.log(tweet.user.screen_name + ": " + tweet.text);

      replyFrenchEdHack(tweet)

    }


  })
});

function replyCareer(originalTweet){
  twitterClient.post("statuses/update/", {status: "@" + originalTweet.user.screen_name + ": We're looking for candidates in US French Immersion programs! Are you interested?? https://goo.gl/forms/lSDukJTlUd0UsLN92"}, function(err, response) {
    if (response) {
      console.log('reply career successful: ' + response);
    }
    // if there was an error while tweeting
    if (err) {
      console.log('Something went wrong:' + err);
    }
  });
}


function replyTeach(originalTweet){
  twitterClient.post("statuses/update/", {status: "@" + originalTweet.user.screen_name + ": We're looking for teachers in US French Immersion programs! Are you interested?? https://goo.gl/forms/lSDukJTlUd0UsLN92"}, function(err, response) {
    if (response) {
      console.log('reply teach successful: ' + response);
    }
    // if there was an error while tweeting
    if (err) {
      console.log('Something went wrong:' + err);
    }
  });
}


function replyFrenchEdHack(originalTweet){
  twitterClient.post("statuses/update/", {status: "@" + originalTweet.user.screen_name + ": Thank you for coming to the 2017 French Ed Hack at @GA with the @franceintheus!"}, function(err, response) {
    if (response) {
      console.log('reply french ed hack successful: ' + response);
    }
    // if there was an error while tweeting
    if (err) {
      console.log('Something went wrong:' + err);
    }
  });
}


function testTweet(){
  twitterClient.post("statuses/update/", {status: "We're looking for teachers in US French Immersion programs! Are you interested?? https://goo.gl/forms/lSDukJTlUd0UsLN92"}, function(err, response) {
    if (response) {
      console.log('test successful: ' + JSON.stringify(response));
    }
    // if there was an error while tweeting
    if (err) {
      console.log('Something went wrong:' + err);
    }
  });
}