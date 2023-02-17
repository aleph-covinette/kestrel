ymaps.ready(mapIndexInit);
var features = [];

function mapIndexInit() {
    var mapIndex = new ymaps.Map('map', {center: [55.833925, 37.628259], zoom: 15, controls: ['zoomControl']}, {restrictMapArea: true});
    mapIndex.setType('yandex#satellite');
    objectManager = new ymaps.ObjectManager({clusterize: true, gridSize: 32, clusterDisableClickZoom: true});
    objectManager.objects.options.set('preset', 'islands#blackDotIcon');
    objectManager.clusters.options.set('preset', 'islands#blackClusterIcons');
    mapIndex.geoObjects.add(objectManager);
    $.ajax({url: '/static/data.json'}).done(function(data) {objectManager.add(data); features = data.features;});
}

function routePointListRender(response) {
    var routePointList = $('.points');
    routePointList.children().remove();
    for (let point of response.routePoints) {
        updData = '<form class="point" draggable="true" method="post"><p class="point-name">' + point.name;
        updData += '</p><input class="point-pos" type="hidden" value="' + point.pos + '"/><input class="point-remove" type="submit" value="Удалить"/></form>';
        routePointList.append(updData);
    }
    items = document.querySelectorAll('.point');
    items.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('drop', handleDrop);
    });
}

function routeListRender(response) {
    var routeList = $('.routes');
    routeList.children().remove();
    for (let route of response.routes) {
        updData = '<form class="route" draggable="true" method="post"><p class="point-name">' + route.name + '<br>Длительность: ' + route.time + ' с<br>Протяжённость: ';
        updData +=  route.dist + '</p><input type="hidden" value="' + route.pos + '"/><input class="point-remove" type="submit" value="Удалить"/></form>';
        routeList.append(updData);
    }
    items = document.querySelectorAll('.route');
    items.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('dragend', handleDragEndRoute);
        item.addEventListener('drop', handleDropRoute);
    });
}

$(document).on('submit', '.point-add', function(e) {
    e.preventDefault();
    targ = features.filter(function (x) {return x.id == e.target[1].value})[0];
    $.ajax({type: 'POST', url: '/', data: {
        reason: 'add',
        name: targ.properties.balloonContentHeader,
        point: targ.id,
        csrfmiddlewaretoken: csrftoken
    },
    success: function(response) {routePointListRender(response)}});
});

$(document).on('submit', '.point', function(e) {
    e.preventDefault();
    $.ajax({type: 'POST',url: '/', data: {
        reason: 'remove',
        pos: e.target[0].value,
        csrfmiddlewaretoken: csrftoken
    },
    success: function(response) {routePointListRender(response)}});
});

$(document).on('submit', '.route', function(e) {
    e.preventDefault();
    $.ajax({type: 'POST',url: '/', data: {
        reason: 'remove-route',
        pos: e.target[0].value,
        csrfmiddlewaretoken: csrftoken
    },
    success: function(response) {routeListRender(response)}});
});