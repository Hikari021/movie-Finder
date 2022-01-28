require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");

const https = require("https");

const app = express();
app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

let searchOutput =[];

app.post("/",function(req,res){
const searchValue = req.body.search;
let url =`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${searchValue}&page=1&include_adult=false`;
https.get(url,function(response){
    console.log(response.statusCode);
    const data = []
    response.on("data",(d)=>{
      data.push(d);
    }).on('end',function(){
      const buffer = Buffer.concat(data);
      const info = JSON.parse(buffer.toString());
     for(var i=0;i<info.results.length;i++){
       const movieName = info.results[i].original_title;
       const moviePoster =`https://www.themoviedb.org/t/p/w220_and_h330_face/${info.results[i].poster_path}`;
       const movieDesc = info.results[i].overview;
       const releaseDate = info.results[i].release_date;
       const votes = info.results[i].vote_average;
       searchOutput.push({
         movieName:movieName,
         moviePoster:moviePoster,
         movieDesc:movieDesc,
         releaseDate:releaseDate,
         votes:votes
       });
     }

     res.render("movie",{searchOutput:searchOutput});
    });
  });
});
// api_key=91eb03d62371bd41172333c5628c3dc9;
app.get("/",function(req,res){
  res.render("home");
  searchOutput = [];
// })
});
app.get("/about",function(req,res){
  res.render("about");
})


app.listen(3000,()=>console.log("The server has started at port 3000"));
