import json

with open("db.json", encoding='utf8') as f:
    data = json.load(f)

f = open("final.ttl", "w",encoding='utf8')

f.write("""@prefix : <http://www.di.uminho.pt/prc2021/uc#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xml: <http://www.w3.org/XML/1998/namespace> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@base <http://www.di.uminho.pt/prc2021/uc> .

<http://www.di.uminho.pt/prc2021/uc> rdf:type owl:Ontology .

#################################################################
#    Object Properties
#################################################################

###  http://www.di.uminho.pt/prc2021/uc#ensina
:ensina rdf:type owl:ObjectProperty ;
        owl:inverseOf :éEnsinadaPor ;
        rdfs:domain :Professor ;
        rdfs:range :UnidadeCurricular .


###  http://www.di.uminho.pt/prc2021/uc#frequenta
:frequenta rdf:type owl:ObjectProperty ;
           owl:inverseOf :éFrequentadaPor ;
           rdfs:domain :Aluno ;
           rdfs:range :UnidadeCurricular .


###  http://www.di.uminho.pt/prc2021/uc#éAlunoDe
:éAlunoDe rdf:type owl:ObjectProperty ;
          owl:inverseOf :éProfessorDe .


###  http://www.di.uminho.pt/prc2021/uc#éEnsinadaPor
:éEnsinadaPor rdf:type owl:ObjectProperty .


###  http://www.di.uminho.pt/prc2021/uc#éFrequentadaPor
:éFrequentadaPor rdf:type owl:ObjectProperty .


###  http://www.di.uminho.pt/prc2021/uc#éProfessorDe
:éProfessorDe rdf:type owl:ObjectProperty ;
              owl:propertyChainAxiom ( :ensina
                                       :éFrequentadaPor
                                     ) .


#################################################################
#    Data properties
#################################################################

###  http://www.di.uminho.pt/prc2021/uc#anoLetivo
:anoLetivo rdf:type owl:DatatypeProperty .


###  http://www.di.uminho.pt/prc2021/uc#designação
:designação rdf:type owl:DatatypeProperty .


###  http://www.di.uminho.pt/prc2021/uc#nome
:nome rdf:type owl:DatatypeProperty .


#################################################################
#    Classes
#################################################################

###  http://www.di.uminho.pt/prc2021/uc#Aluno
:Aluno rdf:type owl:Class ;
       rdfs:subClassOf [ rdf:type owl:Restriction ;
                         owl:onProperty :frequenta ;
                         owl:someValuesFrom :UnidadeCurricular
                       ] .


###  http://www.di.uminho.pt/prc2021/uc#Professor
:Professor rdf:type owl:Class ;
           rdfs:subClassOf [ rdf:type owl:Restriction ;
                             owl:onProperty :ensina ;
                             owl:someValuesFrom :UnidadeCurricular
                           ] .


###  http://www.di.uminho.pt/prc2021/uc#UnidadeCurricular
:UnidadeCurricular rdf:type owl:Class .

#################################################################
#    Individuals
#################################################################

""")

#--- UC's -----
for uc in data['ucs']:
    t = "###  http://www.di.uminho.pt/prc2021/uc#" + uc['id'] + "\n"
    t += ":" + uc['id'] + " rdf:type owl:NamedIndividual ,\n"
    t += "             :UnidadeCurricular ;\n"
    t += "          :anoLetivo \"" + uc['anoLetivo'] + "\" ;\n"
    t += "          :designação \"" + uc['designacao'] + "\" .\n\n"    
    f.write(t)

#--- Docentes -----
for doc in data['docentes']:
    t = "###  http://www.di.uminho.pt/prc2021/uc#" + doc['id'] + "\n"
    t += ":" + doc['id'] + " rdf:type owl:NamedIndividual ,\n"
    t += "             :Professor ;\n"
    uc = doc['ensina'].split(',')
    i=0
    for unidadeC in uc:
        if(i == 0):
            text = unidadeC
            if(len(uc) > 1):
                text += " ,\n"
            else:
                text += " ;\n"
        else:
            text += "                     :" + unidadeC
            if(i == len(uc)-1):
                text += " ;\n"
            else:
                text += " ,\n"
        i+=1
    t += "          :ensina :" + text
    t += "          :nome \"" + doc['nome'] + "\" .\n\n"    
    f.write(t)

#--- Alunos -----
for alu in data['alunos']:
    t = "###  http://www.di.uminho.pt/prc2021/uc#" + alu['_id'] + "\n"
    t += ":" + alu['_id'] + " rdf:type owl:NamedIndividual ,\n"
    t += "                 :Aluno ;\n"
    uc = alu['frequenta'].split(',')
    i=0
    for unidadeC in uc:
        if(i == 0):
            text = unidadeC
            if(len(uc) > 1):
                text += " ,\n"
            else:
                text += " ;\n"
        else:
            text += "                     :" + unidadeC
            if(i == len(uc)-1):
                text += " ;\n"
            else:
                text += " ,\n"
        i+=1
    t += "          :frequenta :" + text
    t += "          :nome \"" + alu['nome'] + "\" .\n\n"    
    f.write(t)





f.write("###  Generated by the OWL API (version 4.5.9.2019-02-01T07:24:44Z) https://github.com/owlcs/owlapi\n")
f.close()