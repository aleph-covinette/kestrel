// This file defines event listeners

document.addEventListener('DOMContentLoaded', (event) => {
    var slider = document.getElementById("sld-i");
    var output = document.getElementById("sld-o");
    output.innerHTML = slider.value + ' мин';
    slider.oninput = function() {
        output.innerHTML = this.value + ' мин';
    } 
    reloadDndListeners();
});

$(document).on('submit', '.point-add', function(e) {
    e.preventDefault();
    targ = features.filter(function (x) {return x.id == e.target[1].value})[0];
    $.ajax({type: 'POST', url: '/', data: {
        source: 'point',
        reason: 'add',
        name: targ.properties.balloonContentHeader,
        poi: targ.id,
        csrfmiddlewaretoken: csrftoken
    },
    success: function(response) {elementRender(response, 'point')}});
});

$(document).on('submit', '.df-rp', function(e) {
    e.preventDefault();
    $.ajax({type: 'POST',url: '/', data: {
        source: 'point',
        reason: 'remove',
        poi: e.target[0].value,
        csrfmiddlewaretoken: csrftoken
    },
    success: function(response) {elementRender(response, 'point')}});
});

$(document).on('submit', '.df-rt', function(e) {
    e.preventDefault();
    $.ajax({type: 'POST',url: '/', data: {
        source: 'route',
        reason: 'remove',
        pos: e.target[0].value,
        csrfmiddlewaretoken: csrftoken
    },
    success: function(response) {elementRender(response, 'route')}});
});

$(document).on('submit', '.de-rt', function(e) {
    e.preventDefault();
    $.ajax({type: 'POST',url: '/', data: {
        source: 'route',
        reason: 'translate',
        pos: e.target[0].value,
        csrfmiddlewaretoken: csrftoken
    }, success: function(response) {
        points = response.elements
        var names = [], pois = [];
        for (point of points) {
            targ = features.filter(function (x) {return x.id == Number(point)})[0];
            names.push(targ.properties.balloonContentHeader);
            pois.push(targ.id);
        }
        $.ajax({type: 'POST', url: '/', data: {
            source: 'point',
            reason: 'addm',
            name: names,
            poi: pois,
            csrfmiddlewaretoken: csrftoken
        }, success: function(response) {
            $.ajax({type: 'POST',url: '/', data: {
                source: 'route',
                reason: 'reload',
                csrfmiddlewaretoken: csrftoken
            },
            success: function(response) {
                elementRender(response, 'point')
            }});
        }});
    }});
});
