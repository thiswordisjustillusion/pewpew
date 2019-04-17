const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

let dbClient;

app.set('view engine', 'ejs');
//https://www.youtube.com/watch?v=oHVfnRIx9Us&list=PL0lO_mIqDDFX0qH9w5YQIDV6Wxy0oawet&index=15
app.use('/public', express.static('public'))
app.use('/js', express.static('js'))
//https://www.youtube.com/watch?v=FUf8a47ZT9Q&list=PL0lO_mIqDDFX0qH9w5YQIDV6Wxy0oawet&index=15&t=2s
app.get('/', function (req, res) {
    res.render('index');
})

app.get('/recomended1', function (req, res) {
    res.render('recomended1');
})
app.get('/recomended2', function (req, res) {
    res.render('recomended2');
})
app.get('/movie/:title', function (req, res) {
    const db = req.app.locals.db;
    db.collection("films").findOne({ "title": req.params.title }, function (err, movie) {
        res.render('movie', { movie: movie });
    });
})


app.use(express.static(__dirname + "/public"));

mongoClient.connect(function (err, client) {
    if (err) return console.log(err);
    dbClient = client
    app.locals.db = client.db("PewpoDB");
    app.listen(3000, function () {
        console.log("Сервер:3000");
    });
});

app.get("/movies", function (req, res) {

    const db = req.app.locals.db;

    db.collection("films").find({}).sort({ "rating": -1 }).toArray(function (err, movies) {
        if (err) return console.log(err);
        res.send(movies)
    });
});

app.get("/users", function (req, res) {

    const db = req.app.locals.db;

    db.collection("users").find({}).toArray(function (err, users) {
        if (err) return console.log(err);
        res.send(users)
    });
});
app.put("/movie-view/:title", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const db = req.app.locals.db;

    const title = req.body.title;
    const userlogin = req.body.userlogin;
    //фильм: увеличение просмотров на одну единицу:
    db.collection("films").findOneAndUpdate({ "title": title }, { $inc: { "views": 1 } });
    //пользователь: добавление фильма в просмотренные:
    db.collection("users").findOneAndUpdate({ "login": userlogin }, { $addToSet: { "view": title } });
})

app.put("/movie/:title", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const db = req.app.locals.db;

    const title = req.body.title;
    const userlogin = req.body.userlogin;
    const status = req.body.status;
    const genreN = req.body.genreN;

    let genreN2 = ["genre.", "genre.", "genre."];
    for (i = 0; i < 3; i++)
        genreN2[i] += genreN[i]
    //https://metanit.com/nosql/mongodb/2.9.php
    if (status == 1) {
        //добавление лайка фильму
        db.collection("films").findOneAndUpdate({ "title": title }, { $inc: { "like": 1 } });
        //добавление фильм в "понравившихся"
        db.collection("users").findOneAndUpdate({ "login": userlogin }, { $addToSet: { "like": title } });
        //добавление жанров в понравившиеся
        db.collection('users').findOneAndUpdate({ "login": userlogin }, { $inc: { [genreN2[0]]: 1, [genreN2[1]]: 1, [genreN2[2]]: 1 } })
    } else {
        //удаление лайка фильму
        db.collection("films").findOneAndUpdate({ "title": title }, { $inc: { "like": -1 } });
        //удаление фильма из "понравившихся"
        db.collection("users").findOneAndUpdate({ "login": userlogin }, { $pull: { "like": title } });
        //удаление жанров из понравившихся
        db.collection('users').findOneAndUpdate({ "login": userlogin }, { $inc: { [genreN2[0]]: -1, [genreN2[1]]: -1, [genreN2[2]]: -1 } })
    }


    //расчёт % соотношения каждого жанра пользователя:
    db.collection("users").findOne({ "login": userlogin }, function (err, user) {
        let sum = 0;
        let newGenreP = [];
        for (i = 0; i < 10; i++) sum += user.genre[i];
        console.log(sum);
        for (i = 0; i < 10; i++) newGenreP[i] = ((user.genre[i] / sum) * 100)
        console.log(newGenreP)
        //изменение user.genrep
        db.collection('users').findOneAndUpdate({ "login": userlogin }, {
            $set: {
                "genrep.0": newGenreP[0], "genrep.1": newGenreP[1], "genrep.2": newGenreP[2], "genrep.3": newGenreP[3],
                "genrep.4": newGenreP[4], "genrep.5": newGenreP[5], "genrep.6": newGenreP[6], "genrep.7": newGenreP[7], "genrep.8": newGenreP[8], "genrep.9": newGenreP[9]
            }
        })
        sum = 0;
    });

});

app.post("/search", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const db = req.app.locals.db;

    let letSearch = req.body.searchM.toLowerCase().replace(/[\/\\#&,()$~%.'"—:*?<>{} \-_=\[\]]/g, "");
    let sumSearch = [];
    db.collection("films").find({}).sort({ "rating": -1 }).toArray(async function (err, search) {
        if (err) return console.log(err);
        for (i = 0; i < search.length; i++) {
            let flag = 0;
            //перевод "поисковых критериев" в нижний регистр и удаление спецсимволов
            const newTitle = search[i].title.toLowerCase().replace(/[\/\\#&,()$~%.`'":—*?< >{}\-_=\[\]]/g, "");
            const newTitleRus = search[i].title_rus.toLowerCase().replace(/[\/\\#&,()$~%.'—":*?< >{}\-_=\[\]]/g, "");
            const newProducer = [];
            for (j = 0; j < search[i].producer.length; j++) newProducer.push(search[i].producer[j].toLowerCase().replace(/[\/\\#&,+( )$~%.'—":*?<>{}\-_=\[\]]/g, ""));
            //search[i].producer.toLowerCase().replace(/[\/\\#&,()$~%.'":*?<>{}\-_=\[\]]/g, ""); 
            const newActors = [];
            for (j = 0; j < search[i].actors.length; j++) newActors.push(search[i].actors[j].toLowerCase().replace(/[\/\\#&,+()$~%. '":*?<—>{}\-_=\[\]]/g, ""));
            //поиск фильмов по "поисковым критериям"
            if ((letSearch == newTitle) || (letSearch == newTitleRus)) {
                sumSearch.push(search[i]);
                flag = 1;
            }
            if (flag == 0) for (j = 0; j < newProducer.length; j++)
                if (letSearch == newProducer[j]) {
                    sumSearch.push(search[i]);
                    flag = 1;
                    console.log(newProducer[j])
                }
            if (flag == 0) for (j = 0; j < newActors.length; j++)
                if (letSearch == newActors[j]) {
                    sumSearch.push(search[i])
                    flag = 1;
                    console.log(newActors[j])
                }
        }
        console.log(sumSearch)
        res.send(sumSearch)
    });
});

//фильтрация и сортировка
app.post("/movies", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const checkedGenre = req.body.genreM;
    const checkedYear1 = req.body.yearM[0];
    const checkedYear2 = req.body.yearM[1];
    const checkedSort = req.body.sortM;
    const checkedCountry = req.body.countryM;

    const db = req.app.locals.db;

    //проверка на жанры
    if (!(checkedGenre.length == 0)) {
        db.collection("films").find({ "genreN": { $all: checkedGenre }, "year": { $gte: checkedYear1, $lte: checkedYear2 }, "country": { $in: checkedCountry } }).sort({ [checkedSort]: -1 }).toArray(function (err, movies) {
            if (err) return console.log(err);
            res.send(movies)
        });
    } else {
        db.collection("films").find({ "year": { $gte: checkedYear1, $lte: checkedYear2 }, "country": { $in: checkedCountry } }).sort({ [checkedSort]: -1 }).toArray(function (err, movies) {
            if (err) return console.log(err);
            res.send(movies)
        });
    }

});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});