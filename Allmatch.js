// this is for urll 

const request=require('request');
const cheerio=require('cheerio');
const scorecardobj=require('./scorecard');
const scorecard = require('./scorecard');
//-- here we parse the  link for everymatch ----//
function getallmatcheslink(url){
    request(url,function(err,response,html){

    if(err){
        console.log(err);
    }
    else {
        extractAlllink(html);
    }


    })
}
//-- scorecardslinks for everymatch---//
function extractAlllink(html){
    let $= cheerio.load(html);
    let scorecardsEle=$("a[data-hover='Scorecard']");
    for(let i=0;i<scorecardsEle.length;i++){
     let link= $(scorecardsEle[i]).attr('href');
     // console.log(link);
     let fulllink="https://www.espncricinfo.com"+link;
     console.log(fulllink);
    scorecardobj.ps(fulllink);
 }
 
 
 }
 module.exports={
     gAllmatch:getallmatcheslink
 }