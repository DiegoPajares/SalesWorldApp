/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        //****************************************************************************
        //Subscribir a Grupo VENTAS
        window.FirebasePlugin.subscribe("ventas");
        //****************************************************************************
        window.FirebasePlugin.getToken(function (token) {
            console.log("getToken:");
            console.log(token);
        }, function (error) {
            console.error(error);
        });
        //****************************************************************************
        window.FirebasePlugin.onNotificationOpen(function (notification) {
            console.log("Notification Opened:");
            console.log(notification);
            app.enviarNotificacion();
        }, function (error) {
            console.log(error);
        });
        //****************************************************************************
        if (login == 0) {
            $$("#btnLogin").click();

            $('#frmLogin').on('submit', (function (e) {

                var usuario = $("#txtUsuario").val();
                var clave = $("#txtClave").val();

                e.preventDefault();
                $.ajax({
                    url: "http://www.salesworldperu.com/intranet/Appservices/login?usuario=" + usuario + "&clave=" + clave,
                    type: "GET",
                    dataType: 'json',
                    contentType: false,
                    cache: false,
                    processData: false,
                    beforeSend: function ()
                    {
                        $.LoadingOverlay("show");
                    },
                    success: function (data)
                    {
//                            console.log(data);
                        if (data != null) {
                            $("#txtNombreUsuario").text(data.nombres);
                            $$("#btnLoginClose").click();
//                                idUsuario = data.idUsuario;
                            storage.setItem('idUsuario', data.idUsuario);
                            idUsuario = storage.getItem('idUsuario');
                            idGrupoCampo = data.idGrupoCampo;
                            NombreCompleto = data.nombres + ' ' + data.apaterno + ' ' + data.amaterno;
                            //****************************************************************************
                            window.FirebasePlugin.onTokenRefresh(function (token) {
                                // save this server-side and use it to push notifications to this device
                                console.log("Refresh Token");
                                console.log(token);

                                if (token != data.tokenFirebase) {
                                    $.ajax({
                                        url: "http://www.salesworldperu.com/intranet/Appservices/insertarTokenUsuario",
                                        type: "POST",
                                        async: true,
                                        data: {
                                            token: token,
                                            uuid: '1234567890',
                                            idusuario: idUsuario
                                        },
                                        success: function (data)
                                        {
                                            console.log("Token Actualizado");
                                            app.enviarNotificacion();
                                        },
                                        error: function (e)
                                        {
                                            console.log("Token Upd Error");
                                        }
                                    });
                                } else {
                                    app.enviarNotificacion();
                                }

                            }, function (error) {
                                console.error(error);
                            });
                            //****************************************************************************
                        } else {
                            myApp.alert('Usuario o contraseña incorrectos', 'Hubo un error!');
                        }
                        $.LoadingOverlay("hide");
                    },
                    error: function (e)
                    {
                        myApp.alert('Revise su conexion a internet', 'Hubo un error!');
                        $.LoadingOverlay("hide");
                    }
                });
            }));

            $("#btnSalir").click(function () {
                navigator.app.exitApp();
            });

            login = 1;
        } else
        if (login == 1) {
            console.log("Logueado");
        }

    },
    enviarNotificacion: function () {
        //------------------------------------------------------------------------
        var onSuccess = function (position) {
            idUsuario = storage.getItem('idUsuario');
            $.ajax({
                url: "http://www.salesworldperu.com/intranet/Appservices/insertar",
                type: "POST",
                async: true,
                data: {
                    usuario: idUsuario,
                    latitud: position.coords.latitude,
                    longitud: position.coords.longitude
                },
                success: function (data)
                {
                    console.log("Registrado");
                    $.LoadingOverlay("hide");
                },
                error: function (e)
                {
                    console.log("Error");
                    $.LoadingOverlay("hide");
                }
            });
        };
        function onError(error) {
            myApp.alert('Error al obtener la posición de su GPS', 'Hubo un error!');
            $.LoadingOverlay("hide");
            //alert('code: ' + error.code + '\n' +
            //        'message: ' + error.message + '\n');
        }
        var options = {
            enableHighAccuracy: true
        };
        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
        //------------------------------------------------------------------------
    },
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
