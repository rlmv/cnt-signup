//sequelize automatically adds an id : INT field (and createdAt, updatedAt)
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Trip", {
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    cost_nonDOC: DataTypes.INTEGER,
    cost_DOC: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT
  })
}