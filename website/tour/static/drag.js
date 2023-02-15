// Имплементация перестановки элементов в списке выбранных точек
var enterTarget = null;
var items = null;

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
    document.querySelectorAll('.rpl-entry').forEach(function(entry) {
        entriesNew.push(entry[0].value)
    });
    console.log(entriesNew);
    $.ajax({type: 'POST',url: '/', data: {
        reason: 'rplupdate',
        entries: entriesNew,
        csrfmiddlewaretoken: csrftoken
    },
    success: function(response) {routePointListRender(response)}});
    return false;
}

document.addEventListener('DOMContentLoaded', (event) => {    
    items = document.querySelectorAll('.rpl-entry');
    items.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('drop', handleDrop);
    });
});
