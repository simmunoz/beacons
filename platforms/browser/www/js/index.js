var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.rangeBeacon();
        //this.Saludo();

    },

    Saludo: function() {
        var texto = "Recuerde mantener activado el bluetooth ..";
        texto += " ";
        texto += "Buscando tiendas cercanas ..";
        var funcionBuscando = "ReadyGeo";
        TransmitirVoz(texto, funcionBuscando);

    },
    rangeBeacon: function() {

        var uuid = 'f7826da6-4fa2-4e98-8024-bc5b71e0893e';
        var identifier = 'Prueba';
        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid);
        var delegate = new cordova.plugins.locationManager.Delegate();

        delegate.didDetermineStateForRegion = function(pluginResult) {
            console.log("1");
        };

        delegate.didEnterRegion = function( /*pluginResult*/ ) {
            console.log("2");
            regionDiv.innerText = 'Inside Region';
            cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
                .fail(function(e) { console.error(e); })
                .done();
        };

        /*delegate.didExitRegion = function() {
            console.log("3");
            regionDiv.innerText = 'Outside Region';
            cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegion)
                .fail(function(e) { console.error(e); })
                .done();
        };*/

        delegate.didRangeBeaconsInRegion = function(pluginResult) {
            console.log("4");
            if (pluginResult.beacons.length > 0) {
                var proximity = pluginResult.beacons[0].proximity;
                rangeDiv.innerText = proximity.replace('Proximity', 'Proximity: ');
            } else {
                rangeDiv.innerText = '';
            }
        };

        cordova.plugins.locationManager.setDelegate(delegate);
        cordova.plugins.locationManager.requestWhenInUseAuthorization();

        cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
            .fail(function(e) { console.error(e); })
            .done();
    }
};

app.initialize();