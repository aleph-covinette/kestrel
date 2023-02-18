// This file defines normal functions and variables

ymaps.ready(mapIndexInit);

var source = null, hover = null, elements = null, features = [];

function dndStart(e) {
    this.style.opacity = '0.4';
    source = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function dndEnd(e) {
    this.style.opacity = '1';
    var elements = document.querySelectorAll(['.d-rp', '.d-rt']);
    elements.forEach(function (item) {
        item.classList.remove('over');
    });
}

function dndOver(e) {
    e.preventDefault();
    return false;
}

function dndEnter(e) {
    hover = e.target;
    e.stopPropagation();
    e.preventDefault();
    this.classList.add('over');
}

function dndLeave(e) {
    if (hover == e.target){
        e.stopPropagation();
        e.preventDefault();
        this.classList.remove('over');
    }
}

function dndDrop(e) {
    e.stopPropagation();
    if (source !== this) {
        source.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    };
    var entriesNew = [], sel = null;
    if (source.classList[2] == 'd-rp') {
        document.querySelectorAll('.df-rp').forEach(function(entry) {
            entriesNew.push(entry[0].value);
            sel = 'point';
        });
    }
    if (source.classList[2] == 'd-rt') {
        document.querySelectorAll('.df-rt').forEach(function(entry) {
            entriesNew.push(entry[0].value);
            sel = 'route';
        });
    }
    $.ajax({type: 'POST',url: '/', data: {
        source: sel,
        reason: 'update',
        entries: entriesNew,
        csrfmiddlewaretoken: csrftoken
    },
    success: function(response) {elementRender(response)}});
    return false;
}

function reloadDndListeners() {
    var elements = document.querySelectorAll(['.d-rp', '.d-rt']);
    elements.forEach(function(element) {
        element.addEventListener('dragstart', dndStart);
        element.addEventListener('dragover', dndOver);
        element.addEventListener('dragenter', dndEnter);
        element.addEventListener('dragleave', dndLeave);
        element.addEventListener('dragend', dndEnd);
        element.addEventListener('drop', dndDrop);
    });
}

function elementRender(response, source) {
    if (source == 'point') {
        var elements = $('.dc-rp');
        elements.children().remove();
        for (let element of response.elements) {
            elements.append(
                '<div class="cnt-f flx d-rp" draggable="true"><p class="fld-n txt flx-s">' + element.name +
                '</p><form class="df-rp" draggable="true" method="post"><input type="hidden" value="' +
                element.pos + '"/><input class="fld-n flx-s txt" type="submit" value="Удалить"/></form></div>'
            );
        }
    }
    if (source == 'route') {
        var elements = $('.dc-rt');
        elements.children().remove();
        for (let element of response.elements) {
            elements.append(
                '<div class="cnt-f flx d-rt" draggable="true"><p class="fld-n txt flx-s">От: ' + element.name1 + '<br>До: ' + element.name2 +
                '<br>Длительность: ' + element.time + '<br>Протяжённость: ' + element.dist + '</p><form class="de-rt" method="post"><input type="hidden" value="' +
                element.pos + '"/><input class="fld-n txt" type="submit" value="Загрузить"/></form><form class="df-rt" method="post"><input type="hidden" value="' +
                element.pos + '"/><input class="fld-n txt" type="submit" value="Удалить"/></form></div>'
            );
        }
    }
    reloadDndListeners();
}

function mapIndexInit() {
    var mapIndex = new ymaps.Map('map', {center: [55.833925, 37.628259], zoom: 15, controls: ['zoomControl']}, {restrictMapArea: true});
    mapIndex.setType('yandex#satellite');
    objectManager = new ymaps.ObjectManager({clusterize: true, gridSize: 32, clusterDisableClickZoom: true});
    objectManager.objects.options.set('preset', 'islands#blackDotIcon');
    objectManager.clusters.options.set('preset', 'islands#blackClusterIcons');
    mapIndex.geoObjects.add(objectManager);
    $.ajax({url: '/static/data.json'}).done(function(data) {objectManager.add(data); features = data.features;});
}
