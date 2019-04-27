const userlogin = "PewpoMan";
//VIEW FILM:
$("#play").click(function () {
    const title = $("#title_eng").text();
    $.ajax({
        url: "/users",
        type: "GET",
        contentType: "application/json",
        success: function (users) {
            flag = 0;
            $.each(users, function (index, user) {
                if (user.login == userlogin)
                    for (i = 0; i < user.view.length; i++)
                        if (user.view[i] == title) {
                            flag = 1;
                            break;
                        }
            })
            if (flag == 0) {
                let view = 0;
                $.ajax({
                    url: "/movie-view/:title",
                    contentType: "application/json",
                    method: "PUT",
                    data: JSON.stringify({
                        title: title,
                        userlogin: userlogin
                    }),
                    success: function (movie) {
                        view = movie.views;
                        $("#span_view").empty();
                        $("#span_view").append(view)
                    }
                })
            }
        }
    })
})

//LIKE FILM:
function ChengeLike() {
    //"вытаскиваем" название фильма, имя пользователя и количество "лайков" фильма
    const title = $("#title_eng").text()
    //let like = Number($("#span_like").text());
    genreN[0] = Number($("#genreN0").text());
    genreN[1] = Number($("#genreN1").text());
    genreN[2] = Number($("#genreN2").text());
    //проверка пользователя: был ли им уже отмечен фильм:
    $.ajax({
        url: "/users",
        type: "GET",
        contentType: "application/json",
        success: function (users) {
            flag = 0;
            $.each(users, function (index, user) {
                //выбор записи бд текущего пользователя
                if (user.login == userlogin) {
                    //поиск выбранного фильма среди понравившихся
                    for (i = 0; i < user.like.length; i++) {
                        if (user.like[i] == title) {
                            //фильм уже был отмечен пользователем
                            flag = 1;
                            break;
                        }
                    }
                }
            });
            if (flag == 0) {
                //фильм не был отмечен пользователем
                const status = 1;
                $.ajax({
                    url: "/movie/:title",
                    contentType: "application/json",
                    method: "PUT",
                    data: JSON.stringify({
                        title: title,
                        userlogin: userlogin,
                        genreN: genreN,
                        status: status
                    }),
                    success: function (movie) {
                        $("#span_like").empty();
                        $("#span_like").append(movie.like)
                        $('#span_like').removeClass('likeN');
                        $('#span_like').addClass('likeY');
                        $(".img-like").remove();
                        $("#div-like").prepend('<img class="img-like" src="/public/img/likeY.png" style="width: 27px; height: 25px;"/>')
                    }
                });
            } else {
                //фильм уже был отмечен пользователем
                const status = -1;
                $.ajax({
                    url: "/movie/:title",
                    contentType: "application/json",
                    method: "PUT",
                    data: JSON.stringify({
                        status: status,
                        title: title,
                        userlogin: userlogin,
                        genreN: genreN
                    }),
                    success: function (movie) {
                        $("#span_like").empty();
                        $("#span_like").append(movie.like)
                        $('#span_like').removeClass('likeY');
                        $('#span_like').addClass('likeN');
                        $(".img-like").remove();
                        $("#div-like").prepend('<img class="img-like" src="/public/img/likeN.png" style="width: 27px; height: 25px;"/>')
                    }
                });
            }
        }
    })
}
$("#span_like").click(function () {
    ChengeLike();
});
$("#div-like").click(function () {
    ChengeLike();
});

function CheckLike() {
    const title = $("#title_eng").text()
    let flag = 0;
    $.ajax({
        url: "/users",
        type: "GET",
        contentType: "application/json",
        success: function (users) {
            $.each(users, function (index, user) {
                if (user.login == userlogin) {
                    flag = 0;
                    console.log(user.login, title)
                    for (i = 0; i < user.like.length; i++) {
                        if (user.like[i] == title) {
                            //фильм уже был отмечен пользователем
                            console.log(user.like[i])
                            flag = 1;
                        }
                    }
                    if (flag == 1) {
                        $('#span_like').removeClass('likeN');
                        $('#span_like').addClass('likeY');
                        $(".img-like").remove();
                        $("#div-like").prepend('<img class="img-like" src="/public/img/likeY.png" style="width: 27px; height: 25px;"/>')
                    } else {
                        $('#span_like').removeClass('likeY');
                        $('#span_like').addClass('likeN');
                        $(".img-like").remove();
                        $("#div-like").prepend('<img class="img-like" src="/public/img/likeN.png" style="width: 27px; height: 25px;"/>')
                    }
                }
            });
        }
    })
};

CheckLike();


