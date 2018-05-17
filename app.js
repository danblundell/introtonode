var restify = require('restify');
var mongoose = require('mongoose');
var Person = require('./models/person');

mongoose.Promise = global.Promise;
mongoose.connect("<connection-string>");

var server = restify.createServer();

server.use(restify.plugins.bodyParser());

// simple get request with static response
server.get('/helloworld',function(req,res){
  res.send(200,{nessage:'Hello world'});
});

//simple post request
server.post('/helloworld',function(req,res){
  res.send(200,{message:"I'm a post request"});
});

// dynamic get request
server.get('/helloworld/:name',function(req,res){
  res.send(200,{nessage:'Hello ' + req.params.name});
});

//dynamic post request
server.post('/helloworld2',function(req,res){
  res.send(200,{message:"I'm a post req from " + req.body.name});
});

// upgraded post request to save the data to a db
server.post('/person',function(req,res,next){
  var person = new Person();
  person.firstName = "Dan";
  person.lastName = "Blundell";
  person.save(function(err){
    if(err) res.send(400,{error:err.message});
    res.send(200,{id:person.id});
  })
});


// get the data from the database
server.get('/person/:id',function(req,res){
  Person.findById(req.params.id, function(err,person){
    if(err) res.send(400,{error: err.message});
    res.send(200,{person: person});
  })
});

server.listen(3000,() => {
  console.log('%s listening at %s', server.name, server.url);
});