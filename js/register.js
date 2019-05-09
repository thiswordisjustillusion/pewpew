jQuery.fn.center = function () {
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}
let username = $("#login").text();

$(".auth-register").center();

function PopUpShow(){
    $("#overlay").show();
    $(".auth-register").show();
    $("body").css("overflow", "hidden")
    $(".auth-register").css("display", "flex")
    let arr = $("input[type = 'text']"); for (i in arr ) { arr[i].value="" }
    let arr2 = $("input[type = 'password']"); for (i in arr2 ) { arr2[i].value="" }
}

function PopUpHide(){
    $("#overlay").hide();
    $(".auth-register").hide();
    $("body").css("overflow", "");
    let arr = $("input[type = 'text']"); for (i in arr ) { arr[i].value="" }
    let arr2 = $("input[type = 'password']"); for (i in arr2 ) { arr2[i].value="" }
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

$('#overlay').click(function () {
    PopUpHide();
})
