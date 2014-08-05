$(document).ready(function() {
	console.log("Loaded!");
});

var socket = io.connect('http://localhost:8888/', {
    'reconnect': true,
    'reconnection delay': 1000,
    'max reconnection attempts': 5
});

socket.on('connect', function(data){

	$('#languages').change(function() {
		var lang = $('#languages').val();
		console.log("Changed, lang: "+lang+" selected!");
		socket.emit('getLang', lang);
	});
	// $('#test').click(function() {
	// 	var lang = "javascript";
	// 	console.log("Clicked!");	
	// 	socket.emit('getLang', lang);
	// });
});