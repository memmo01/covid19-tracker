
const db = require("../models");

//get information from about state governors from database.
module.exports =  {
  getGovernor:function(state){
    console.log(state);
    return db.Governors.findAll({where:{
      state:state
    }});
  }
};
