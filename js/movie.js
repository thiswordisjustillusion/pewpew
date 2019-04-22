const userlogin = "PewpoMan";
CheckLike();
//VIEW FILM:
$("#play").click(function () {
    const title = $("#title_eng").text();
    let view = Number($("#span_view").text());
    console.log(view)
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
                $.ajax({
                    url: "/movie-view/:title",
                    contentType: "application/json",
                    method: "PUT",
                    data: JSON.stringify({
                        title: title,
                        userlogin: userlogin
                    })
                })
                view++;
                $("#span_view").empty();
                $("#span_view").append(view)
            }
        }
    })
})





//LIKE FILM:
$("#like").click(function () {
    //"вытаскиваем" название фильма, имя пользователя и количество "лайков" фильма
    const title = $("#title_eng").text()
    let like = Number($("#span_like").text());
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
                    })
                });
                like++;
                $("#span_like").empty();
                $("#span_like").append(like)
                $('#like').removeClass('likeN');
                $('#like').addClass('likeY');
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
                    })
                });
                like--;
                $("#span_like").empty();
                $("#span_like").append(like)
                $('#like').toggleClass('likeN');

                $('#like').removeClass('likeY');
                $('#like').addClass('likeN');
            }
        }
    })
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
                        $('#like').removeClass('likeN');
                        $('#like').addClass('likeY');
                    } else {
                        $('#like').removeClass('likeY');
                        $('#like').addClass('likeN');
                    }
                }
            });
        }
    })
}


