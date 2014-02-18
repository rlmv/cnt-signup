//we will want to change this to suit our needs

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("User", {
    username: DataTypes.STRING
  })
}