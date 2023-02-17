// Имплементация перестановки элементов в списке выбранных точек
var enterTarget = null;
var items = null;
var itemsRoute = null;

function handleDragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    items.forEach(function (item) {
        item.classList.remove('over');
    });
}

function handleDragEndRoute(e) {
    this.style.opacity = '1';
    itemsRoute.forEach(function (item) {
        item.classList.remove('over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
}

function handleDragEnter(e) {
    enterTarget = e.target;
    e.stopPropagation();
    e.preventDefault();
    this.classList.add('over');
}

function handleDragLeave(e) {
    if (enterTarget == e.target){
        e.stopPropagation();
        e.preventDefault();
        this.classList.remove('over');
    }
}

function handleDrop(e) {
    e.stopPropagation();
    if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    };
    entriesNew = [];
    document.querySelectorAll('.point').forEach(function(entry) {
        entriesNew.push(entry[0].value)
    });
    $.ajax({type: 'POST',url: '/', data: {
        reason: 'update',
        entries: entriesNew,
        csrfmiddlewaretoken: csrftoken
    },
    success: function(response) {routePointListRender(response)}});
    return false;
}

function handleDropRoute(e) {
    e.stopPropagation();
    if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    };
    entriesNew = [];
    document.querySelectorAll('.route').forEach(function(entry) {
        entriesNew.push(entry[0].value)
    });
    $.ajax({type: 'POST',url: '/', data: {
        reason: 'update-route',
        entries: entriesNew,
        csrfmiddlewaretoken: csrftoken
    },
    success: function(response) {routeListRender(response)}});
    return false;
}

document.addEventListener('DOMContentLoaded', (event) => {    
    items = document.querySelectorAll('.point');
    items.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('drop', handleDrop);
    });
});

document.addEventListener('DOMContentLoaded', (event) => {    
    itemsRoute = document.querySelectorAll('.route');
    itemsRoute.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('dragend', handleDragEndRoute);
        item.addEventListener('drop', handleDropRoute);
    });
});
