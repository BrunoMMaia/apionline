var MongoClient = require('mongodb').MongoClient;   

module.exports = (collectionstr) => {
   const repository = {};
   var collection;

   var uri = "mongodb://User_AppFinan:1234@cluster0-shard-00-00.xb4kp.mongodb.net:27017,cluster0-shard-00-01.xb4kp.mongodb.net:27017,cluster0-shard-00-02.xb4kp.mongodb.net:27017/ControleFinanceiro?ssl=true&replicaSet=atlas-shzc8k-shard-0&authSource=admin&retryWrites=true&w=majority";

   MongoClient.connect(uri, function (err, client) {

       if (err){
           console.log(err)
       }
       const  db = client.db('ControleFinanceiro')
       collection = db.collection(collectionstr)

    });

    repository.collection = () => {
        return collection;
    }

    return repository;
}