var express = require('express');
var router = express.Router();
var axios = require('axios');

const prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>    
    PREFIX : <http://www.daml.org/2003/01/periodictable/PeriodicTable#>
    PREFIX adv: <http://www.daml.org/2003/01/periodictable/PeriodicTable#>
`

const pre = "http://localhost:7710/"
var getLink = "http://localhost:7200/repositories/prc2021-tpc4?query="

/* GET Menu/Página Inicial. */
router.get('/', function(req, res, next) {
      res.render('index', {prefixo: pre});
});


/* GET de todos os grupos. */
router.get('/grupos', function(req, res, next) {
      var query = `SELECT ?s ?name ?number WHERE { ?s rdf:type :Group . OPTIONAL{ ?s :name ?name } . OPTIONAL{ ?s :number ?number } . } ORDER BY (?s)`

      var encoded = encodeURIComponent(prefixes + query)

      axios.get(getLink + encoded)
        .then(dados => {
          grupos = dados.data.results.bindings.map(bind => {
            return({
              id: bind.s.value.split('#')[1],
              number: (bind.number) ? bind.number.value : "N/A",
              name: (bind.name) ? bind.name.value : "N/A"
            })
          });
          res.render('grupos', {prefixo: pre, grupos: grupos}); 
        }).catch(err =>{
            res.render('error', {error: err});
        })
});


/* GET grupo em específico. */
router.get('/grupos/:id', function(req, res, next) {
  var query = 'SELECT * WHERE { :' + req.params.id + ' ?p ?o . }';

  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados => {
      var grupo = dados.data.results.bindings.map(bind => {
        return({
          p: bind.p.value.split('#')[1],
          o: (bind.o.type == 'literal') ? bind.o.value : bind.o.value.split('#')[1]
        })
      })

      var number = 'N/A'
      var name = 'N/A'
      grupo.forEach(g => {
          if (g.p == 'name') {
              name = g.o
          }
          if (g.p == 'number') {
              number = g.o
          }
      });

      res.render('grupo', {
        grupo: grupo,
        nome: name,
        numero: number,
        prefixo: pre
      });   
    })
    .catch(err => {
      res.render('error', {error: err});
  });
});


/* GET de todos os períodos. */
router.get('/periodos', function(req, res, next) {
  var query = `SELECT ?s ?number WHERE { ?s rdf:type :Period . ?s :number ?number . } ORDER BY (?number)`

  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados => {
      periodos = dados.data.results.bindings.map(bind => {
        return({
          id: bind.s.value.split('#')[1],
          number: "Período " + bind.number.value
        })
      });
      res.render('periodos', {prefixo: pre, periodos: periodos}); 
    }).catch(err =>{
        res.render('error', {error: err});
    })
});


/* GET período em específico. */
router.get('/periodos/:id', function(req, res, next) {
  var query = 'SELECT DISTINCT ?name WHERE {  :' + req.params.id +' ?p ?o . :' + req.params.id + ' :element ?name } ORDER BY ?name';

  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados => {
      var periodo = dados.data.results.bindings.map(bind => {
        return({
          element: bind.name.value.split('#')[1]
        })
      })

      res.render('periodo', {
        id: req.params.id.split('_')[1],
        periodo: periodo,
        prefixo: pre
      });   
    })
    .catch(err => {
      res.render('error', {error: err});
  });
});



/* GET de todos os elementos. */
router.get('/elementos', function(req, res, next) {
  var query = `SELECT ?s ?simb ?name ?anumber WHERE { ?s rdf:type :Element ; :symbol ?simb ; :name ?name ; :atomicNumber ?anumber .} ORDER BY (?anumber)`

  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados => {
      elementos = dados.data.results.bindings.map(bind => {
        return({
          id: bind.s.value.split('#')[1],
          name: bind.name.value,
          simb: bind.simb.value,
          anumber: bind.anumber.value
        })
      });
      res.render('elementos', {prefixo: pre, elementos: elementos}); 
    }).catch(err =>{
        res.render('error', {error: err});
    })
});


/* GET elemento em específico. */
router.get('/elementos/:id', function(req, res, next) {
  var query = 'SELECT DISTINCT ?anumber ?aweight ?casregid ?color ?name ?symbol ?block ?classi ?stastate ?group ?period WHERE {  :' + req.params.id +' ?p ?o ; :atomicNumber ?anumber ; :atomicWeight ?aweight ; :casRegistryID ?casregid ; :color ?color ; :name ?name ; :symbol ?symbol ; :block ?block ; :classification ?classi ; :standardState ?stastate ; :group ?group ; :period ?period . }'

  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados => {
      var elemento = dados.data.results.bindings.map(bind => {
        return({
          anumber: bind.anumber.value,
          aweight: bind.aweight.value,
          casregid: bind.casregid.value,
          color: bind.color.value,
          name: bind.name.value,
          symbol: bind.symbol.value,
          block: bind.block.value.split('#')[1],
          classi: bind.classi.value.split('#')[1],
          stastate: bind.stastate.value.split('#')[1],
          group: bind.group.value.split('#')[1],
          period: bind.period.value.split('#')[1]
        })
      })

      res.render('elemento', {
        id: req.params.id,
        elemento: elemento
      });   
    })
    .catch(err => {
      res.render('error', {error: err});
  });
});

module.exports = router;
