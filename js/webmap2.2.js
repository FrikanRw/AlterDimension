//Filter variables
map = new L.Map(document.getElementById('map')).setView([-29.389357, 25.036318], 5);
map.spin(true, {lines: 13, length: 40});

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,

    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



var province = L.geoJSON();
var district =L.geoJSON();
var local    =L.geoJSON();
//URL
var geoPrvJsonUrl = "http://alteram.dedicated.co.za:8091/geoserver/alteram/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=alteram:provinces&outputFormat=application%2Fjson&format_options=callback:handleJson";
var distJsonUrl = "http://alteram.dedicated.co.za:8091/geoserver/alteram/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=alteram:districtmunicipalities_current&outputFormat=application%2Fjson&format_options=callback:handleJson";
var localJsonUrl = "http://alteram.dedicated.co.za:8091/geoserver/alteram/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=alteram:localmunicipalities_currents&outputFormat=application%2Fjson&format_options=callback:handleJson";
//URL testbay
//var geoJsonUrl = "http://alteram.dedicated.co.za:8091/geoserver/alteram/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=alteram:c4ctickets&outputFormat=application%2Fjson&format_options=callback:handleJson";
//var geoJsonUrl = "http://frikancarto.co.za:8080/geoserver/Alteram/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Alteram:c4ctickets_old&outputFormat=text%2Fjavascript&format_options=callback:handleJson";




$.ajax({
    jsonp: true,
    url: distJsonUrl,
    dataType: 'json',
    success: handleJson
});

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Tickets</h4>' + (props ?
        '<b>' + props.label + '</b><br />' + props.ticket_count + ' '
        : 'Hover over a area');
};

info.addTo(map);


// get color depending on ticket density value
function getColor(d) {
    return d > 8000 ? '#800026' :
        d > 5000 ? '#BD0026' :
            d > 3500 ? '#E31A1C' :
                d > 2500 ? '#FC4E2A' :
                    d > 1000 ? '#FD8D3C' :
                        d > 500 ? '#FEB24C' :
                            d > 100 ? '#FED976' :
                                '#FFEDA0';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.ticket_count)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
function handleJson(data){
    geojson= L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    map.spin(false);
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 100, 500, 1000, 2500, 3500, 5000, 8000],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);

