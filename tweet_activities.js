process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
const needle = require('needle');
const twit = require('twit');
const ApiKey ="4i2vY9gwWFHerxxR4oxxvGz85";
const ApiSecret = "YsQibuE2qu5xQ2yRKIIViz1CnB5H4bpcDmnP0Q9xDaX1qOZGSv";
const AccessToken = "1520461661177618434-fo96RZeErOfWnFc1f1ZOCdR6ZdSWJO";
const AccessTokenSecret = "INihimdElgN3V77lGsUTfc7rAwC6Hd1fNfw6WNBpL93lQ";
const BareToken = "AAAAAAAAAAAAAAAAAAAAAGOJlgEAAAAAzH0RJgE6JRcil6pYvZNTWv8CAoY%3DjOPHm3xJOHtniQ30zk5MEszu8ZTcKysKvIZFe3DF5MkAFecKiv";
const keyword=["intaneti","tcra","nape nnauye"];
const fs = require("fs");

/* 
  SamiaAbroad, sokomoko360@gmail.com
  BOT NAME: SamiaAbroad
  password: #Ushindi@1234 
  const ApiKey ="4i2vY9gwWFHerxxR4oxxvGz85";
  const ApiSecret = "YsQibuE2qu5xQ2yRKIIViz1CnB5H4bpcDmnP0Q9xDaX1qOZGSv";
  const AccessToken = "1520461661177618434-fo96RZeErOfWnFc1f1ZOCdR6ZdSWJO";
  const AccessSecret = "INihimdElgN3V77lGsUTfc7rAwC6Hd1fNfw6WNBpL93lQ";
  const BareToken = "AAAAAAAAAAAAAAAAAAAAAGOJlgEAAAAAzH0RJgE6JRcil6pYvZNTWv8CAoY%3DjOPHm3xJOHtniQ30zk5MEszu8ZTcKysKvIZFe3DF5MkAFecKiv";
*/

const T = new twit({
    consumer_key:ApiKey, consumer_secret:ApiSecret,
    access_token:AccessToken, access_token_secret:AccessTokenSecret,
    timeout_ms:60*1000, strictSSL:true,
})

const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL ='https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id,in_reply_to_user_id,referenced_tweets.id';

//test function
function firstPost(){
    T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
        console.log(data)
    });
}


//run the test function 
function runpost(img, title){
  console.log("the function is being fired!",img, title);
  try{
    var b64content = fs.readFileSync(img, { encoding: 'base64' });
    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      var mediaIdStr = data.media_id_string
      var altText = title
      var meta_params = {media_id: mediaIdStr, alt_text: { text: altText }}
      
      T.post('media/metadata/create', meta_params, function (err, data, response) {
        if(err) throw err;
        // now we can reference the media and post a tweet (media will attach to the tweet)
        var params = { status: `${title}`, media_ids: [mediaIdStr] }
        T.post('statuses/update', params, function (err, data, response) { console.log(data); });
      });
      
    });
  }
  catch(e){console.log(`The error is: ${e}`);}
}

// Get stream rules
async function getRules() {
  const response = await needle('get', rulesURL, { headers: {Authorization: `Bearer ${BareToken}`,},})
  return response.body;
}

// Set stream rules
async function setRules() {
  const data = { add: [{value: "intaneti" },{value: "tcra" },{value: "nape nnauye"}],}
  const response = await needle('post', rulesURL, data, { headers: {'content-type': 'application/json', Authorization: `Bearer ${BareToken}`,},});
  return response.body;
}

//retweet the content
var retweet=(tweet_id)=>{
  let T = new twit({consumer_key:ApiKey,consumer_secret:ApiSecret,access_token:AccessToken,access_token_secret:AccessSecret});
  T.post('statuses/retweet/:id', { id: tweet_id }, function(error, data, response){ if(error){console.log(`Error from retweet ${error}`, data, response);} });
}

// Delete stream rules
async function deleteRules(previusrule) {
  if (!Array.isArray(previusrule.data)) {return null}
  const ids = previusrule.data.map((rule) => rule.id);
  const data = {delete: {ids: ids,},}
  const response = await needle('post', rulesURL, data, {headers: {'content-type': 'application/json',Authorization: `Bearer ${BareToken}`,},});
  return response.body;
}

function streamTweets() {
    const stream = needle.get(streamURL, {headers: {Authorization: `Bearer ${BareToken}`,},})
    stream.on('data', (data) => {
        try {
            if(data){
                const json = JSON.parse(data);
                console.log(json);
                let isRt= json.data.text.substring(0,2).toString()=="RT";
                let isReply= "in_reply_to_user_id" in json.data;
                //retweet only tweets, not replies or retweets
                if(!isReply && !isRt){
                    for(let i =0; i<keyword.length; i++){
                        //check if the string contain keyword match in our array 
                        if(json.data.text.toLowerCase().includes(keyword[i].toLowerCase())){retweet(json.data.id);}
                    }
                }
            }
        } 
        catch (error){console.log(`Error from streaming, function ${error}`);}
    });
    return stream;
}


var initialize_rules= async ()=>{
    let currentRules;
    try {
        //Get all stream rules
        currentRules = await getRules();

        // Delete all stream rules
        await deleteRules(currentRules);

        // Set rules based on array above
        await setRules();

        //then call the stream function
        streamTweets();
    } 
    catch(error){console.log(`Error from initialization ${error}`);}
}


module.exports={initialize_rules,runpost,firstPost}