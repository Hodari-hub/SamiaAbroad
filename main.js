const axios = require('axios');
const fs = require('fs');
const request = require('request');
const twt=require('./tweet_activities.js'); 
const apikey = "f1feb67da7ea461a8e75a7906a6c2230";
const randomFile = require('select-random-file');

//generate todays date
var todaysDate=new Date();
let currDate=Date.parse(`${todaysDate.getFullYear()}-${Number(todaysDate.getMonth())+1}-${todaysDate.getDate()}`);
let url = `https://newsapi.org/v2/everything?q="Samia Suluhu"&from=${currDate}&language=en&sortBy=popularity&apiKey=${apikey}`;
const cron = require('node-cron');

var getNews=async()=>{
    try {
        axios.get(url)
        .then(function (response) {
            let i=0;
            response.data.articles.forEach(article => {
                let dscrpt,caption, source, author=article.author;
                let title=article.title, description=article.description;
                let url=article.url, remaining_char=Number(200 - Number(title.length));
                let substrdescription=description.substring(0,remaining_char);

                //decide if you need to substring the description
                if(description.length > remaining_char){dscrpt=substrdescription+"...";}else{dscrpt=description;}

                //prepare author
                if(url.length > 77){source=`Source: ${author}`;}else{ source=`more on: ${url}`; }
                caption = `${title} \n\n ${dscrpt} \n\n ${source}`;

                if(article.urlToImage != null){ randomFile('./gallery/', (err, selected_file) => { twt.runpost(`./gallery/${selected_file}`, caption);});}
                else{ randomFile('./gallery/', (err, selected_file) => { twt.runpost(`./gallery/${selected_file}`, caption); });}

                i++;
            });
        })
        .catch(function (error) {console.log(`This is the error here: ${error}`); });
    } 
    catch(error){console.log("Error found!");}
}

//download file from the online
// var download = function(uri, filename, callback){
//     try{
//         request.head(uri, function(err, res, body){
//             /* console.log('content-type:', res.headers['content-type']); console.log('content-length:', res.headers['content-length']); console.log() */
//             request(uri).pipe(fs.createWriteStream(`images/${filename}`)).on('close', callback);
//         });
//     }
//     catch(e){console.log("Error caught an error!");}
// }

getNews();

setInterval(getNews, 1000 * 60 * 60 * 24);




