//$("#login").text()
$('.register-button').on('click', function (e) {
    e.preventDefault();
    let login = $('#register-login').val(),
        password = $('#register-password').val(),
        password2 = $('#register-password2').val();

    var data = {
        login: login,
        password: password,
        password2: password2
    }

    if (/^[a-zA-Z0-9-_]*$/.test(login) == false) {
        $('.report-reg-err').empty();
        $('.report-reg-err').append('Логин содержит недопустимые символы')
    } else if ((/^[a-zA-Z0-9-_]*$/.test(password) == false) || ((/^[a-zA-Z0-9-_]*$/.test(password2) == false))) {
        $('.report-reg-err').empty();
        $('.report-reg-err').append('Пароль содержит недопустимые символы')
    } else {
        $.ajax({
            url: "/register",
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify(data),
            success: function (result) {
                if (result.registerCompleted) {
                    $('.report-reg').empty();
                    $('.report-reg-err').empty();
                    $('.report-reg').append('Регистрация успешна!')
                    setInterval(function () {
                        location.reload();
                    }, 1500);
                } else {
                    $('.report-reg-err').empty();
                    $('.report-reg-err').append(result.registerError)
                }
            }
        })
    }
})



$('.login-button').on('click', function (e) {
    e.preventDefault();

    let login = $('#login-login').val(),
        password = $('#login-password').val();

    var data = {
        login: login,
        password: password
    }

    if (/^[a-zA-Z0-9-_]*$/.test(login) == false) {
        $('.report-reg-err').empty();
        $('.report-reg-err').append('Логин содержит недопустимые символы')
    } else if (/^[a-zA-Z0-9-_]*$/.test(password) == false) {
        $('.report-reg-err').empty();
        $('.report-reg-err').append('Пароль содержит недопустимые символы')
    } else {
    $.ajax({
        url: "/login",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify(data),
        success: function (result) {
            if (result.loginCompleted) {
                $('.report-log').empty();
                $('.report-log-err').empty();
                $('.report-log').append('Авторизация успешна!')
                setInterval(function () {
                    location.reload();
                }, 1500);
            } else {
                $('.report-log-err').empty();
                $('.report-log-err').append(result.loginError)
            }
        }
    });
}});

function errorLogin() {
    $('.report-reg-err').empty();
    $('.report-reg-err').append("ошибка!")
}
