var listo = [];

window.onload = function() {
	if (localStorage["list"] !== null) {
		listo = JSON.parse(localStorage["list"]);
	} else {
		localStorage["list"] = JSON.stringify([]);
	}
	
	for (var i = 0; i < listo.length; i++) {
		if (listo[i].id === "new") {
			appendToList('#newList', listo[i], "item");
		} else if (listo[i].id === "inProgress") {
			appendToList('#currentList', listo[i], "inProgress");
		} else if (listo[i].id === "archived") {
			appendToList('#archivedList', listo[i], "archived");
		}
	}

};

function appendToList(element, task, theID) {
	$(element).append(
        '<a href="#finish" class="" id="' + theID + '">' +
        '<li class="list-group-item">' +
        '<h3>' + task.task + '</h3>'+
        '<span class="arrow pull-right">' +
        '<i class="glyphicon glyphicon-arrow-right">' +
        '</span>' +
        '</li>' +
        '</a>'
    );
}

$(document).ready(function() {

	var Task = function(task) {
		this.task = task;
		this.id = 'new';
	}

	var addTask = function(task) {
		if (task) {
			task = new Task(task);
			listo.push(task);

			localStorage["list"] = JSON.stringify(listo);
			
			$('#newItemInput').val('');

	        appendToList('#newList', task, "item");

	    }

	    $('#newTaskForm').slideToggle('fast', 'linear');

	}

	$('#saveNewItem').on('click', function (e) {
	    e.preventDefault();
	    var task = $('#newItemInput').val().trim();
	    addTask(task);
	});

	$('#add-todo').on('click', function () {
		$('#newTaskForm').fadeToggle('fast', 'linear');
	});
	
	$('#cancel').on('click', function (e) {
		e.preventDefault();
		$('#newTaskForm').fadeToggle('fast', 'linear');
	});

	var advanceTask = function(task) {
		var modified = task.innerText.trim();
		for (var i = 0; i < listo.length; i++) {
			console.log(modified + ": " + listo[i].task.toUpperCase());
			if (listo[i].task.toUpperCase() === modified) {
				if (listo[i].id === 'new') {
					listo[i].id = 'inProgress';
				} else if (listo[i].id === 'inProgress') {
					listo[i].id = 'archived';
				} else {
					listo.splice(i, 1);
				}
				break;
			}
		}
		task.remove();
	};

	$(document).on('click', '#item', function(e) {
		e.preventDefault();
		var task = this;      
		advanceTask(task);
		this.id = 'inProgress';
		$('#currentList').append(this.outerHTML);
		localStorage["list"] = JSON.stringify(listo);
	});

	$(document).on('click', '#inProgress', function (e) {
		e.preventDefault();
		var task = this;
		task.id = "archived";
		var changeIcon = task.outerHTML.replace('glyphicon-arrow-right', 'glyphicon-remove');
		advanceTask(task);
		$('#archivedList').append(changeIcon);
		localStorage["list"] = JSON.stringify(listo);
	});

	$(document).on('click', '#archived', function (e) {
		e.preventDefault();
		var task = this;
		advanceTask(task);
		localStorage["list"] = JSON.stringify(listo);
	});



});