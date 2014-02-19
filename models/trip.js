//sequelize automatically adds an id : INT field (and createdAt, updatedAt)
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Trip", {
    start_time: {
    	type: DataTypes.DATE,
    	allowNull: true, //change to false later. we really want this info
    	validate: {
    		isDate: true
    		//consider adding functionality to check today's date and make sure entered date is later
    		//using isAfter: 
    		//you'd have to use the custom validator functionality
    	}
    },
    end_time: {
    	type: DataTypes.DATE,
    	allowNull: true, //change to false later. we really want this info
    	validate: {
    		isDate: true
    	}
    },
    cost_nonDOC: {
    	type: DataTypes.INTEGER,
    	defaultValue: 0,
    	validate: {
    		min: 0
    	}
    },
    cost_DOC: {
    	type: DataTypes.INTEGER,
    	defaultValue: 0,
    	validate: {
    		min: 0
    	}
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT
  })
}