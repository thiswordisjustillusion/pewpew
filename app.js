const express = require("express");
//подключение к монго
const MongoClient = require("mongodb").MongoClient;
//защита от инъекций в запросах
const filter = require('content-filter')
//шифрование
const bcrypt = require('bcrypt-nodejs')
//работа с сессиями
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

let dbClient;

//сессии
app.use(
    session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            url: 'mongodb://localhost:27017/PewpoDB'
        })
    })
)

app.set('view engine', 'ejs');
//защита от инъекций в запросах
app.use(filter());
//https://www.youtube.com/watch?v=oHVfnRIx9Us&list=PL0lO_mIqDDFX0qH9w5YQIDV6Wxy0oawet&index=15
app.use('/public', express.static('public'))
app.use('/js', express.static('js'))
//https://www.youtube.com/watch?v=FUf8a47ZT9Q&list=PL0lO_mIqDDFX0qH9w5YQIDV6Wxy0oawet&index=15&t=2s
app.get('/', function (req, res) {
    const login = req.session.userLogin;
    res.render('index', { login });
})

app.get('/recomended1', function (req, res) {
    const login = req.session.userLogin;
    res.render('recomended1', { login });
})
app.get('/recomended2', function (req, res) {
    const login = req.session.userLogin;
    res.render('recomended2', { login });
})
app.get('/register', function (req, res) {
    res.render('register');
})
app.get('/movie/:title', function (req, res) {
    const db = req.app.locals.db;
    const login = req.session.userLogin;
    db.collection("films").findOne({ "title": req.params.title }, function (err, movie) {
        res.render('movie', { movie, login });
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
    db.collection("films").findOne({ "title": title }, function (err, movie) {
        res.send(movie);
    });
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
        //вывод обновлённой информации о фильме
        db.collection("films").findOne({ "title": title }, function (err, movie) {
            res.send(movie);
        });
    } else {
        //удаление лайка фильму
        db.collection("films").findOneAndUpdate({ "title": title }, { $inc: { "like": -1 } });
        //удаление фильма из "понравившихся"
        db.collection("users").findOneAndUpdate({ "login": userlogin }, { $pull: { "like": title } });
        //удаление жанров из понравившихся
        db.collection('users').findOneAndUpdate({ "login": userlogin }, { $inc: { [genreN2[0]]: -1, [genreN2[1]]: -1, [genreN2[2]]: -1 } })
        //вывод обновлённой информации о фильме
        db.collection("films").findOne({ "title": title }, function (err, movie) {
            res.send(movie);
        });
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
                "genrep.0": newGenreP[0], "genrep.1": newGenreP[1], "genrep.2": newGenreP[2],
                "genrep.3": newGenreP[3], "genrep.4": newGenreP[4], "genrep.5": newGenreP[5],
                "genrep.6": newGenreP[6], "genrep.7": newGenreP[7], "genrep.8": newGenreP[8], "genrep.9": newGenreP[9]
            }
        })
        sum = 0;
    });

});

app.post("/register", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const db = req.app.locals.db;
    const userLogin = req.body.login;
    let userPassword = req.body.password;
    const userPassword2 = req.body.password2;

    if (!userLogin || !userPassword) {
        //console.log('!error')
        let registerCompleted = false;
        let registerError = 'Необходимо заполнить все поля'
        result = { registerCompleted, registerError }
        res.send(result)
    } else {
        if (userPassword == userPassword2) {
            const findUser = { login: userLogin };

            db.collection("users").findOne(findUser, function (err, find) {
                if (!find) {
                    console.log(userLogin, userPassword)
                    bcrypt.hash(userPassword, null, null, function (err, hash) {
                        userPassword = hash;

                        const newUser = { login: userLogin, password: userPassword, genre: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], genrep: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], view: [], like: [] }
                        db.collection("users").insertOne(newUser, function (err, resultInsert) {
                            if (err) return console.log(err);

                            let registerCompleted = true;
                            req.session.userLogin = newUser.login;
                            result = { registerCompleted }
                            res.send(result)
                        })
                    })
                } else {
                    let registerCompleted = false;
                    let registerError = 'Пользователь с таким логином уже зарегистрирован'
                    result = { registerCompleted, registerError }
                    res.send(result)
                }
            });
        } else {
            //console.log('несовпадение паролей')
            let registerCompleted = false;
            let registerError = 'Пароли не совпадают'
            result = { registerCompleted, registerError }
            res.send(result)
        }
    }
})

app.post("/login", jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const db = req.app.locals.db;

    const userLogin = req.body.login;
    let userPassword = req.body.password;
    console.log(userLogin, userPassword)
    if (!userLogin || !userPassword) {
        let loginCompleted = false;
        let loginError = 'Необходимо заполнить все поля'
        result = { loginCompleted, loginError }
        res.send(result);
    } else {
        let newUser = { login: userLogin }
        db.collection("users").findOne(newUser, function (err, find) {
            if (find) {
                bcrypt.compare(userPassword, find.password, function (err, findHash) {
                    if (findHash) {
                        req.session.userLogin = find.login;
                        let loginCompleted = true;
                        result = { loginCompleted };
                        res.send(result)
                    } else {
                        let loginCompleted = false;
                        let loginError = 'Логин или пароль не совпадают'
                        result = { loginCompleted, loginError }
                        res.send(result)
                    }
                })
            } else {
                let loginCompleted = false;
                let loginError = 'Логин или пароль не совпадают'
                result = { loginCompleted, loginError }
                res.send(result)
            }
        })
    }
})

app.post("/search", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const db = req.app.locals.db;

    let letSearch = req.body.searchM.toLowerCase().replace(/[\/\\#&,()$~%.'"—:*?<>{} \-_=\[\]]/g, "");
    let sumSearch = [];

    db.collection("films").find({}).sort({ "rating": -1 }).toArray(async function (err, search) {
        if (err) return console.log(err);
        for (i = 0; i < search.length; i++) {
            let flag = 0;
            //перевод "поисковых критериев" в нижний регистр, удаление спецсимволов и подготовка к поиску
            const newTitle = search[i].title.toLowerCase().replace(/[\/\\#&,()$~%.`'":—*?< >{}\-_=\[\]]/g, "").concat('1');
            const newTitleRus = search[i].title_rus.toLowerCase().replace(/[\/\\#&,()$~%.'—":*?< >{}\-_=\[\]]/g, "").concat('1');
            const newProducer = [];
            for (j = 0; j < search[i].producer.length; j++) newProducer.push(search[i].producer[j].toLowerCase().replace(/[\/\\#&,+( )$~%.'—":*?<>{}\-_=\[\]]/g, "").concat('1'));
            const newActors = [];
            for (j = 0; j < search[i].actors.length; j++) newActors.push(search[i].actors[j].toLowerCase().replace(/[\/\\#&,+()$~%. '":*?<—>{}\-_=\[\]]/g, "").concat('1'));

            //поиск подстроки letSearch
            if ((newTitle.search(letSearch) != -1) || (newTitleRus.search(letSearch) != -1)) {
                sumSearch.push(search[i]);
                flag = 1;
            }
            if (flag == 0) for (j = 0; j < newProducer.length; j++)
                if (newProducer[j].search(letSearch) != -1) {
                    sumSearch.push(search[i]);
                    flag = 1;
                }
            if (flag == 0) for (j = 0; j < newActors.length; j++)
                if (newActors[j].search(letSearch) != -1) {
                    sumSearch.push(search[i]);
                    flag = 1;
                }
        }
        res.send(sumSearch)
    });
});

//фильтрация и сортировка
app.post("/movies", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const checkedGenre = req.body.genreM;
    let checkedYear1 = req.body.yearM[0];
    let checkedYear2 = req.body.yearM[1];
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

//выход из аккаунта
app.post("/logout", function(req,res){
    if (req.session) req.session.destroy()
    if (!(req.session)) res.send('yep')
})

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});