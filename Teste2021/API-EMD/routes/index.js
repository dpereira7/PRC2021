const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();
var gdb =require('../utils/graphdb')

/* GET home page. */
router.get('/api/emd', async function(req, res, next) {
  if(req.query.res){
    var myquery = `select ?s ?n ?d where {
      ?s a :EMD;
         :realizadoPor ?n;
         :data ?d;
         :resultado "True".
      }`
    var result = await gdb.execQuery(myquery);
    var dados = result.results.bindings.map(c => {
      return {
        id: c.s.value.split("#")[1],
        nome: c.n.value,
        data: c.d.value
      }
    })
    res.jsonp(dados);
  }else{
  var myquery = `select ?s ?n ?d ?r where {
    ?s a :EMD;
       :realizadoPor ?n;
       :data ?d;
       :resultado ?r.
    }`
  var result = await gdb.execQuery(myquery);
  var dados = result.results.bindings.map(c => {
    return {
      id: c.s.value.split("#")[1],
      nome: c.n.value,
      data: c.d.value,
      resultado: c.r.value
    }
  })
  res.jsonp(dados);
}
});


router.get('/api/emd/:id', async function(req, res, next) {
  id = req.params.id
  var myquery = `select ?d ?r ?p where {
    :`+ id + ` a :EMD;
       :data ?d;
       :realizadoPor ?p;
       :resultado ?r.
    }`
  var result = await gdb.execQuery(myquery);

  var dados = {
    id: req.params.id,
    data: result.results.bindings[0].d.value,
    realizadoPor: result.results.bindings[0].p.value,
    resultado: result.results[0].r.value
  }
  res.jsonp(dados);
});


router.get('/api/modalidades', async function(req, res, next) {
  var myquery = `select distinct ?s where {
    ?s a :Modalidade .
    }`
  var result = await gdb.execQuery(myquery);
  var dados = result.results.bindings.map(c => {
    return {
      modalidade: c.s.value
    } 
  })
  res.jsonp(dados);
});


router.get('/api/modalidades/:id', async function(req, res, next) {
  var myquery = `select ?s ?p where {
      ?s a :EMD.
      ?s :realizadoPor ?p
      ?p :pratica :${req.params.id}.
    }`
  var result = await gdb.execQuery(myquery);
  var dados = {
    modalidade: req.params.id,
    emd: result.results.bindings[0].e.value
  }
  res.jsonp(dados);
});



router.get('/api/atletas?gen=F', async function(req, res, next) {
  if(req.query.gen){
    var myquery = `select ?s where {
      ?s a :Atleta;
        :genero "F". 
      }Order By desc (:Atleta)`
    var result = await gdb.execQuery(myquery);
    var dados = result.results.bindings.map(c => {
      return {
        atleta: c.s.value
      } 
    })
    res.jsonp(dados);
  }else{
    var myquery = `select ?s ?c where {
      ?s a :Atleta;
        :clube ?c. 
      }Order By desc (:Atleta)`
    var result = await gdb.execQuery(myquery);
    var dados = result.results.bindings.map(c => {
      return {
        atleta: c.s.value
      } 
    })
    res.jsonp(dados);
  }
});

module.exports = router;
