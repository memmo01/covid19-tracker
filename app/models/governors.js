module.exports = function(sequelize,DataTypes){
  const Governors = sequelize.define("Governors",{
    state:DataTypes.STRING,
    name:DataTypes.STRING
  });

  return Governors;
};
