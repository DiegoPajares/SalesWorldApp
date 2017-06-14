// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
    swipeBackPage: false,
    swipeBackPageThreshold: 1,
    swipePanel: "left",
    swipePanelCloseOpposite: true,
    pushState: true,
    pushStateRoot: undefined,
    pushStateNoAnimation: false,
    pushStateSeparator: '#!/',
    template7Pages: true
});


// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false
});


$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();
});

myApp.onPageInit('index', function (page) {
    if (login == 1) {
        console.log("Logueado");
    }
});

myApp.onPageInit('asistencia', function (page) {

    if (idGrupoCampo != null) {
        $.ajax({
            url: "http://www.salesworldperu.com/intranet/Appservices/lista_trabajadoresGrupo?idGrupo=" + idGrupoCampo,
            dataType: 'json',
            type: 'GET',
            beforeSend: function () {
                $.LoadingOverlay("show");
            },
            success: function (response) {
                var html = "";
                html += '<option value="0">Elija un Encargado</option>';
                $(response).each(function (i, vendedor) {
                    html += '<option value="' + vendedor.idTrabajador + '">' + vendedor.nombres + ' ' + vendedor.apaterno + ' ' + vendedor.amaterno + '</option>';
                });
                $("#cmbVendedoresGrupo").html(html);
                $.LoadingOverlay("hide");
            },
            error: function (response) {
                console.log("Error");
                $.LoadingOverlay("hide");
            }
        });
    } else {
        $.LoadingOverlay("show");
        var html = '<option value="' + idUsuario + '">' + NombreCompleto + '</option>';
        $("#cmbVendedoresGrupo").html(html);
        $.LoadingOverlay("hide");
    }
    $("#btnRegistrar").click(function () {
        idVendedor = $("#cmbVendedoresGrupo").val();
        if ($("#txtNroChip").val() != '') {
            var lat = 0, long = 0;
            $("#btnRegistrar").prop('disabled', true);
            $.LoadingOverlay("show");
            //------------------------------------------------------------------------
            var onSuccess = function (position) {
                lat = position.coords.latitude;
                long = position.coords.longitude;

                var nroChip = $("#txtNroChip").val();
                $.ajax({
                    url: "http://www.salesworldperu.com/intranet/Appservices/ventachip",
                    type: "POST",
                    async: true,
                    data: {
                        nrochip: nroChip,
                        idvendedor: idVendedor,
                        latitud: lat,
                        longitud: long
                    },
                    success: function (data)
                    {
                        $("#txtNroChip").val('');
                        $("#btnRegistrar").prop('disabled', false);
                        if (data == 'Activo') {
                            myApp.alert('Venta Realizada', 'Sales World');
                        } else
                        if (data == 'Inactivo') {
                            myApp.alert('El número ya no se encuentra disponible para la venta.', 'Sales World');
                        } else
                        if (data == 'Noregistrado') {
                            myApp.alert('Número no registrado en el sistema', 'Sales World');
                        }
                    },
                    error: function (e)
                    {
                        $("#txtNroChip").val('');
                        $("#btnRegistrar").prop('disabled', false);
                        myApp.alert('No fué posible realizar la venta.', 'Hubo un error!');
                    }
                });
                $.LoadingOverlay("hide");
            };
            function onError(error) {
                //alert('code: ' + error.code + '\n' +
                //        'message: ' + error.message + '\n');
                myApp.alert('Error al obtener la posición de su GPS', 'Hubo un error!');
                $("#txtNroChip").val('');
                $("#btnRegistrar").prop('disabled', false);
                $.LoadingOverlay("hide");
            }
            var options = {
                enableHighAccuracy: true
            };
            navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
            //------------------------------------------------------------------------

        } else {
            myApp.alert('Debe llenar el campo número de celular.', 'Datos Incompletos!');
        }
    });
});

$$(document).on('pageInit', function (e) {

    $(".swipebox").swipebox();
    $("#ContactForm").validate({
        submitHandler: function (form) {
            ajaxContact(form);
            return false;
        }
    });

    $("#RegisterForm").validate();
    $("#LoginForm").validate();
    $("#ForgotForm").validate();

    $('a.backbutton').click(function () {
        parent.history.back();
        return false;
    });


    $(".posts li").hide();
    size_li = $(".posts li").size();
    x = 4;
    $('.posts li:lt(' + x + ')').show();
    $('#loadMore').click(function () {
        x = (x + 1 <= size_li) ? x + 1 : size_li;
        $('.posts li:lt(' + x + ')').show();
        if (x == size_li) {
            $('#loadMore').hide();
            $('#showLess').show();
        }
    });


    $("a.switcher").bind("click", function (e) {
        e.preventDefault();

        var theid = $(this).attr("id");
        var theproducts = $("ul#photoslist");
        var classNames = $(this).attr('class').split(' ');


        if ($(this).hasClass("active")) {
            // if currently clicked button has the active class
            // then we do nothing!
            return false;
        } else {
            // otherwise we are clicking on the inactive button
            // and in the process of switching views!

            if (theid == "view13") {
                $(this).addClass("active");
                $("#view11").removeClass("active");
                $("#view11").children("img").attr("src", "images/switch_11.png");

                $("#view12").removeClass("active");
                $("#view12").children("img").attr("src", "images/switch_12.png");

                var theimg = $(this).children("img");
                theimg.attr("src", "images/switch_13_active.png");

                // remove the list class and change to grid
                theproducts.removeClass("photo_gallery_11");
                theproducts.removeClass("photo_gallery_12");
                theproducts.addClass("photo_gallery_13");

            } else if (theid == "view12") {
                $(this).addClass("active");
                $("#view11").removeClass("active");
                $("#view11").children("img").attr("src", "images/switch_11.png");

                $("#view13").removeClass("active");
                $("#view13").children("img").attr("src", "images/switch_13.png");

                var theimg = $(this).children("img");
                theimg.attr("src", "images/switch_12_active.png");

                // remove the list class and change to grid
                theproducts.removeClass("photo_gallery_11");
                theproducts.removeClass("photo_gallery_13");
                theproducts.addClass("photo_gallery_12");

            } else if (theid == "view11") {
                $("#view12").removeClass("active");
                $("#view12").children("img").attr("src", "images/switch_12.png");

                $("#view13").removeClass("active");
                $("#view13").children("img").attr("src", "images/switch_13.png");

                var theimg = $(this).children("img");
                theimg.attr("src", "images/switch_11_active.png");

                // remove the list class and change to grid
                theproducts.removeClass("photo_gallery_12");
                theproducts.removeClass("photo_gallery_13");
                theproducts.addClass("photo_gallery_11");

            }

        }

    });


})

myApp.onPageInit('autocomplete', function (page) {
    var fruits = ('Apple Apricot Avocado Banana Melon Orange Peach Pear Pineapple').split(' ');
    var autocompleteDropdownSimple = myApp.autocomplete({
        input: '#autocomplete-dropdown',
        openIn: 'dropdown',
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Find matched items
            for (var i = 0; i < fruits.length; i++) {
                if (fruits[i].toLowerCase().indexOf(query.toLowerCase()) >= 0)
                    results.push(fruits[i]);
            }
            // Render items by passing array with result items
            render(results);
        }
    });
});
