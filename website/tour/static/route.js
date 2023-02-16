ymaps.ready(init);

function init() { 
    var newRefs = [];
    var map = new ymaps.Map('map', {center: [55.833925, 37.628259], zoom: 15, controls: ['zoomControl']}, {restrictMapArea: true});
    map.setType('yandex#satellite');
    $.ajax({url: '/static/data.json'}).done(function(data) { 
        var features = data.features;
        for (let id of points) {newRefs.push(features.filter(function (x) {return x.id == id})[0].geometry.coordinates);}
        var multiRoute = new ymaps.multiRouter.MultiRoute({referencePoints: newRefs, params: {routingMode: 'pedestrian'}}, {boundsAutoApply: true});
        map.geoObjects.add(multiRoute);
    });
}
