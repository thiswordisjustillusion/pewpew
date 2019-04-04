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
    app.locals.db = client.db("PewpoDB");
    app.listen(3000, function(){
        console.log("Сервер:3000");
    });
});

app.get("/movies", function(req, res){  

    const db = req.app.locals.db;

    db.collection("films").find({}).sort({"rating" : -1}).toArray(function(err, movies){
        if(err) return console.log(err);
        res.send(movies)
    });
});

app.get("/users", function(req, res){  

    const db = req.app.locals.db;

    db.collection("users").find({}).toArray(function(err, users){
        if(err) return console.log(err);
        res.send(users)
    });
});

//фильтрация и сортировка
app.post("/movies", jsonParser, function (req, res) {
       
    if(!req.body) return res.sendStatus(400);
       
    const checkedGenre = req.body.genreM;
    const checkedYear = req.body.yearM;
    const checkedYear1 = checkedYear[0]
    let checkedYear2 = checkedYear[1]
    if (checkedYear2 == 0) checkedYear2 = 2050;
    const checkedSort = req.body.sortM;
    console.log(checkedGenre)
    console.log(checkedYear1, checkedYear2)
    const db = req.app.locals.db;

    //проверка на жанры
    if (!(checkedGenre.length == 0)) {
        if (checkedSort == "rating") {
            db.collection("films").find({"genreN" : { $all : checkedGenre}, "year" : { $gte: checkedYear1, $lte: checkedYear2}}).sort({"rating" : -1}).toArray(function(err, movies){
                if(err) return console.log(err);
                res.send(movies)
                console.log(movies)
            });
        }
        if (checkedSort == "year") {
            db.collection("films").find({"genreN" : { $all : checkedGenre}, "year" : { $gte: checkedYear1, $lte: checkedYear2}}).sort({"year" : -1}).toArray(function(err, movies){
                if(err) return console.log(err);
                res.send(movies)
                console.log(movies)
            });
        }
        if (checkedSort == "views") {
            db.collection("films").find({"genreN" : { $all : checkedGenre}, "year" : { $gte: checkedYear1, $lte: checkedYear2}}).sort({"views" : -1}).toArray(function(err, movies){
                if(err) return console.log(err);
                res.send(movies)
                console.log(movies)
            });
        }
        
    } else {
        if (checkedSort == "rating") {
            db.collection("films").find({"year" : { $gte: checkedYear1, $lte: checkedYear2}}).sort({"rating" : -1}).toArray(function(err, movies){
                if(err) return console.log(err);
                res.send(movies)
                console.log(movies)
            });
        }
        if (checkedSort == "year") {
            db.collection("films").find({"year" : { $gte: checkedYear1, $lte: checkedYear2}}).sort({"year" : -1}).toArray(function(err, movies){
                if(err) return console.log(err);
                res.send(movies)
                console.log(movies)
            });
        }
        if (checkedSort == "views") {
            db.collection("films").find({"year" : { $gte: checkedYear1, $lte: checkedYear2}}).sort({"views" : -1}).toArray(function(err, movies){
                if(err) return console.log(err);
                res.send(movies)
                console.log(movies)
            });
        }
        
    }
    
});

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