ymaps.ready(init); // Как только завершится загрузка API...
function init() { 
    var multiRoute = new ymaps.multiRouter.MultiRoute({
    referencePoints: [
        
    ],
    params: {routingMode: 'pedestrian'}}, {boundsAutoApply: true});

    var changePointsButton = new ymaps.control.Button({
        data: {content: "Поменять местами точки А и В"},
        options: {selectOnClick: true}
    });

    changePointsButton.events.add('select', function () {
        multiRoute.model.setReferencePoints([pointB, pointA]);
    });

    changePointsButton.events.add('deselect', function () {
        multiRoute.model.setReferencePoints([pointA, pointB]);
    });

    var myMap = new ymaps.Map('map', {
        center: [55.739625, 37.54120],
        zoom: 12,
        controls: [changePointsButton]
    }, {
        buttonMaxWidth: 300
    });

    myMap.geoObjects.add(multiRoute);
}