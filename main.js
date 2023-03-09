const axios = require('axios');
const fs = require('fs');
const request = require('request');
//const db=require('./db'); 
const twt=require('./tweet_activities.js'); 
const apikey = "f1feb67da7ea461a8e75a7906a6c2230";

//generate todays date
var todaysDate=new Date();
let currDate=Date.parse(`${todaysDate.getFullYear()}-${Number(todaysDate.getMonth())+1}-${todaysDate.getDate()}`);
let url = `https://newsapi.org/v2/everything?q="Samia Suluhu"&from=${currDate}&language=en&sortBy=popularity&apiKey=${apikey}`;
const cron = require('node-cron');



var getNews=async()=>{
    console.log("This function should run once in 24hrs");
    try {
        axios.get(url)
        .then(function (response) {
            let i=0;
            response.data.articles.forEach(article => {
                if(article.urlToImage != null){
                    let imgName=article.urlToImage.split("/");
                    let img=`${imgName.pop().split(".")[0]}.png`;
                    download(article.urlToImage,img, function(){
                        let author=article.author,title=article.title, description=article.description,
                        url=article.url, publishedAt=article.publishedAt, content=article.content;
                        twt.runpost(img, `${author}: ${description} \n \n Read more on: ${url}`);
                        // db.con.query(`INSERT INTO news_api(author, title, description, url, urlToImage, publishedAt, content) VALUES (?,?,?,?,?,?,?)`,
                        // [`${article.author}`, article.title, article.description,article.url, img, article.publishedAt, article.content], 
                        // function (err, result) {
                        //     if (err) throw err;
                        //     if(article.author==null){author='Unknown:';}
                        //     if(description.length>200){ description=description.substring(0, 280)+"..."; }
                        //     twt.runpost(img, `${author}: ${description} \n \n Read more on: ${url}`);
                        // });
                    });
                }
                i++;
            });
        })
        .catch(function (error) {console.log(`This is the error here: ${error}`); });
    } 
    catch(error){console.log("Error found!");}
}

var download = function(uri, filename, callback){
    try{
        request.head(uri, function(err, res, body){
            /* console.log('content-type:', res.headers['content-type']); console.log('content-length:', res.headers['content-length']); console.log() */
            request(uri).pipe(fs.createWriteStream(`images/${filename}`)).on('close', callback);
        });
    }
    catch(e){console.log("Error caught an error!");}
}

getNews();

setInterval(getNews, 1000 * 60 * 60 * 24);




