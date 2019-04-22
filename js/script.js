//поиск
$("#btn-search").click(function () {
    let letSearch = "", Scarts = "";
    $('#IDsearch:text').val(function () {
        letSearch += ($(this).val())
    });
    $.ajax({
        url: "/search",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            searchM: letSearch
        }),
        success: function (sumSearch) {
            $.each(sumSearch, function (index, search) {
                Scarts += cart(search);
            })
            $(".content").empty();
            $("#films-more").empty();
            $(".content").append("<div class='films'>" + Scarts + "</div>");
        }
    })
});

// вывод фильмов
let cart = function (movie) {
    movie.genre[0] += ' '
    movie.genre[1] += ' '
    return "<div class='cart' id='" + movie._id + "'>" +
        "<a class='title' href='/movie/" + movie.title + "'><div>" + movie.title_rus + "</br>" +
        "</div><img src='/public/img/" + movie.img + "' /></a></div>";
}

