//we will want to change this to suit our needs
//sequelize automatically adds an id : INT field (and createdAt, updatedAt)
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("User", {
    netid: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING, 
    isLeader: DataTypes.BOOLEAN,
    isChair: DataTypes.BOOLEAN,
    isAdmin: DataTypes.BOOLEAN,
    isOPO: DataTypes.BOOLEAN
  })
}