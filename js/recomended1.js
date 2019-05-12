/////ВЫВОД ФИЛЬМОВ НЕ В ПОРЯДКЕ ВОЗРАСТАНИЯ РЕЙТИНГА, А СООТВЕТСТВИЯ ЮЗЕРАМ
let likeFilms = [];
let genreJ = [];
let userView = [];
let betterUsers = [];
//находим нашего юзера и запоминаем его осн. жанры
function CheckGenre() {
    if ($("#login").text() == '') {
        $(".films").append(
            '<h2>Необходимо авторизироваться для просмотра рекомендаций</h2>'
        );
    } else {
        $.ajax({
            url: "/users",
            type: "GET",
            contentType: "application/json",
            success: function (users) {
                $.each(users, function (index, user) {
                    //находим запись о текущем пользователе
                    if (user.login == $("#login").text()) {
                        //сохраняем просмотренные фильмы пользователя
                        userView = user.view;
                        for (i = 0; i < 10; i++)
                            if (user.genrep[i] >= 10)
                                genreJ[i] = user.genrep[i];
                    }
                })
            }
        });
        SortUsers();
    }
}


function SortUsers() {
    let namemin = "";
    $.ajax({
        url: "/users",
        type: "GET",
        contentType: "application/json",
        success: function (users) {
            let min = 100.0;
            //сколько пользователей записываем как "лучших"?
            //з.ы.: это не прям так критично, т.к. повторения будут удаляться
            //но нижняя граница важна!
            //наверное... ну фильмов 30 было бы неплохо закинуть в "поток"
            while (betterUsers.length < 100) {
                min = 110;
                $.each(users, function (index, user) {
                    let sumOtklon = 0;
                    let flag = 0;
                    //проверяем, был ли юзер уже проверен
                    for (i = 0; i < betterUsers.length + 1; i++)
                        if (betterUsers[i] == user.login) {
                            flag = 1;
                            break;
                        }


                    if (!(user.login == $("#login").text()) && (flag == 0)) {
                        for (i = 0; i < 10; i++)
                            if (user.genrep[i] - genreJ[i])
                                sumOtklon += Math.abs(user.genrep[i] - genreJ[i]);
                        if (sumOtklon <= min) {
                            min = sumOtklon;
                            namemin = user.login;
                        }
                    }
                })
                betterUsers[betterUsers.length] = namemin;
            }
        }
    });
    GetLikeMovies();
}

//https://medium.com/@frontman/%D0%B4%D0%B5%D0%B4%D1%83%D0%BF%D0%BB%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D1%8F-%D0%B8-%D1%81%D0%BB%D0%B8%D1%8F%D0%BD%D0%B8%D0%B5-%D0%BC%D0%B0%D1%81%D1%81%D0%B8%D0%B2%D0%BE%D0%B2-c2706948c200
//получение названий фильмов в массив
function GetLikeMovies() {
    $.ajax({
        url: "/users",
        type: "GET",
        contentType: "application/json",
        success: function (users) {
            //console.log('bUs3',betterUsers)
            while (betterUsers.length > 0) {
                $.each(users, function (index, user) {
                    if (user.login == betterUsers[0]) {
                        console.log('login', user.login)
                        for (ii = 0; ii < userView.length; ii++) {
                            for (jj = 0; jj < user.like.length; jj++) {
                                if (user.like[jj] == userView[ii]) {
                                    //удаление просмотренного фильма
                                    user.like.splice(jj, 1);
                                    continue;
                                }
                            }
                        }
                        for (i = 0; i < user.like.length; i++) {
                            if (likeFilms.length < 50) likeFilms = Array.from(new Set(likeFilms.concat(user.like[i])))
                        }
                    };
                });
                if (likeFilms.length == 50) break;
                betterUsers.splice(0, 1);
            }
            console.log('likeFilms', likeFilms)
            DisplayRecomended();
        }
    })
}

//вывод ВСЕХ рекомендуемых
function DisplayRecomended() {
    let dontViewFilms = likeFilms;
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
            while ((dontViewFilms.length > 0) && (viewFilms < 10)) {
                flag = 0;
                $.each(movies, function (index, movie) {
                    if (dontViewFilms[0] == movie.title) {
                        carts += cart(movie);
                        viewFilms++;
                        flag = 1;
                    }
                })
                if (flag == 1) dontViewFilms.splice(0, 1);
            }
            console.log('viewFilms', viewFilms)
            console.log('dontViewFilms', dontViewFilms)
            $(".films").append(carts);
            $('#films-more').empty();
            $('#films-more').append('<button onclick="DisplayRecomended()" class="btn-color btn-more">Показать ещё</button>');
        }
    })
}
CheckGenre();/*
SortUsers();
GetLikeMovies();*/