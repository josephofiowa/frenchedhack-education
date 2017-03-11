// SETUP
var express = require("express");
var app = express();
app.get('/', function(req, res) {
		res.send('Bot is happily running.');
});
app.listen(process.env.PORT || 5000);
var Twitter = require("twitter");
// var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');
// var alchemy_language = new AlchemyLanguageV1({
// 		api_key: process.env.WATSON_AL_API_KEY
// })
var mongoose = require('mongoose');
// END SETUP


// Ping Heroku ap to keep awake
var http = require("http");
setInterval(function() {
		http.get("http://whatsappling.herokuapp.com");
}, 600000); // every 10 minutes (600000)
// ^^^


var client = new Twitter({
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// var uri = 'mongodb://eddiepavdatabase:itweetaboutapples123@ds047166.mlab.com:47166/eddiepavtweet';
// mongoose.connect(uri);
// var db = mongoose.connection;
var Schema = mongoose.Schema;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(callback){

		console.log('db up');

		Create schema for our data
		var TweetSchema = new Schema({
				"text": String,
				"truncated": Boolean,
				"in_reply_to_user_id": String,
				"in_reply_to_status_id": String,
				"favorited": Boolean,
				"source": String,
				"in_reply_to_screen_name": String,
				"in_reply_to_status_id_str": String,
				"id_str": String,
				"entities": {
						"user_mentions": [
								{
										"indices": Array,
										"screen_name": String,
										"id_str": String,
										"name": String,
										"id": Number
								}
						],
						"urls": Array,
						"hashtags": Array
				},
				"retweeted": Boolean,
				"in_reply_to_user_id_str": String,
				"place": {
						"attributes":{},
						"bounding_box":
						{
								"coordinates":
										[
												Number,
												Number
										],
								"type":String
						},
						"country":String,
						"country_code":String,
						"full_name":String,
						"id":String,
						"name":String,
						"place_type":String,
						"url": String
				},
				"retweet_count": Number,
				"created_at": String,
				"user": {
						"statuses_count": Number,
						"followers_count": Number,
						"profile_image_url": String,
						"listed_count": Number,
						"profile_background_image_url": String,
						"description": String,
						"screen_name": String,
						"default_profile": Boolean,
						"verified": Boolean,
						"time_zone": String,
						"profile_text_color": String,
						"is_translator": Boolean,
						"location": String,
						"id_str": String,
						"default_profile_image": Boolean,
						"lang": String,
						"friends_count": Number,
						"protected": Boolean,
						"favourites_count": Number,
						"created_at": String,
						"name": String,
						"show_all_inline_media": Boolean,
						"follow_request_sent": Boolean,
						"geo_enabled": Boolean,
						"url": String,
						"id": Number,
						"contributors_enabled": Boolean,
						"following": Boolean,
						"utc_offset": Number
				},
				"id": Number,
				"coordinates": {
						"coordinates":
								[
										Number,
										Number
								],
						"type":String
				},
				"sentimentTYPE": String,
				"sentimentSCORE": String,
				"eddieDidReply": Boolean
		});

		Use schema to register a model with MongoDb
		mongoose.model('Tweet', TweetSchema);
		var Tweet = mongoose.model('Tweet');




		// // TODO: UNCOMMENT BEFORE PUSHING TO HEROKU
		// // TWITTER API CALLS
		// // Stream filters by keyword and OG tweets
		client.stream('statuses/filter', {track: 'onlyatgw'}, function(stream) {
				console.log('streaming twitter');

				stream.on('data',function(tweet) {


            var gwTweet = new Tweet(tweet);

            console.log('got a tweet');
            console.log(gwTweet.user.screen_name + ': ' + tweet.text);

            // Retweet
            reTweet(gwTweet, function(err){
                if (err) throw err;

                        replyTweet(gwTweet, function(){
                            if (err) throw err;
                        });
                    });

            });

				});

				stream.on('error', function(error) {
						console.log('there is an error');
						console.log(error);
				});
		});

// });


function reTweet(originalTweet, callback) {
		client.post('statuses/retweet/' + originalTweet.id_str, function(error, tweet, response) {
				console.log('retweeting');
				if (!error)	{
						console.log('retweeting: ' + tweet.user.screen_name + ': '+ tweet.text);
						return callback(error);
				}
				return callback(null);
		});
};

function replyTweet(originalTweet, callback) {
		client.post('statuses/update/', {status: '@'+originalTweet.user.screen_name + ' feeling French about something?'}, function(error, tweet, response) {
				console.log('replying');
				if (!error) {
						console.log(tweet.text);
						return callback(error);
				}
				return callback(null);
		})
}
