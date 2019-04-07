//поиск
$("#btn-search").click(function () {
    let letSearch = "";
    let Scarts = "";
    $('#IDsearch:text').val(function () {
        letSearch += ($(this).val())
    });
    console.log('letSearch', letSearch)
    $.ajax({
        url: "/search",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            searchM: letSearch
        }),
        success: function (sumSearch) {
            $.each(sumSearch, function (index, search) {
                console.log('search', search);
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
        "<a class='title' href='/movie/" + movie.title + "'>" + movie.title_rus + "</br>" +
        "<img src='/public/img/" + movie.img + "' /></a></br>" +
        movie.genre + "</br> Рейтинг: " + movie.rating + "</div>";
}