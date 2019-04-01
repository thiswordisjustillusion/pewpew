// Получение всех фильмов
function GetMovies() {
    $.ajax({
        url: "/movies",
        type: "GET",
        contentType: "application/json",
        success: function (movies) {
            var carts = "";
            $.each(movies, function (index, movie) {
                // добавляем полученные элементы
                carts += cart(movie);
            })
            $(".films").append(carts);
        }
    });
}

// вывод фильмов
var cart = function (movie) {
    return "<div class='cart' id='" + movie._id + "'>" +
        "<a class='title' href=''>" + movie.title + "</a></br>" +
        "<img src='/img/" + movie.img + "' /></br>" +
        movie.genre +
        "</div>";
}