var savedRoutes = [], names = [];

ymaps.modules.define('StatsView', ['util.defineClass'], function (provide, defineClass) {
    function StatsView (model) {
        this.model = model;
        this.state = "init";
        this.stateChangeEvent = null;
        this.outputElement =  $('#info');
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
            if (routes.length) {
                for (var i = 0, l = routes.length; i < l; i++) {
                    result.push(
                        '<form class="route" draggable="true" method="post"><p class="point-name">Длительность: ' +
                        routes[i].properties.get('duration').text + '<br>Протяжённость: ' + routes[i].properties.get('distance').text + '</p></form>'
                    );
                }
            } else {
                result.push("Нет маршрутов.");
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
            reason: 'add',
            id: points,
            time: savedRoutes[0].properties.get("duration"),
            dist: savedRoutes[0].properties.get("distance"),
            name: names[0] + ' - ' + names.reverse()[0],
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
        model = new ymaps.multiRouter.MultiRouteModel(coordinates, 
        {
            boundsAutoApply: true
        }), map = new ymaps.Map('map', {
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
