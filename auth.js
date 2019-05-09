
//$("#login").text()
$('.register-button').on('click', function (e) {
    e.preventDefault();

    var data = {
        login: $('#register-login').val(),
        password: $('#register-password').val(),
        password2: $('#register-password2').val()
    }

    $.ajax({
        url: "/register",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify(data),
        success: function (result) {
            if (result.registerCompvared) {
                $('.report-reg').empty();
                $('.report-reg-err').empty();
                $('.report-reg').append('Регистрация успешна!')
                setInterval(function() {
                    location.reload();
                   }, 1500);
            } else {
                $('.report-reg-err').empty();
                $('.report-reg-err').append(result.registerError)
            }
        }
    })
})



$('.login-button').on('click', function (e) {
    e.preventDefault();

    var data = {
        login: $('#login-login').val(),
        password: $('#login-password').val()
    }

    $.ajax({
        url: "/login",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify(data),
        success: function (result) {
            if (result.loginCompvared) {
                $('.report-log').empty();
                $('.report-log-err').empty();
                $('.report-log').append('Авторизация успешна!')
                setInterval(function() {
                    location.reload();
                   }, 1500);
            } else {
                $('.report-log-err').empty();
                $('.report-log-err').append(result.loginError)
            }
        }
    })
});

function errorLogin() {
    $('.report-reg-err').empty();
    $('.report-reg-err').append("ошибка!")
}
