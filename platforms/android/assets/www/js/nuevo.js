//jaime rodorea

var ObjSalas = [{
        "uuid_beacon": "f7826da6-4fa2-4e98-8024-bc5b71e0893e",
        "major_beacon": "1",
        "menor_beacon": "1",
        "texto": "Crema nivea adulto, stock 6 unidades, precio lista 2500 pesos.",
        "direccion": "Farmacia doctor SIMI",
        "longitud": "-70.6213801",
        "latitud": "-33.4291121"
    },
    {
        "uuid_beacon": "f7826da6-4fa2-4e98-8024-bc5b71e0893e",
        "major_beacon": "1",
        "menor_beacon": "2",
        "texto": "Ibuprofeno, 300 miligramos, stock 5 cajas, precio lista 1000 pesos.",
        "direccion": "Farmacia doctor SIMI",
        "longitud": "-70.6213801",
        "latitud": "-33.4291121"
    },
    {
        "uuid_beacon": "f7826da6-4fa2-4e98-8024-bc5b71e0893e",
        "major_beacon": "1",
        "menor_beacon": "3",
        "texto": "Paracetamol, 500 miligramos, stock 30 cajas, precio lista 500 pesos.",
        "direccion": "Farmacia doctor SIMI",
        "longitud": "-70.6213801",
        "latitud": "-33.4291121"
    }
];

var beaconId;
var objBeacon = [];
var nombreSala = "";
var auxmajor = "";
var auxminor = "";
var posicion = "";
var watchID;
var TextoTTS = "";
var region;
var delegate;
var beaconRegion;
var uuid = 'f7826da6-4fa2-4e98-8024-bc5b71e0893e';
var identifier = Math.floor((Math.random() * 100) + 1).toString();;
/* global cordova, regionDiv, rangeDiv */

var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        //this.rangeBeacon();
        this.Saludo();
        //this.Stop();

    },

    Stop: function() {
        beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid);
        delegate = new cordova.plugins.locationManager.Delegate();
        delegate.didEnterRegion = function( /*pluginResult*/ ) {
            regionDiv.innerText = 'Inside Region';
            cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
                .fail(function(e) { console.error(e); })
                .done();
        };
    },

    Saludo: function() {
        beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid);
        delegate = new cordova.plugins.locationManager.Delegate();
        var texto = "Recuerde mantener activado el bluetooth ..";
        texto += " ";
        texto += "Buscando tiendas cercanas ..";
        var funcionBuscando = "ReadyGeo";
        TransmitirVoz(texto, funcionBuscando);

    }
};

app.initialize();


function TransmitirVoz(texto, funcion) {
    TTS
        .speak({
            text: texto,
            locale: 'es-ES',
            rate: 0.95//1.5
        }, function(result) {

            if (funcion != "" && funcion == "LocalizarBeacons") {
                LocalizarBeacons();
            } else if (funcion != "" && funcion == "ReadyGeo") {
                ReadyGeo();
            }

        }, function(reason) {

        });
}

function ReadyGeo() {
    console.log("ready geo");
    navigator.geolocation.getCurrentPosition(Getposition, error);
}


function Getposition(position) {
    console.log("get position");
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    $.each(ObjSalas, function(index, item) {
        var lat2 = item.latitud;
        var lon2 = item.longitud;
        Distancia = Dist(latitude, longitude, lat2, lon2); //Retorna numero en Km
        function Dist(latitude, longitude, lat2, lon2) {
            rad = function(x) {
                return x * Math.PI / 180;
            }

            var R = 6378.137; //Radio de la tierra en km
            var dLat = rad(lat2 - latitude);
            var dLong = rad(lon2 - longitude);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(latitude)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            if (d.toFixed(1) <= "1") {
                beaconId = item.uuid_beacon
                nombreSala = item.direccion;
                objBeaconInt = { "major": "", "minor": "", "texto": "" };
                objBeaconInt.major = item.major_beacon;
                objBeaconInt.minor = item.menor_beacon;
                objBeaconInt.texto = item.texto;
                objBeacon.push(objBeaconInt);
            }

        }

    });

    if (objBeacon.length > 1) {
        var texto = "Bienvenido jaime rodorea, a " + " " + nombreSala + ", " + "presione la pantalla para comenzar a localizar productos y pasillos.";
        TransmitirVoz(texto)
    } else {
        var texto = "No te encuentras dentro del rango de tiendas";
        TransmitirVoz(texto)
    }

    console.log(objBeacon);
}

function error(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}


function CreateRegion() {
    var texto = "Localizando productos y pasillos";
    var funcion = "LocalizarBeacons";
    TransmitirVoz(texto, funcion);
}


function LocalizarBeacons() {
    var BeaconEcontrados = [];
    var BeaconEcontradosCercano = [];
    var majorResult;
    var minorResult;
    //console.log(uuid, " " ,identifier," " ,beaconRegion," " ,delegate);
    delegate.didDetermineStateForRegion = function(pluginResult) {
        console.log(pluginResult);
    };

    delegate.didEnterRegion = function( /*pluginResult*/ ) {
        regionDiv.innerText = 'Inside Region';
        cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
            .fail(function(e) { console.error(e); })
            .done();
    };


    delegate.didRangeBeaconsInRegion = function(pluginResult) {
        if (pluginResult.beacons.length > 0) {
            var proximity = pluginResult.beacons[0].proximity;
            rangeDiv.innerText = proximity.replace('Proximity', 'Proximity: ');
            var ArrayRssi = [];
            if (pluginResult.beacons.length != 0 || pluginResult.beacons.length != null) {
                $.each(pluginResult.beacons, function(index, item) {
                    var GetBeacons = { "rssi": "", "major": "", "minor": "", "accuracy":"" };
                    GetBeacons.rssi = item.rssi;
                    GetBeacons.major = item.major;
                    GetBeacons.minor = item.minor;
                    GetBeacons.accuracy = item.accuracy;
                    BeaconEcontrados.push(GetBeacons);
                    ArrayRssi.push(item.rssi);
                });
                var MaxRssi = Math.max.apply(null, ArrayRssi);
                $.each(BeaconEcontrados, function(index, encontrados) {
                    if (MaxRssi == encontrados.rssi) {
                        majorResult = encontrados.major;
                        minorResult = encontrados.minor;
                    }
                });
                if (MaxRssi >= -75) {
                    console.log(objBeacon);
                    $.each(objBeacon, function(index, beaconobj) {

                        var majorObj = beaconobj.major;
                        var minorObj = beaconobj.minor;
                        var textObj = beaconobj.texto;
                        TextoTTS = textObj;
                        if (majorResult == majorObj && minorResult == minorObj) {

                            if (auxminor != minorObj) {
                                console.log(MaxRssi, " ", majorObj, " ", minorObj);
                                auxmajor = majorObj;
                                auxminor = minorObj;
                                $(".accuracy").text("RSSI: " + MaxRssi);
                                $(".array").text("ARRAY: " + ArrayRssi);
                                $(".identificar").text("MAJOR:" + majorObj + " " + "MINOR:" + minorObj);
                                TransmitirVoz(textObj);
                            } else {
                                console.log("no lo digo");
                            }
                        }

                    });
                }
            } else {
                rangeDiv.innerText = '';
            }

        }
    };

    cordova.plugins.locationManager.setDelegate(delegate);
    cordova.plugins.locationManager.requestWhenInUseAuthorization();

    cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
        .fail(function(e) { console.error(e); })
        .done();

}
