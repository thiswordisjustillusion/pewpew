/////ВЫВОД ФИЛЬМОВ НЕ В ПОРЯДКЕ ВОЗРАСТАНИЯ РЕЙТИНГА, А СООТВЕТСТВИЯ ЮЗЕРАМ
let likeFilms = [];
let recomFilms = [];
let a = [];
let username = "PewpoMan";
let genreJ = [];
let userView = [];
let userLike = [];
let betterUser = "";
let betterUsers = [];
//находим нашего юзера и запоминаем его осн. жанры
function CheckGenre() {
    $.ajax({
        url: "/users",
        type: "GET",
        contentType: "application/json",
        success: function (users) {
            $.each(users, function (index, user) {
                if (user.login == username) {
                    userView = user.view;
                    console.log('user.view', userView)
                    for (i = 0; i < 10; i++) {
                        if (user.genrep[i] >= 10) {
                            genreJ[i] = user.genrep[i];
                        }
                    }
                }
            })
        }
    })
}


function SortUsers() {

    let namemin = "";
    $.ajax({
        url: "/users",
        type: "GET",
        contentType: "application/json",
        success: function (users) {
            let min = 100.0;
            //сколько пользователей записываем как "ахуенных"?
            //з.ы.: это не прям так критично, т.к. повторения будут удаляться
            //но нижняя граница важна!
            //наверное... ну фильмов 30 было бы неплохо закинуть в "поток"
            //лол, поток хд
            while (betterUsers.length < 100) {
                min = 110;
                $.each(users, function (index, user) {
                    let sumOtklon = 0;
                    let flag = 0;
                    //проверяем, был ли юзер уже проверен
                    for (i = 0; i < betterUsers.length + 1; i++) {
                        if (betterUsers[i] == user.login) {
                            flag = 1;
                            break;

                        }
                    }

                    if (!(user.login == username) && (flag == 0)) {
                        for (i = 0; i < 10; i++) {
                            if (user.genrep[i] - genreJ[i]) {
                                sumOtklon += Math.abs(user.genrep[i] - genreJ[i]);
                            }
                        }
                        if (sumOtklon <= min) {
                            min = sumOtklon;
                            namemin = user.login;
                            //console.log('в итоге для user', namemin, 'отклонение', min)
                        }
                    }
                })
                betterUsers[betterUsers.length] = namemin;
                //console.log('bUs',betterUsers)
            }
        }
    });
}

//https://medium.com/@frontman/%D0%B4%D0%B5%D0%B4%D1%83%D0%BF%D0%BB%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D1%8F-%D0%B8-%D1%81%D0%BB%D0%B8%D1%8F%D0%BD%D0%B8%D0%B5-%D0%BC%D0%B0%D1%81%D1%81%D0%B8%D0%B2%D0%BE%D0%B2-c2706948c200
//получение названий фильмов в массив
function GetLikeMovies1() {
    let namemin = "";
    let recomFolms = [];
    let n = 0;
    let userLikeList = [];
    $.ajax({
        url: "/users",
        type: "GET",
        contentType: "application/json",
        success: function (users) {
            //console.log('BetterUsers', betterUsers)
            //console.log('userView2', userView)
            while (betterUsers.length > 0) {
                $.each(users, function (index, user) {
                    if (user.login == betterUsers[0]) {
                        console.log('login', user.login)
                        //console.log('login-like', user.like)
                        for (ii = 0; ii < userView.length; ii++) {
                            for (jj = 0; jj < user.like.length; jj++) {
                                if (user.like[jj] == userView[ii]) {
                                    console.log('убираем:', user.like[jj])
                                    user.like.splice(jj, 1);
                                    continue;
                                }
                            }
                        }
                        for (i = 0; i < user.like.length; i++) {
                            likeFilms = Array.from(new Set(likeFilms.concat(user.like[i])))
                        }

                    };
                });
                betterUsers.splice(0, 1);
                n++;
            }
            console.log('likeFilms', likeFilms)
            GetRecomended1();
        }
    })
}

//вывод ВСЕХ рекомендуемых
function GetRecomended1() {
    //let carts = "";
    let dontViewFilms = likeFilms;
    console.log('likeFilms', likeFilms)
    let flag = 0;
    $.ajax({
        url: "/movies",
        type: "GET",
        contentType: "application/json",
        success: function (movies) {
            var carts = "";
            let viewFilms = 0;
            //в viewFilms хранится количество выведенных фильмов
            //в dontViewFilms хранятся не выведенные фильмы
            //таким образом, можно написать скрипт, который будет 
            //"довыводить" фильмы по запросу пользователя
            while ((dontViewFilms.length > 0) && (viewFilms < 3)) {
                flag = 0;
                $.each(movies, function (index, movie) {
                    if (dontViewFilms[0] == movie.title) {
                        carts += cart(movie);
                        viewFilms++;
                        flag = 1;
                    }
                })
                if (flag == 1) dontViewFilms.splice(0, 1);
                //console.log('length',dontViewFilms.length)
            }
            console.log('viewFilms', viewFilms)
            console.log('dontViewFilms', dontViewFilms)
            $(".films").append(carts);
            $('#films-more').empty();
            $('#films-more').append('<button onclick="GetRecomended1()">Показать ещё</button>');
        }
    })
}
CheckGenre();
SortUsers();
GetLikeMovies1();