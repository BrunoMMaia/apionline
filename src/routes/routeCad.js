const cadastro = require('express').Router();
const controllercad = require('../controller/controllerCad')();

//+++ CRUD == pedido
cadastro.post('/', controllercad.gravarPessoa)
cadastro.put('/', controllercad.alterarPessoa)
cadastro.get('/', controllercad.listarPessoa)
cadastro.delete('/', controllercad.excluirPessoa)

//Funcionalidades
//cadastro.get('pesquisaCadastro/', controllercad.pesquisaPessoa)

module.exports = cadastro;