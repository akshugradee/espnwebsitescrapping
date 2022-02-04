//webscraper project - that will scrap whole Ipl for us 
//we gona perform webscraping on espncricinfo.com from we fetch data of every
//match played in that year and store all the information about the teams and their player
// like( how many matches  played by the teams agains whom and what was the result and 
//menu as well and store them in excel file )


//ipl ka folder -> team k apne folder honge ->every player xcel file -> excel file outpu-> venue,date,opponent,
//balls,fours ,sixes,reuslts,strike rate (player perfromance)
// 3 pages --
//1- homepage-- link for next page (all matches)
//2,3-  all macthes result page - we will fetch url for all macthes played (details-)
 //check for ipl folder if not create then create team folder and then create file for players for particular team





//------task 1-----------//

// request  for the page to fetch data from espninfo website and get the link for scorecard for all matches //


const url='https://www.espncricinfo.com/series/ipl-2020-21-1210595';
const request=require('request');
const cheerio=require('cheerio');  // used to read the html file similar like (we do in css by css selector)
const allMatchobj=require('./Allmatch');
const fs = require('fs');
const path=require('path');
const xlsx=require('xlsx');


const iplpath=path.join(__dirname,"ipl") //making folder here
dircreator(iplpath);

//read the html here 
request(url,cb); 
function cb(error,response,html){
    if(error){
        console.log("error 404 please");
    }
    else{
        // console.log(html);
        extractlink(html);

    }

}
function extractlink(html){
    //read the html here 
    let $=cheerio.load(html);  //$ work link interface to work with other element easily
     let anchorele=$("a[data-hover='View All Results']");
     let link=anchorele.attr('href'); //return the value of attribue
    //  console.log(link);
    //----link of the page where we have scorecard for everymatch----//
    let fulllink='https://www.espncricinfo.com'+link;
    console.log(fulllink);
    allMatchobj.gAllmatch(fulllink);
     
}


// creating folder for ipl 
//  passsing file path 
function dircreator(filepath){
   if(fs.existsSync(filepath==false)){
        fs.mkdirSync(filepath);
    }

}