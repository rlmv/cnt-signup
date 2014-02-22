//sequelize automatically adds an id : INT field (and createdAt, updatedAt)
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Trip", {
    startTime: {
    	type: DataTypes.DATE,
    	allowNull: false, //change to false later. we really want this info
    	validate: {
    		isDate: true
    		//consider adding functionality to check today's date and make sure entered date is later
    		//using isAfter: 
    		//you'd have to use the custom validator functionality
            //theoretically the browser script performs this particular validation as well
    	}
    },
    endTime: {
    	type: DataTypes.DATE,
    	allowNull: false, //change to false later. we really want this info
    	validate: {
    		isDate: true
    	}
    },
    costNonDOC: {
    	type: DataTypes.INTEGER,
    	defaultValue: 0,
    	validate: {
    		min: 0
    	}
    },
    costDOC: {
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
