//Filter variables
var statusFilterParam = document.getElementById('statusFilter').value;

map = new L.Map(document.getElementById('map')).setView([-29.389357, 25.036318], 5);
map.spin(true, {lines: 13, length: 40});

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,

    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/*var Mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZnJpa2FucnciLCJhIjoiY2lzd3NmejJvMDAyazJ5cGRscmx1a2pyOCJ9.TNL8UhbgzlL9GC1rj8gaRA', {
    opacity: 0.48,
    attribution: 'Tiles Source: <a href="https://www.mapbox.com/">Mapbox&copy</a>'
}).addTo(map);*/

// case color on (serviceCategory)servicetermsserviceissuecategoryid;
function colorbyService(feature) {
    switch (feature.properties.servicetermsserviceissuecategoryid) {
        case  'Accounts':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#a6cee3'
            };//1
        case  'Billing Management':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#1f78b4'
            };//2
        case  'Compliance & Enforcement':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#b2df8a'
            };//3
        case  'Corporate Services':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#33a02c'
            };//4
        case  'Debt Management':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#fb9a99'
            };//5
        case  'Main - Accounts Payable':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#e31a1c'
            };//5
        case  'Marketing':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#fdbf6f'
            };//6
        case  'Non-Service Issue':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#ff7f00'
            };//7
        case  'Planned Service Delivery':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#cab2d6'
            };//8
        case  'Sanitation':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#6a3d9a'
            };//9
        case  'Water':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#ffff99'
            };//10
        case  'Water Information Management':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#b15928'
            };//11
        case  'Water Service Regulation':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#6de3da'
            };//12
        case  'Water Use Authorisation':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#e3d32a'
            };//13
        case  'Water Use Registration':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#e30063'
            };//14
        case  'WR-Water Infrastructure':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#40e33c'
            };//15
        case  'WR - Water Infrastructure':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#0017e3'
            };//16
        case  'WTE Accounts Payable':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#035b19'
            };//17
        case  'WTE - SCM':
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#000000'
            };//18
        default:
            return {
                radius: 8,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 1, fillColor: '#ffffff'
            };
    }
}

var geoJsonUrl = "http://alteram.dedicated.co.za:8091/geoserver/alteram/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=alteram:c4ctickets&CQL_Filter=lifecyclestatuscode" + statusFilterParam + "&maxFeatures=5000&outputFormat=application%2Fjson&format_options=callback:handleJson";
//URL testbay
//var geoJsonUrl = "http://alteram.dedicated.co.za:8091/geoserver/alteram/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=alteram:c4ctickets&outputFormat=application%2Fjson&format_options=callback:handleJson";
//var geoJsonUrl = "http://frikancarto.co.za:8080/geoserver/Alteram/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Alteram:c4ctickets_old&outputFormat=text%2Fjavascript&format_options=callback:handleJson";

var markers = L.markerClusterGroup({chunkedLoading: true});

$.ajax({

    jsonp: false,
    url: geoJsonUrl,
    dataType: 'json',
    success: handleJson
});

function statusFilter() {
    markers.clearLayers();
    statusFilterParam = document.getElementById('statusFilter').value;
    var filtergeoJsonUrl = "http://alteram.dedicated.co.za:8091/geoserver/alteram/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=alteram:c4ctickets&CQL_Filter=lifecyclestatuscode" + statusFilterParam + "&maxFeatures=5000&outputFormat=application%2Fjson&format_options=callback:handleJson";

    $.ajax({
        jsonp: false,
        url: filtergeoJsonUrl,
        dataType: 'json',
        success: handleJson
    });
}

function handleJson(data) {

    console.log(geoJsonUrl);
    var tickets_layer = L.geoJson(data, {

        onEachFeature: function (feature, tickets_layer) {

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

            /*    Ticket Number
             *    Subject
             *    Interactive Channel
             *    Create Date (createdatetime)
             *    Lifecycle Status
             *    Service Category
             *    Sub Service Category
             *    Topic
             *    Impact
             *    Location
             */

            //setup filters


        },

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, colorbyService(feature));

        }
    });
    markers.addLayer(tickets_layer);
    map.addLayer(markers);
    map.spin(false);
};
