let username = "PewpoMan";
let likeFilms = [];
let genreJ = [];
let genres = [];

//находим нашего юзера и запоминаем его осн. жанры
function CheckGenre() {
    //genreI - номера жанров (после сортировки они "слетают", поэтому сохраняем их в отдельный массив)
    let genreI = [];
    //genreJ - значения жанров

    let strgenres = "";
    let nGenres = 0;
    let flag = 0;
    let userView = [];
    let max = 0;
    let nmax = 0;
    $.ajax({
        url: "/users",
        type: "GET",
        contentType: "application/json",
        success: function (users) {
            let max = 0;
            let nmax = "";
            $.each(users, function (index, user) {
                nGenres = 0;
                //нахождение текущего пользователя
                if (user.login == username) {
                //нахождение 4х жанров с максимальным значением
                    while (nGenres < 4) {
                        max = 0;
                //определение жанра с максимальным значением 
                        for (i = 0; i < 10; i++) {
                            if (user.genrep[i] > max) {
                                max = user.genrep[i];
                                nmax = i;
                            }
                        }
                        genreJ[nmax] = max;
                        nGenres++;
                        delete user.genrep[nmax];
                    }
                    //запись ID жанра
                    genres = Object.keys(genreJ)
                }
            });
        }
    })
}
//сравниваем жанры пользователя и жанры фильмов из бд 
//если есть совпадение по трём жанрам, то выводим фильм
function GetRecomended1() {
    $.ajax({
        url: "/movies",
        type: "GET",
        contentType: "application/json",
        success: function (movies) {
            $.each(movies, function (index, movie) {
                flag = 0;
                for (i = 0; i < 3; i++)
                    for (j = 0; j < 4; j++)
                        if (genres[j] == movie.genreN[i]) {
                            flag++;
                            continue
                        }
                if (flag == 3) {
                    console.log('ID жанров фильма', movie.genreN)
                    console.log('Фильм:', movie)
                    likeFilms = Array.from(new Set(likeFilms.concat(movie.title)));
                    console.log(likeFilms)
                }
            })
            console.log('likeFilms', likeFilms)
            GetRecomended2()
        }
    })
}

function GetRecomended2() {
    let likeFilms2 = likeFilms;
    console.log('likeFilms2', likeFilms)
    let flag = 0;
    $.ajax({
        url: "/movies",
        type: "GET",
        contentType: "application/json",
        success: function (movies) {
            var carts = "";
            let vivFilms = 0;
            //в vivFilms хранится количество выведенных фильмов
            //в likeFilms2 хранятся не выведенные фильмы
            //таким образом, можно написать скрипт, который будет 
            //"довыводить" фильмы по запросу пользователя
            while ((likeFilms2.length > 0) && (vivFilms < 5)) {
                flag = 0;
                $.each(movies, function (index, movie) {
                    if (likeFilms[0] == movie.title) {
                        carts += cart(movie);
                        vivFilms++;
                        flag = 1;
                    }
                })
                if (flag == 1) likeFilms2.splice(0, 1);
                //console.log('length',likeFilms2.length)
            }
            console.log('vivFilms', vivFilms)
            console.log('likeFilms2', likeFilms2)
            $(".films").append(carts);
            $('#films-more').empty();
            $('#films-more').append('<button onclick="GetRecomended2()">Показать ещё</button>');
        }
    })
}

CheckGenre();
GetRecomended1();