<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News API</title>
</head>
<body>
    <li id='news_list'>

    </li>
    <script src="https://code.jquery.com/jquery-3.6.3.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>
    <script>
        //const axios = require("axios");
        const apikey = "f1feb67da7ea461a8e75a7906a6c2230";

        //All articles mentioning Apple from yesterday, sorted by popular publishers first
        //https://newsapi.org/v2/everything?q=apple&from=2023-02-02&to=2023-02-02&sortBy=popularity&apiKey=${apikey}

        //All articles about Tesla from the last month, sorted by recent first
        //https://newsapi.org/v2/everything?q=tesla&from=2023-01-03&sortBy=publishedAt&apiKey=${apikey}

        //Top business headlines in the US right now
        //https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apikey}

        //Top headlines from TechCrunch right now
        //https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${apikey}

        //All articles published by the Wall Street Journal in the last 6 months, sorted by recent first
        //https://newsapi.org/v2/everything?domains=bbc.com&apiKey=${apikey}

        //https://newsapi.org/v2/everything?q=economy&language=eng&apiKey=${apikey}

        let url = `https://newsapi.org/v2/everything?q="Samia Suluhu"&from=2023-01-03&language=en&sortBy=popularity&apiKey=${apikey}`;
        
        $(document).ready(function(){
            let n = 0;
            fetch(url).then((res)=>{ return res.json(); })
            .then((data)=>{
                let status=data.status;
                let totalResults=data.totalResults;
                let articles=data.articles;
                console.log(articles);
                data.articles.forEach(article => {
                    let li = document.createElement("li");
                    let a = document.createElement("a");
                    a.setAttribute("href", article.url);
                    a.setAttribute("target", "_blank");
                    a.textContent = `${n}: ${article.title}`;
                    li.appendChild(a);
                    $("#news_list").append(li);
                    n++;
                }); 
            })
        });

        /* function downloadImage(){
            const url="";
            const imagepath=path.resolve(_dirname,'images', 'output.png');
            const writer=fs.createWriteStream(imagePath);
            const response=await axios({
                url:url,
                method: 'GET',
                responseType: 'stream'
            });

            response.data.pipe(writer);

            return new Promise((resolve, reject)=> {
                writer.on('finish', resolve);
                writer.on('error', reject);
            })
        }

        downloadImage(); */
    </script>
</body>
</html>