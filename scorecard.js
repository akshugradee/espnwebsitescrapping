//const url='https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard';
const request=require('request');
const cheerio=require('cheerio');  
const xlsx=require('xlsx');
const path=require('path');
const fs=require('fs');
function processcorecard(url){
    request(url,cb); 
}
// request(url,cb); 
function cb(error,response,html){
    if(error){
        console.log("error 404 please");
    }
    else{
        // console.log(html);
        extractMatchdeatils(html);

    }
}
function extractMatchdeatils(html){
    //venue,date,opponent,result,runs,balls,fours,sixes,sr
    //player data must belong to particular team and then store 
    //venue -.header-info .description
    // result- .event .status-text
    
    let $=cheerio.load(html);
   let venudate= $('.header-info .description');
   let result=$('.event .status-text');
   let strArr=venudate.text().split(',');
   let venue=strArr[1].trim();
   let date=strArr[2].trim();
   result=result.text();
//    console.log(venue);
//    console.log(date);
//    console.log(result);
   


//segreate the page instead of inspect all the data

    let innings=$('.card.content-block.match-scorecard-table .Collapsible');
    let htmlstring='';
    for(let i=0;i<innings.length;i++){
        // let chtml=$(innings[i]).html();
        // html+=chtml; // to do this we get two innings html
        //team -.header-title.label
        let teamName=$(innings[i]).find('.header-title.label').text();
        teamName=teamName.split('INNINGS')[0].trim();
        let opponentindex=i==0?1:0;
       // console.log(opponentindex);
        let opponentTeam=$(innings[opponentindex]).find('.header-title.label').text();
        opponentTeam=opponentTeam.split('INNINGS')[0].trim();
        //console.log(opponentTeam);
        
        //console.log(teamName);
       // console.log(`venue ${venue} date ${date} teamName ${teamName} oppositon ${opponentTeam} result ${result}`);
    //console.log(html);
       //----done for single match------// 
       let allrows= $(innings[i]).find('.table.batsman tbody  tr');
       //console.log(allrows.text());
       for(let j=0;j<allrows.length;j++){
           let allcols=$(allrows[j]).find('td');
           let isworthy=$(allcols[0]).hasClass("batsman-cell");
           if(isworthy==true){
                //console.log(allcols.text());
                //player name,----nad rest
               let playerName= $(allcols[0]).text().trim();
               let runs= $(allcols[2]).text().trim();
               let balls= $(allcols[3]).text().trim();
               let fours= $(allcols[4]).text().trim();
               let sixes= $(allcols[5]).text().trim();
               let SR= $(allcols[6]).text().trim();
               console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${SR}`);
               //teams folder and player data
                //folder and file name
               processplayer=(teamName,playerName,runs,balls,fours,sixes,SR,opponentTeam,venue,date,result);
           }
       }
    }
    //console.log(`venue ${venue} date ${date} teamName ${teamName} oppositon ${opponentTeam} result ${result}`);
    //console.log(html);
}
function processplayer(teamName,playerName,runs,balls,fours,sixes,SR,opponentTeam,venue,date,result){
        let teampath=path.join(__dirname,"ipl",teamName);
        dircreator(teampath); //folder bna diya
        let filepath=path.join(teampath,playerName,".xlsx");
        let content=excelreador(filepath,playerName); //content read return empty array
        //empty array putting data
        let playerobj={
            teamName,
            playerName,runs,balls,sixes,fours,SR,venue,opponentTeam,date,result
        }
        content.psuh(playerobj);
        excelWriter(filepath,content,playerName);
}

module.exports={
    ps:processcorecard
}
function dircreator(filepath){
    if(fs.existsSync(filepath==false)){
         fs.mkdirSync(filepath);
     }
 
 }

 function excelWriter(filepath,json,sheetname){
     let newwb= xlsx.utils.book_new();
     let newws=xlsx.utils.json_to_sheet(json);
     xlsx.utils.book_append_sheet(newwb,newws,sheetname);
     xlsx.writeFile(newwb,filepath);
 }

 function excelreador(filepath,sheetname){
     if(fs.existsSync(filepath)==false){
         return [];
     }
     let wb=xlsx.readFile(filepath);
     let excelData=wb.sheets[sheetname];
     let ans=xlsx.utils.sheet_add_json(excelData);
     return ans;
 }