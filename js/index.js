let allTitleMovie = [];
let findMovies = [];
let getMovies = [];
let allViewFilms = [];
//не более 3х выбранных жанров
$('.boxGenre:checkbox').click(function () {
    if ($('.boxGenre:checkbox:checked').length > 3) {
        return false;
    }
})

//горизонтальный слайдер boxYear
$(function () {
    $("#slider-range").slider({
        range: true,
        min: 1950,
        max: 2020,
        values: [1950, 2020],
        slide: function (event, ui) {
            $("#year1").val(ui.values[0]);
            $("#year2").val(ui.values[1]);
        }
    });
    $("#year1").val($("#slider-range").slider("values", 0));
    $("#year2").val($("#slider-range").slider("values", 1));
});

//отправка формы и получение готового списка бла бла бла хочу спать
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
    if (checkedCountry.length == 0)
        $('.boxCountry:checkbox').each(function () {
            checkedCountry.push($(this).val())
        }); 
    //года
    let checkedYear = [];
    $('.boxYear:text').val(function () {
        checkedYear.push($(this).val())
    });
    if (checkedYear[1] == 0) {
        checkedYear[1] = 2050;
    }
    for (i = 0; i < checkedYear.length; i++) {
        checkedYear[i] = Number(checkedYear[i])
    }
    
    //сортировка
    let checkedSort = "";
    checkedSort = $('.boxSort:radio:checked').val();

    console.log('Выбрано:', checkedGenre, checkedYear, checkedCountry, checkedSort)
    $.ajax({
        url: "/movies",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            genreM: checkedGenre,
            yearM: checkedYear,
            sortM: checkedSort,
            countryM: checkedCountry
        }),
        success: function (movies) {
            findMovies = movies;
            console.log('findMovies', findMovies);
            //получение названий фильмов в массив allTitleMovie
            i = 0;
            $.each(findMovies, function (index, movie) {
                allTitleMovie[i] = movie.title;
                i++;
            })
            $('.films').empty();
            GetFilterMovie();
        }
    })
});

function GetFilterMovie() {
    let dontViewFilms = allTitleMovie;
    let flag = 0;
    let carts = "";
    let viewFilms = 0;
    while ((dontViewFilms.length > 0) && (viewFilms < 5)) {
        flag = 0;
        $.each(findMovies, function (index, movie) {
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

    $('.films').append(carts);
    $('#films-more').empty();
    $('#films-more').append('<button onclick="GetFilterMovie()" class="btn-color btn-more">Показать ещё</button>');
}


function GetMovies1() {
    $.ajax({
        url: "/movies",
        type: "GET",
        contentType: "application/json",
        success: function (movies) {
            $.each(movies, function (index, movie) {
                //записываем названия всех выводимых фильмов в allViewFilms
                allViewFilms[index] = movie.title;
            });
            getMovies = movies;
            GetMovies2();
        }
    });
}

// Получение всех фильмов
function GetMovies2() {
    let carts = "";
    let viewFilms = 0;
    let dontViewFilms = allViewFilms;
    while ((dontViewFilms.length > 0) && (viewFilms < 10)) {
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
    $('#films-more').append('<button onclick="GetMovies2()" class="btn-color btn-more">показать больше</button>');
}
GetMovies1()