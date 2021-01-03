const express = require('express')
const cors   = require('cors'); 
var jwt = require('jsonwebtoken');

const app = express()
app.use(express.json());
app.use(cors())

const repositoryUsuario = require('./src/repository/repository')('Pessoas');
const repositoryPermissoes = require('./src/repository/repository')('Permissoes');

//// login ++++++++++++++++++++++++++++++
//Login Autenticação com token 
app.post('/login', (req, res)=>{
    repositoryUsuario.collection().findOne({nome:req.body.nome}, function(err,pessoa){  
console.log(' :' + req.body)


        if(pessoa.senha === req.body.pwd){
            const id          = pessoa._id;
            const user        = pessoa.nome;
            const userperfil  = pessoa.perfil;

            console.log(id)
            console.log(user)
            console.log(userperfil)
            repositoryPermissoes.collection().find({perfil:userperfil}).toArray((err, permissoes) => {
            var arrayPermissoes = [];
            permissoes.map(function(key){
                arrayPermissoes.push(key.permissao);
            });

            console.log(arrayPermissoes);
                
            //repositoryPermissoes.collection().find().toArray((err, permissoes) => {
            //    var arrayPermissoes = [];
            //    permissoes.map(function(key){
            //        arrayPermissoes.push(key.permissao);
            //    });

                var token = jwt.sign({id, user, permissoes : arrayPermissoes}, 'loginappcontrolefin',{
                    expiresIn: 1200 // expira em 5 minutos 
                });
                return res.json({auth: true, token: token});
            })
        } else {
            res.status(403).json({message: 'login invalido'});
        }
    });
})

//validação token
function verifyJWT(req, res, next){
    var token = req.headers['x-access-token'];
    console.log(token);
    if (!token) return res.status(401),json({ auth: false, message:'Token invalido'})
        console.log('Conseguiu token valido');
    jwt.verify(token, 'loginappcontrolefin', function(err,decoded) {
        if (err){ 
            return res.status(500).json({auth: false, message:'falha na autenticação do token'});
        }

        var a = decoded.permissoes.indexOf("LISTAR_USUARIOS");

        if (a===-1){
            return res.status(500).json({auth: false, message:'Usuario sem acesso'});
        } else {
            console.log('encontrou')
        }

        /*
        if (decoded.permissoes.indexOf("CRUD_PEDIDOS", 0)===0){
            return res.status(500).json({auth: false, message:'falha na autenticação. Usario sem permissão.'});
        };*/ 

        //Tudo ok, salva para uso posterior
        
        req.userId = decoded.id;
        next();
    })
}

const cadastro = require('./src/routes/routeCad');
const { json } = require('express');

app.use('/cadastro', verifyJWT, cadastro)
//badrequest

app.use((error, req, res, next)=>{
    res.status(error.httpStatusCode).json(error.message)
})

//app.listen(80)
app.listen(8080);