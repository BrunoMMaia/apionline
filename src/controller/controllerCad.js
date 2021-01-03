var formidable = require('formidable');
const fsextra   = require('fs-extra')
const fs   = require('fs');
var ObjectId = require('mongodb').ObjectId;

module.exports = () => {
    const controller = {};
    var collectionpessoa;
    const repository = require('../repository/repository')('Pessoas');

    //Conexão com o banco ++
    /*  var uri = "mongodb://User_AppFit:admin123@cluster0-shard-00-00.pngc6.mongodb.net:27017,cluster0-shard-00-01.pngc6.mongodb.net:27017,cluster0-shard-00-02.pngc6.mongodb.net:27017/AppFit?ssl=true&replicaSet=atlas-rle8wn-shard-0&authSource=admin&retryWrites=true&w=majority";
    MongoClient.connect(uri, function(err, client) {
        if (err){
            console.log(err)
        } else {
            console.log('conectou mongo')
            const db = client.db('AppFit')
            collectionpessoa =  db.collection('pessoa')
        }
    }); 
    ////conexão com o banco --
    */

    controller.gravarPessoa = (req, res, next) => {
        const pessoajson = req.body
        repository.collection().insertOne(pessoajson, (err,result) =>{
            if (err){
                console.log(err)
            } else {
                console.log('ok')
            }
        })
        res.status(200).send()
    };

    controller.listarPessoa = (req, res) => {

        console.log('pesquisando aqui')
        repository.collection().find().toArray((err, pessoas) =>{
            res.status(200).json(pessoas); 
        })
    }

    controller.alterarPessoa = (req, res, next) => {
       //console.log('teste:' + req.body.idpedido)
       const pessoa = req.body

       var id = pessoa._id;
       delete pessoa._id;

       repository.collection().updateOne({_id: require("mongojs").ObjectId(id)}, {$set: pessoa}, (err,item ) => {
            console.log(err)
       })
        res.status(200).send();
    };
    
    controller.excluirPessoa = (req, res, next) => {
       // console.log("Chegou aqui")
       // const idpessoa = req.body        
       // var id = idpessoa._id;
        console.log("idpessoa " + req.body._id)

        repository.collection().deleteOne({ _id: require("mongojs").ObjectId(req.body._id)}, (err, item) => {
            console.log(err)
        })

        res.status(200).send();
    }
    return controller;
}
