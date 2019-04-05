//инициализация глобальных переменных
let allTitleMovie = [], countryGenre = [], getMovies = [], allViewFilms = [];

//записываем названия всех фильмов и производим первоначальный 
//вывод viewFilms фильмов на index.html
function GetMovies1() {
    $.ajax({
        url: "/movies",
        type: "GET",
        contentType: "application/json",
        success: function (movies) {
            let carts = "";
            let viewFilms = 0;
            $.each(movies, function (index, movie) {
                //записываем названия всех выводимых фильмов в allViewFilms
                allViewFilms[index] = movie.title;
            });
            getMovies = movies;
            GetMovies2();
        }
    });
}
//вывод viewFilms фильмов на страничку index.html
function GetMovies2() {
    let carts = "";
    let viewFilms = 0;
    let dontViewFilms = allViewFilms;
    while ((dontViewFilms.length > 0) && (viewFilms < 5)) {
        flag = 0;
        $.each(getMovies, function (index, movie) {
            if (dontViewFilms[0] == movie.title) {
                // добавляем полученные элементы
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
    $('#films-more').append('<button onclick="GetMovies2()">Показать ещё</button>');   
}

//одновременный выбор не более трёх жанров 
$('.boxGenre:checkbox').click(function(){
    if ($('.boxGenre:checkbox:checked').length > 3){
        return false;
    }
})
//отправка формы для фильтрации и сортировки
$("#btn-genre").click(function () {
    //жанры
    let checkedGenre = [];
    $('.boxGenre:checkbox:checked').each(function () {
        checkedGenre.push($(this).val())
    });
    for (i = 0; i < checkedGenre.length; i++) {
        checkedGenre[i] = Number(checkedGenre[i])
    }
    //страны
    let checkedCountry = [];
    $('.boxCountry:checkbox:checked').each(function () {
        checkedCountry.push($(this).val())
    });
    //года
    let checkedYear = [];
    $('.boxYear:text').val(function () {
        checkedYear.push($(this).val())
    });
    for (i = 0; i < checkedYear.length; i++) {
        checkedYear[i] = Number(checkedYear[i])
    }
    //сортировка
    let checkedSort = "";
    checkedSort = $('.boxSort:radio:checked').val();

    //console.log('Выбрано:', checkedGenre, checkedCountry, checkedYear, checkedSort)
    $.ajax({
        url: "/movies",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            genreM: checkedGenre,
            yearM: checkedYear,
            sortM: checkedSort
        }),
        success: function (movies) {
            let flag = 0;
            let j = 0;
            let countryCheck = [];

            //отборка N выбранных стран (в countryCheck)
            if (checkedCountry.length > 0) {
                $.each(movies, function (index, movie) {
                    flag = 0;
                    for (i = 0; i < checkedCountry.length; i++) {
                        if (movie.country == checkedCountry[i]) {
                            flag = 1;
                            countryCheck[j] = true;
                            break;
                        }
                    }
                    j++;
                })
                //запись выбранных стран в массив counryGenre
                j = 0;
                console.log('countryCheck', countryCheck)
                for (i = 0; i < movies.length; i++) {
                    if (countryCheck[i]) {
                        countryGenre[j] = movies[i];
                        j++;
                    }
                }
                console.log('movies', movies)
            } else countryGenre = movies;
            console.log('countryGenre', countryGenre);
            //получение названий фильмов в массив allTitleMovie
            i = 0;
            $.each(countryGenre, function (index, movie) {
                allTitleMovie[i] = movie.title;
                i++;
            })
            console.log('Title отфильтрованных фильмов', allTitleMovie)
            $('.films').empty();
            GetFilterMovie();
        }
    })
});
//получение viewFilms записей фильтрации и сортировки по кнопке "Показать ещё"
function GetFilterMovie() {
    let dontViewFilms = allTitleMovie;
    let flag = 0;
    let carts = "";
    let viewFilms = 0;
    while ((dontViewFilms.length > 0) && (viewFilms < 3)) {
        flag = 0;
        $.each(countryGenre, function (index, movie) {
            if (dontViewFilms[0] == movie.title) {
                carts += cart(movie);
                viewFilms++;
                flag = 1;
            }
        })
        if (flag == 1) dontViewFilms.splice(0,1);
    }
    console.log('viewFilms', viewFilms)  
    console.log('dontViewFilms', dontViewFilms)
    
    $('.films').append(carts);
    $('#films-more').empty();
    $('#films-more').append('<button onclick="GetFilterMovie()">Показать ещё</button>');
}