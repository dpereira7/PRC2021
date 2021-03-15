var express = require('express');
var router = express.Router();
var axios = require('axios');

const prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX adv: <http://www.di.uminho.pt/prc2021/Advogacia#>
`

const uri = "http://www.di.uminho.pt/prc2021/"
const pre = "http://localhost:7710/repositorio/"

/* GET todos os repositórios. */
router.get('/', function(req, res, next) {
  axios.get("http://localhost:7200/rest/repositories")
    .then(dados =>{
      res.render('index', {reps: dados.data, prefixo: pre});
    })
    .catch(err =>{
      res.render('error', {error: err});
    })
});


/* GET de um repositório. */
router.get('/repositorio/:id', function(req, res, next) {
  var rep_id = req.params.id

  axios.get("http://localhost:7200/rest/repositories/" + req.params.id)
    .then(dados =>{
      var rep = dados.data;

      var getLink = "http://localhost:7200/repositories/" + req.params.id + "?query="
      var query = `SELECT ?s WHERE { ?s rdf:type owl:Class}`

      var encoded = encodeURIComponent(prefixes + query)

      axios.get(getLink + encoded)
        .then(dados => {
          classes = dados.data.results.bindings.map(bind => bind.s.value.split('#')[1]);
          res.render('repositorio', {rep: rep, prefixo: pre, classes: classes});   
        })
        .catch(err => {
          res.render('error', {error: err});
        });
    })
    .catch(err =>{
      res.render('error', {error: err});
    })
});


/* GET classe de um repositório. */
router.get('/repositorio/:id/classe/:classe', function(req, res, next) {

  var getLink = "http://localhost:7200/repositories/" + req.params.id + "?query="
  var query = `SELECT ?s WHERE { ?s rdf:type adv:` + req.params.classe + `}`

  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados => {
      var inds = dados.data.results.bindings.map(bind => bind.s.value.split('#')[1])

      res.render('classe', {
        repositorio: req.params.id,
        individuos: inds.sort(), 
        prefixo: pre,
        classe: req.params.classe});   
    })
    .catch(err => {
      res.render('error', {error: err});
  });
});


/* GET indivíduo de uma classe. */
router.get('/repositorio/:id/classe/:classe/individuo/:ind', function(req, res, next) {
  console.log(req.params)
  var getLink = "http://localhost:7200/repositories/" + req.params.id + "?query="
  var query = `SELECT * WHERE { adv:` + req.params.ind + ` ?p ?o}`
  
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados => {
      var props = dados.data.results.bindings.map(bind => {
        return {
            p: bind.p.value.split('#')[1],
            o: (bind.o.type == 'literal') ? bind.o.value : bind.o.value.split('#')[1]
        }
      });

      res.render('individuo', {
        classe: req.params.classe,
        individuo: req.params.ind,
        prefixo: pre,
        propriedades: props
      });
    })
    .catch(err => {
      console.log("aquiiiii!!!!")
      res.render('error', {error: err});
  })
});

module.exports = router;
