//sequelize automatically adds an id : INT field (and createdAt, updatedAt)
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Signup", {
 	dietary_restrictions: DataTypes.STRING,
 	comments: DataTypes.TEXT
  })
}
