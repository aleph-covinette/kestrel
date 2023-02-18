var savedRoutes = [], names = [], textTime = null, textDist = null, map = null;

document.addEventListener('DOMContentLoaded', (event) => {
    var nmap = $('#map')[0];
    nmap.style.opacity = 0;
});

function renderReveal() {
    nmap = $('#map')[0];
    nmap.style.opacity = 1;
}

function preventRendering() {
    map.destroy();
    map = new ymaps.Map('map', {center: [55.833925, 37.628259], zoom: 15, controls: ['zoomControl']}, {restrictMapArea: true});
    map.setType('yandex#satellite');
    renderReveal()
}

ymaps.modules.define('StatsView', ['util.defineClass'], function (provide, defineClass) {
    function StatsView (model) {
        this.model = model;
        this.state = "init";
        this.stateChangeEvent = null;
        this.outputElement =  $('.dc-rl');
        this.rebuildOutput();
        model.events.add(["requestsuccess", "requestfail", "requestsend"], this.onModelStateChange, this);        
    }

    defineClass(StatsView, {
        onModelStateChange: function (e) {
            this.state = e.get("type");
            this.stateChangeEvent = e;
            this.rebuildOutput();
        },

        rebuildOutput: function () {
            if (this.state == "requestsuccess") {
                this.outputElement.html(this.processSuccessRequest(this.model, this.stateChangeEvent));
            }  
        },

        processSuccessRequest: function (model, e) {
            var routes = model.getRoutes(),
                result = [];
            savedRoutes = routes;
            var counter = 0;
            if (routes.length) {
                for (var i = 0, l = routes.length; i < l; i++) {
                    var time = routes[i].properties.get('duration').value;
                    var dist = routes[i].properties.get('distance').value;
                    if (time < Number(expectedTime)) {
                        counter++;
                        if (time < 60) {
                            textTime = time + ' с';
                        } else {
                            textTime = ((time - (time % 60)) / 60) + ' мин ' + time % 60 + ' с';
                        }
                        console.log(dist);
                        if (dist < 1000) {
                            textDist = dist + ' м';
                        } else {
                            textDist = ((dist - (dist % 1000)) / 1000) + ' км ' + dist % 1000 + ' м';
                        }
                        result.push(
                            '<div class="cnt-f flx d-rt" draggable="true"><p class="fld-n txt flx-s">Длительность: ' + 
                            textTime + '<br>Протяжённость: ' + textDist + '</p></div>'
                        );
                    }
                    renderReveal();
                }
                if (counter == 0) {
                    preventRendering();
                    result.push(
                        '<div class="cnt-f flx d-rt" draggable="true"><p class="fld-n txt flx-s"> Нет маршрутов, удовлетворяющих вашим требованиям.<br>'+
                        'Попробуйте выбрать другие точки или убрать ограничение по времени.</p></div>'
                    );
                }
            } else {
                preventRendering();
                result.push(
                    '<div class="cnt-f flx d-rt" draggable="true"><p class="fld-n txt flx-s"> Нет маршрутов, удовлетворяющих вашим требованиям.<br>' +
                    'Попробуйте выбрать другие точки.</p></div>'
                );
            }
            return result.join("");
        },

        destroy: function () {
            this.outputElement.remove();
            this.model.events
                .remove(["requestsuccess", "requestfail", "requestsend"], this.onModelStateChange, this);
        }
    });
    provide(StatsView);
});

function saveRoute() {
    if (savedRoutes != []) {
        $.ajax({type: 'POST', url: '/route/', data: {
            source: 'route',
            reason: 'add',
            id: points,
            time: textTime,
            dist: textDist,
            name1: names[0],
            name2: names.reverse()[0],
            csrfmiddlewaretoken: csrftoken
        }});
    }
}

function init() { 
    $.ajax({url: '/static/data.json'}).done(function(data) { 
        var features = data.features, coordinates = [];
        names = [];
        for (let id of points) {
            coordinates.push(features.filter(function (x) {return x.id == id})[0].geometry.coordinates);
            names.push(features.filter(function (x) {return x.id == id})[0].properties.balloonContentHeader);
        }
        var model = new ymaps.multiRouter.MultiRouteModel(coordinates, 
        {
            boundsAutoApply: true
        });
        map = new ymaps.Map('map', {
            center: [55.833925, 37.628259],
            zoom: 15,
            controls: ['zoomControl']
        }, {
            restrictMapArea: true
        });
        model.setParams({ routingMode: 'pedestrian' }, true);
        ymaps.modules.require(['StatsView'], function(StatsView) {
            new StatsView(model);
        });
        map.setType('yandex#satellite');
        var route = new ymaps.multiRouter.MultiRoute(model);
        map.geoObjects.add(route);
    });
}

ymaps.ready(init);
