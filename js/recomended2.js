let likeFilms = [];
let genreJ = [];
let genres = [];

//находим нашего юзера и запоминаем его осн. жанры
function CheckGenre() {
    if ($("#login").text() == '') {
        $(".films").append(
            '<h2>Необходимо авторизироваться для просмотра рекомендаций</h2>'
        );
    } else {
        let nGenres = 0;
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
                    if (user.login == $("#login").text()) {
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
                        console.log('genres', genres, genreJ)
                    }
                });
            }
        });
        GetRecomended()
    }
}
//сравниваем жанры пользователя и жанры фильмов из бд 
//если есть совпадение по трём жанрам, то выводим фильм
function GetRecomended() {
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
            DisplayRecomended()
        }
    })
}

function DisplayRecomended() {
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
            $('#films-more').append('<button onclick="DisplayRecomended()" class="btn-color btn-more">Показать ещё</button>');
        }
    })
}

CheckGenre();