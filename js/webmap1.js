$(function() {
  $('#datetimepicker1').datetimepicker({
      format: 'YYYY-MM-DD'
      })
})

//Filter variables
var statusFilterParam = document.getElementById('statusFilter').value
var serviceFilterParam = document.getElementById('serviceFilter').value
var interactiveFilterParam = document.getElementById('interactiveFilter').value

map = new L.Map(document.getElementById('map')).setView([-29.389357, 25.036318], 5);
map.spin(true, {lines: 13, length: 40})

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,

  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap-frw</a>'
}).addTo(map)

var sidebar = L.control.sidebar('sidebar', {
  position: 'left'
})

map.addControl(sidebar)

var FilterAction = L.Toolbar2.Action.extend({
  options: {
    toolbarIcon: {
      html: '&#128269;',
      tooltip: 'Filter toolbar'
    }
  },
  addHooks: function() {
    sidebar.toggle()
  }
})
new L.Toolbar2.Control({
  actions: [FilterAction]
}).addTo(map)

var wmsLayer = L.tileLayer.betterWms('http://alteram.dedicated.co.za:8091/geoserver/alteram/ows?', {
    layers: 'alteram:c4ctickets',
    transparent: true,
    format: 'image/png'
}).addTo(map);

function Filter() {
  var time = $('#datetimepicker1').find('input').val();
  if (time == '') {
    timeFilterparam = ' IS NOT NULL'
  } else {
    timeFilterparam = '='+time +'z'
  }
  
    map.spin(true, {lines: 13, length: 40});
    map.removeLayer(wmsLayer);

    statusFilterParam = document.getElementById('statusFilter').value;
    serviceFilterParam = document.getElementById('serviceFilter').value;
    interactiveFilterParam = document.getElementById('interactiveFilter').value;
    wmsLayer = L.tileLayer.betterWms('http://alteram.dedicated.co.za:8091/geoserver/alteram/ows?',
        {
            Layers: 'alteram:c4ctickets',
            transparent: true,
            format: 'image/png',
            CQL_FILTER:
            'lifecyclestatuscode' + statusFilterParam + ' AND ' +
            ' servicetermsserviceissuecategoryid' + serviceFilterParam + ' AND ' +
            ' interactivechannel' + interactiveFilterParam + ' AND ' +
            ' createdate' + timeFilterparam
        }).addTo(map);
    map.spin(false);
}

//Get Graphic request
var LegendURL = 'http://alteram.dedicated.co.za:8091/geoserver/alteram/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=alteram:c4ctickets'
L.wmsLegend(LegendURL);

map.spin(false);
setTimeout(function() {
  sidebar.show()
}, 500);