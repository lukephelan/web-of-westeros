var express = require('express');
var neo4j = require('node-neo4j');
var cors = require('cors');
var app = express();

app.use(cors());
app.use(express.static(__dirname + '/'));

// Create a db object connected to the Neo4j database
db = new neo4j('http://neo4j:password@localhost:7474');

app.get('/', function (req, res) {
    res.render('index');
});

// Create an object to store the database results
var object = {};

app.get('/json', function (req, res){

    // Retrieve all nodes from the database
    db.cypherQuery("START N=NODE(*) RETURN {name: N.name, group: N.group, img: N.img}", function(err, result){
        if(err) throw err;
        object.nodes = result.data;

        db.cypherQuery("START n=node(*) MATCH (n)-[r]->(m) RETURN {source: id(n), target: id(m), value: r.value}", function(err, result){
            if(err) throw err;
            object.links = result.data
            res.send(object);
        });
    });
});

app.listen(8080, function() {
  console.log('Winter is coming!');
});
