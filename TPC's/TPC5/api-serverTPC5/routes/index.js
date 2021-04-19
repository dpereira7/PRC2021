var express = require('express');
var router = express.Router();
var axios = require('axios')

const prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX xml: <http://www.w3.org/XML/1998/namespace>       
    PREFIX : <http://www.di.uminho.pt/prc2021/A84092-TPC5>
`

var getLink = "http://epl.di.uminho.pt:8738/api/rdf4j/query/A84092-TPC5?query=";


router.get('/pubs', function (req, res, next) {
  if (!(req.query.type)) {
      var query = `SELECT ?s ?title WHERE { ?s rdf:type :Bibliography . OPTIONAL{?s :title ?title}. } ORDER BY (?s) `;

      var encoded = encodeURIComponent(prefixes + query);

      axios.get(getLink + encoded).then(dados => {
          pubs = dados.data.results.bindings.map(bind => {
              return({
                  id: bind.s.value.split('#')[1],
                  titulo: bind.title.value

              })
          });
          res.status(200).jsonp(pubs);
      }).catch(err => {
          res.status(500).jsonp(err);
      });
  } else {
      tipoPub = req.query.type
      var query = 'SELECT ?s ?title WHERE { ?s rdf:type :' + tipoPub.charAt(0).toUpperCase() + pubtype.slice(1) + ' . OPTIONAL{?s :title ?title}. } ORDER BY (?s)';

      var encoded = encodeURIComponent(prefixes + query);

      axios.get(getLink + encoded).then(dados => {
          pubs = dados.data.results.bindings.map(bind => {
              return({
                  id: bind.s.value.split('#')[1],
                  titulo: bind.title.value

              })
          });
          res.status(200).jsonp(pubs);
      }).catch(err => {
          res.status(500).jsonp(err);
      });
  }
});


router.get('/pubs/:id', function (req, res, next) {
  var query = 'SELECT ?p ?o { :' + req.params.id + ' ?p ?o.} ORDER BY (?p)';

  var encoded = encodeURIComponent(prefixes + query);

  axios.get(getLink + encoded).then(dados => {
      aux_pub = dados.data.results.bindings.map(bind => {
          return({
              p: bind.p.value.split('#')[1],
              o: (bind.o.type == 'literal') ? bind.o.value : bind.o.value.split('#')[1]
          })
      });

      var pub = []
      var array_autores = []
      var array_editores = []
      var flag_autores = true
      var flag_editores = true

      aux_pub.forEach(p => {
          if (p['p'] != 'type') {
              if (p['p'] != "wasWritten" && p['p'] != "wasEdit") {
                  var obj = {};
                  obj[p['p']] = p['o'];
                  pub.push(obj);
              } else {
                  if (p['p'] != "wasEdit") {
                      var obj = {};
                      array_autores.push(p['o'])
                      obj[p['p']] = array_autores;
                      if (flag_autores) {
                          pub.push(obj);
                          flag_autores = false
                      }
                  } else {
                      var obj = {};
                      array_editores.push(p['o'])
                      obj[p['p']] = array_editores;
                      if (flag_editores) {
                          pub.push(obj);
                          flag_editores = false
                      }
                  }
              }
          } else {
              if (p['o'] != "Bibliography" && p['o'] != "NamedIndividual") {
                  var obj = {};
                  obj[p['p']] = p['o'];
                  pub.push(obj);
              }
          }
      });

      res.status(200).jsonp(pub);
  }).catch(err => {
      res.status(500).jsonp(err);
  });
});



router.get('/authors', function(req, res, next) {
  var query = `SELECT ?s ?name WHERE { ?s rdf:type :Author . OPTIONAL{?s :nome ?name}.} ORDER BY (?s)`

  var encoded = encodeURIComponent(prefixes + query)
  
  axios.get(getLink + encoded).then(dados => {
    autores = dados.data.results.bindings.map(bind => {
      return({
        id: bind.s.value.split('#')[1],
        nome: bind.name.value
      })
    })
    res.status(200).jsonp(autores)
  }).catch(error => {
    res.status(500).jsonp(error)
  })
});


router.get('/authors/:id', function (req, res, next) {
  var query = 'SELECT DISTINCT ?pub ?title WHERE { :' + req.params.id + ' :write ?pub . ?pub :title ?title . } ORDER BY (?pub)';

  var encoded = encodeURIComponent(prefixes + query);

  axios.get(getLink + encoded).then(dados => {
      autores = dados.data.results.bindings.map(bind => {
          return({
              id_pub: bind.pub.value.split('#')[1],
              titulo: bind.title.value
          })
      });
      res.status(200).jsonp(autores);
  }).catch(err => {
      res.status(500).jsonp(err);
  });
});

module.exports = router;
