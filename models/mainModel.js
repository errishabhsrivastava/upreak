module.exports = function (sequelize, DataTypes) {

  var mainModel = {

    name: "mainModel", //must to define the name
    //custom queries
    execQuery: function (query, callback, type) {
      var typeOfQuery = sequelize.QueryTypes.RAW;
      if (type != undefined) {
        typeOfQuery = sequelize.QueryTypes[type];
      }

      sequelize.query(query, {
        type: sequelize.QueryTypes.RAW
      }).then(function (results, metadat) {

        callback(undefined, results[0]);
      })
        .catch(function (err) {
          var errorMsg = "error in query  : " + err.message;
          callback(errorMsg);
        });
    }
  
  };
  return mainModel;
};