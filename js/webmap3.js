$(function() {
    $('#datetimepicker1').datetimepicker({
        format: 'YYYY-MM-DD'
    })
})



//Filter variables
var statusFilterParam = document.getElementById('statusFilter').value;
var serviceFilterParam = document.getElementById('serviceFilter').value;
var interactiveFilterParam = document.getElementById('interactiveFilter').value;
var time = $('#datetimepicker1').find('input').val()
if (time == '') {
  selectedTime=moment().toISOString();
} else {
  selectedTime = new Date(time).toISOString()
}





map = new L.Map(document.getElementById('map')).setView([-29.389357, 25.036318], 5);
map.spin(true, {lines: 13, length: 40});

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,

    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap-frw</a>'
}).addTo(map);


var sidebar = L.control.sidebar('sidebar', {
    position: 'left'
});

map.addControl(sidebar);

var FilterAction = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '&#128269;',
            tooltip: 'Filter toolbar'
        }
    },
    addHooks: function() {
        sidebar.toggle();
    }
});
new L.Toolbar2.Control({
    actions: [FilterAction]
}).addTo(map);

//wms layer
var NTwmsLayer = L.tileLayer.wms('http://alteram.dedicated.co.za:8091/geoserver/alteram/ows?',
    {
        Layers: 'alteram:c4ctickets',
        transparent: true,
        format: 'image/png',
        CQL_FILTER: 'createdate='+selectedTime,
        styles:'newtickets'
    }).addTo(map);
var geoJsonUrl = "http://alteram.dedicated.co.za:8091/geoserver/alteram/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=alteram:c4ctickets_audit&CQL_Filter=lastchangedatetime" + selectedTime +"&maxFeatures=50&outputFormat=application%2Fjson&format_options=callback:handleJson";
//URL testbay
$.ajax({
  
  jsonp: false,
  url: geoJsonUrl,
  dataType: 'json',
  success: handleJson
});



function handleJson(data) {
  
  
  var tickets_layer = L.geoJson(data, {
    /*
WHERE DATE(lastchangedatetime) = DATE(NOW()) AND createdatetime < DATE(NOW()
*/
    
    onEachFeature: function (feature, tickets_layer) {
      console.log(feature);
      tickets_layer.bindPopup(
        '<h6  style="text-align: center;">Ticket information</h6></b>' +
        '<div style="text-align: center;"> Ticket Number: ' + feature.properties.uuid +
        '<div style="text-align: center;"> Subject:' + feature.properties.name +
        '<div style="text-align: center;"> Interactive Channel:' + feature.properties.interactivechannel +
        '<div style="text-align: center;"> Create Date:' + feature.properties.createdatetime +
        '<div style="text-align: center;"> Life Cycle status code: ' + feature.properties.lifecyclestatuscode +
        '<div style="text-align: center;"> Service Category: ' + feature.properties.servicetermsserviceissuecategoryid +
        '<div style="text-align: center;"> Sub Service Category: ' + feature.properties.mainincidentserviceissuecategoryserviceissuecategoryid +
        '<div style="text-align: center;"> Topic: ' + feature.properties.mainobjectpartserviceissuecategoryserviceissuecategoryid +
        '<div style="text-align: center;"> Impact: ' + feature.properties.impact +
        '<div style="text-align: center;"> Location : ' + feature.properties.sectionzone + ' ' + feature.properties.gissubplace + ' ' + feature.properties.gismainplace);
    },
    
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 4,
        color: "#000",
        weight: 0.1,
        opacity: 1,
        fillOpacity: 1, fillColor: '#4332E0'
      });
      
    }
  });
  map.addLayer(tickets_layer);
  map.spin(false);
}

function Filter() {
    map.spin(true, {lines: 13, length: 40});
    map.removeLayer(NTwmsLayer);

    statusFilterParam = document.getElementById('statusFilter').value;
    serviceFilterParam = document.getElementById('serviceFilter').value;
    interactiveFilterParam = document.getElementById('interactiveFilter').value;
    wmsLayer = L.tileLayer.wms('http://alteram.dedicated.co.za:8091/geoserver/alteram/ows?',
        {
            Layers: 'alteram:c4ctickets',
            transparent: true,
            format: 'image/png',
            CQL_FILTER:
            'lifecyclestatuscode' + statusFilterParam + ' AND ' +
            ' servicetermsserviceissuecategoryid' + serviceFilterParam + ' AND ' +
            ' interactivechannel' + interactiveFilterParam
        }).addTo(map);
    map.spin(false);
}


//Get Graphic request
var LegendURL = 'http://alteram.dedicated.co.za:8091/geoserver/alteram/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=alteram:c4ctickets&STYLE=newtickets';
L.wmsLegend(LegendURL);
map.addEventListener('click', Identify);

function Identify(e) {
    // set parameters needed for GetFeatureInfo WMS request
    var BBOX = map.getBounds().toBBoxString();
    var WIDTH = map.getSize().x;
    var HEIGHT = map.getSize().y;


    var URL = 'http://alteram.dedicated.co.za:8091/geoserver/alteram/wms?service=WMS&version=1.1.1&request=GetFeatureInfo&LAYERS=alteram:c4ctickets&QUERY_LAYERS=alteram:c4ctickets&BBOX=' + BBOX + '&FEATURE_COUNT=50&HEIGHT=' + HEIGHT + '&WIDTH=' + WIDTH + '&INFO_FORMAT=text%2Fhtml&SRS=EPSG%3A4326&X=' + 50 + '&Y=' + 50;

    $.ajax({
        url: URL,
        dataType: "html",
        type: "GET",
        success: function(data) {
            var popup = new L.Popup({maxWidth: 800});
            console.log(URL);
            console.log(data);
            popup.setContent(data);
            popup.setLatLng(e.latlng);
            map.openPopup(popup);
        }
    });
}

map.spin(false);
setTimeout(function() {
    sidebar.show();
}, 500);