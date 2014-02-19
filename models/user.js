//we will want to change this to suit our needs
//sequelize automatically adds an id : INT field (and createdAt, updatedAt)
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("User", {
    netid: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING, 
    isLeader: { type: DataTypes.BOOLEAN, defaultValue: false },
    isChair: { type: DataTypes.BOOLEAN, defaultValue: false },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    isOPO: { type: DataTypes.BOOLEAN, defaultValue: false },
  })
}
