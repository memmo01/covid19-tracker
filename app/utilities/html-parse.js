const cheerio = require("cheerio");
let splitGov = [];

//get information from the governors website and get the governors state and name.
module.exports = function (siteData,state,cb) {
  let $ = cheerio.load(siteData.data);
  let cleanArr=[];
  let num;
  $(".current-governors__item__link").each(function () {
    let siteText = $(this).text();
   

    splitGov.push(siteText.trim().split("\n"));
    cleanArr = splitGov.map((item,index) => {
      let newArr = [];
      item.forEach((indi) => {
        newArr.push(indi.trim());
        if(indi.trim().toLowerCase() ===state.toLowerCase()){
          num=index;
        }
        
      });
      return newArr;
    });
     
  });
  cb(cleanArr[num]);
};