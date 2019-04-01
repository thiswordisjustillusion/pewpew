const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
   
const app = express();
const jsonParser = express.json();
 
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
 
let dbClient;
 
app.use(express.static(__dirname + "/public"));
 
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("PewpoDB");
    app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
});

//app.get("/recomended1", function(request, response){});

app.get("/movies", function(req, res){  
    const collection = req.app.locals.collection;
    collection.collection("films").find({}).sort({"rating" : -1}).toArray(function(err, movies){
        if(err) return console.log(err);
        res.send(movies)
    });
});

app.get("/users", function(req, res){  
    const collection = req.app.locals.collection;
    collection.collection("users").find({}).toArray(function(err, users){
        if(err) return console.log(err);
        res.send(users)
    });
});

app.post("/movies", jsonParser, function (req, res) {
       
    if(!req.body) return res.sendStatus(400);
    //const gen1 = req.body.g1;
    //const gen2 = req.body.g2;
    //const gen3 = req.body.g3;
    //const strgenresM = req.body.jsongenres;
    let strgenresM = "film2";
    console.log(strgenresM);
    //strgenres1 = strgenres.replace(/"/, '')
    //console.log(strgenres1);

    const collection = req.app.locals.collection;
    collection.collection("films").find({"title" : strgenresM}).sort({"rating" : -1}).toArray(function(err, movies){
        if(err) return console.log(err);
        console.log(movies)
        res.send(movies)
    });
});

/*app.get("/recomended-films", function(req, res){
    if(!req.body) return res.sendStatus(400);
       
    const _id = req.body.userID;
    const login = req.body.userLogin;

    const collection = req.app.locals.collection;
})*/

/*
удаление элемента строки:
stroka = "qwe qweqwe(/$'";
stroka.replace(/\//, "_"); слеш
*/
/*
stroka = "qwe q/weq/we(/$'";
stroka.replace(/\w/g, "_");
*//*
stroka = "qwe q/weq/we(/$'";
stroka.replace(/\N/g, "_"); удаление не цифр
*//*
stroka = "qwe q/weq/we(/$'";
stroka.test(/\N/g); есть/нет */
/*
stroka = "qwe q/weq/we(/$'";
stroka.match(/w/g); поиск */


// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});