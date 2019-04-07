let allTitleMovie = [];
        let countryGenre = [];
        let getMovies = [];
        let allViewFilms = [];
    //не более 3х выбранных жанров
        $('.boxGenre:checkbox').click(function(){
            if ($('.boxGenre:checkbox:checked').length > 3){
                return false;
            }
        })
        
//отправка формы и получение готового списка бла бла бла хочу спать
    $("#btn-genre").click(function () {
        //жанры
        let checkedGenre = [];
        $('.boxGenre:checkbox:checked').each(function(){
            checkedGenre.push($(this).val())
        });
        for (i=0; i < checkedGenre.length; i++) {
            checkedGenre[i] = Number(checkedGenre[i])
        }
        //страны
        let checkedCountry = [];
        $('.boxCountry:checkbox:checked').each(function(){
            checkedCountry.push($(this).val())
        });
        //года
        let checkedYear = [];
        $('.boxYear:text').val(function(){
            checkedYear.push($(this).val())
        });
        for (i=0; i < checkedYear.length; i++) {
            checkedYear[i] = Number(checkedYear[i])
        }
        //сортировка
        let checkedSort = "";
        checkedSort = $('.boxSort:radio:checked').val();

        console.log('Выбрано:',checkedGenre, checkedCountry, checkedYear, checkedSort)
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
                    j=0;
                    console.log('countryCheck',countryCheck)
                    for (i=0; i<movies.length; i++) {
                        if (countryCheck[i]) {
                            countryGenre[j] = movies[i];
                            j++;
                        }
                    }
                    console.log('movies', movies)
                } else countryGenre = movies;
                console.log('countryGenre',countryGenre);
                //получение названий фильмов в массив allTitleMovie
                i = 0;
                $.each(countryGenre, function (index, movie) {
                    allTitleMovie[i] = movie.title;
                    i++;
                })
                console.log('Title отфильтрованных фильмов',allTitleMovie)
                $('.films').empty();
                GetFilterMovie ();
                }
            })
        });

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

    // Получение всех фильмов
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

    /////////////////поиск
    $("#btn-search").click(function () {
        let letSearch = "";
        let Scarts = "";
        $('#IDsearch:text').val(function(){
            letSearch += ($(this).val())
        });
        console.log('letSearch',letSearch)
        $.ajax({
                url: "/search",
                contentType: "application/json",
                method: "POST",
                data: JSON.stringify({
                    searchM: letSearch
                }),
                success: function (sumSearch) {
                    $.each(sumSearch, function (index, search) {
                        console.log('search',search);
                        Scarts += cart(search);
                    })    
                $(".films").empty();
                $("#films-more").empty();
                $(".films").append(Scarts);
                }
            })
    });

    // вывод фильмов
    let cart = function (movie) {
        return "<div class='cart' id='" + movie._id + "'>" +
            "<a class='title' href='/movie/" + movie.title + "'>" + movie.title + "</br>" +
            "<img src='/public/img/" + movie.img + "' /></a></br>" +
            movie.genre + "</br> Рейтинг: " + movie.rating +
            "</br> Режиссёр: " + movie.actors +
            "</div>";
    }
    GetMovies1();