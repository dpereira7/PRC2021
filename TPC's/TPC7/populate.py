import json

with open("cidades.json", encoding='utf8') as f:
    data = json.load(f)

b = open("cidades-base.ttl", encoding='utf8')

f = open("cidades-final.ttl", "w",encoding='utf8')

f.write(b.read())

f.write("""
#################################################################
#    Individuals
#################################################################

""")

#--- Cidades -----
for c in data['cidades']:
    t = "###  http://www.di.uminho.pt/prc2021/cidades#" + c['id'] + "\n"
    t += ":" + c['id'] + " rdf:type owl:NamedIndividual ,\n"
    t += "            :cidade ;\n"
    t += "   :nome \"" + c['nome'] + "\" ;\n"
    t += "   :população \"" + c['população'] + "\" ;\n"
    t += "   :descrição \"" + c['descrição'] + "\" ;\n"
    t += "   :distrito \"" + c['distrito'] + "\" .\n\n"    
    f.write(t)

#--- Ligações -----
for l in data['ligações']:
    t = "###  http://www.di.uminho.pt/prc2021/cidades#" + l['id'] + "\n"
    t += ":" + l['id'] + " rdf:type owl:NamedIndividual ,\n"
    t += "            :ligação ;\n"
    t += "   :origem \"" + l['origem'] + "\" ;\n"
    t += "   :destino \"" + l['destino'] + "\" ;\n"
    t += "   :distância \"" + str(l['distância']) + "\" .\n\n"    
    f.write(t)


f.write("###  Generated by the OWL API (version 4.5.9.2019-02-01T07:24:44Z) https://github.com/owlcs/owlapi\n")
f.close()