ymaps.ready(mapIndexInit);
var features = [];

function mapIndexInit() {
    var mapIndex = new ymaps.Map('lmap', {center: [55.833925, 37.628259], zoom: 15, controls: ['zoomControl']}, {restrictMapArea: true});
    mapIndex.setType('yandex#satellite');
    objectManager = new ymaps.ObjectManager({clusterize: true, gridSize: 32, clusterDisableClickZoom: true});
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    mapIndex.geoObjects.add(objectManager);
    $.ajax({url: '/static/data.json'}).done(function(data) {objectManager.add(data); features = data.features;});
}

function routePointListRender(response) {
    var routePointList = $('.rpl');
    routePointList.children().remove();
    for (let point in response.routePoints) {
        updData = '<form method="post" class="rpl-entry" draggable="true"><p class="rpl-name">' + response.routePoints[point].name;
        updData += '</p><input class="rpl-pos" type="hidden" value="' + response.routePoints[point].pos + '"/><input class="rpl-del" type="submit" value="Удалить"></form>';
        routePointList.append(updData);
    }
    items = document.querySelectorAll('.rpl-entry');
    items.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('drop', handleDrop);
    });
}

$(document).on('submit', '.route-point-add-form', function(e) {
    e.preventDefault();
    targ = features.filter(function (x) {return x.id == e.target[1].value})[0];
    $.ajax({type: 'POST', url: '/', data: {
        reason: 'rpladd',
        name: targ.properties.balloonContentHeader,
        point: targ.id,
        csrfmiddlewaretoken: csrftoken
    },
    success: function(response) {routePointListRender(response)}});
});

$(document).on('submit', '.rpl-entry', function(e) {
    e.preventDefault();
    $.ajax({type: 'POST',url: '/', data: {
        reason: 'rplremove',
        pos: e.target[0].value,
        csrfmiddlewaretoken: csrftoken
    },
    success: function(response) {routePointListRender(response)}});
});
