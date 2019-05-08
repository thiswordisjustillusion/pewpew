jQuery.fn.center = function () {
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}
let username = $("#login").text();

$(".auth-register").center();

$(document).ready(function(){
    //Скрыть PopUp при загрузке страницы    
    PopUpHide();
});

function PopUpShow(){
    $("#overlay").show();
    $(".auth-register").show();
}

function PopUpHide(){
    $("#overlay").hide();
    $(".auth-register").hide();
}

function Quit(){
    //удаление сессии
    $.ajax({
        url: "/logout",
        contentType: "application/json",
        method: "POST"
    })
    location.reload();
}


