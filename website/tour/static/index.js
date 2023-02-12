ymaps.ready(init); // Как только завершится загрузка API...
function init(){
    // Создание карты ВДНХ через JS API от Яндекс:
    var myMap = new ymaps.Map("indexMap", {
        center: [55.833925, 37.628259], // Примерный центр ВДНХ
        zoom: 15, // Уровень приближения при отрисовке
        controls: ['zoomControl'] // Из элементов управления оставить только масштаб
    }, {
        restrictMapArea: true // Запретить выход за пределы изначально отрисованной зоны
    });
    myMap.setType('yandex#satellite'); // Сделать вид со спутника вместо убогой схематической карты
    // Упрощённый отрисовщик точек:
    objectManager = new ymaps.ObjectManager({
        clusterize: true, // Совмещать точки в группы при необходимости
        gridSize: 32, // Не знаю что это делает
        clusterDisableClickZoom: true // Не знаю что это делает
    });
    // Выбрать стиль точек/групп при отрисовке на карте:
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    // Добавить упрощённый отрисовщик в список объектов карты:
    myMap.geoObjects.add(objectManager);
    // Подгрузить данные о точках из статичного файла:
    $.ajax({
        url: '/static/data.json'
    }).done(function(data) {
        objectManager.add(data); // Добавить точки в упрощённый отрисовщик
    });
}
/*
Cервер Django требует чтобы все анкеты снабжались токеном CSRF, однако в нашем
случае Яндекс отрисовывает точки динамически, поэтому токен в них заранее прописать
нельзя. Вместо этого, мы перехватываем уже готовый запрос после нажатия кнопки
отправки анкеты и вставляем в него нужный заголовок.
*/

$(document).on('submit', '#addPointForm', function(e) {
    e.preventDefault(); // Прервать отправку автоматического запроса
    // Собрать новый (правильный) запрос:
    $.ajax({
        type: 'POST',
        url: '/',
        data:
        {
            reason: 'addPoint',
            pointName: $('#pointName').val(),
            pointId: $('#pointId').val(),
            csrfmiddlewaretoken: csrftoken
        },
        /*
        Поскольку при добавлении точек страница не должна перезагружаться, новые точки
        добавляются в видимый пользователю список через вызов AJAX. После перезагрузки точки
        будут отрисованы уже "нормальным" путём - через рендер класса IndexView.
        */
        success: function(response){
            var routePointsList = $('#routePointsList');
            updData = '<li id="point' + response.pointIdTrue + '">' + response.pointName + '</li>'
            routePointsList.append(updData)
            }
        })
    });