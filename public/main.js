const socket = io();
let receiver;
let roomName;

$('#div-chat').hide();

socket.on('PICK_ANOTHER_USERNAME', () => alert('Choose another username'));

socket.on('SIGN_UP_SUCCESSFULLY', arrUsername => {
    $('#div-chat').show();
    $('#div-dang-ky').hide();

    arrUsername.forEach(username => $('#ul-username').append(`<li id="xsocketuser-${username}">${username}</li>`));
    socket.on('NEW_USER_SIGN_UP', username => $('#ul-username').append(`<li id="xsocketuser-${username}">${username}</li>`));
});

$('#btn-dang-ky').click(() => {
    const username = $('#txt-username').val();
    socket.emit('CLIENT_SIGN_UP', username);
});

$('#btn-send').click(() => {
    const message = $('#txt-message').val();
    socket.emit('CLIENT_SEND_MESSAGE', message);
});

$('#btn-send-private').click(() => {
    const message = $('#txt-message').val();
    socket.emit('CLIENT_SEND_PRIVATE_MESSAGE', { message, receiver });
});

$('#btn-send-room').click(() => {
    const message = $('#txt-message').val();
    socket.emit('CLIENT_SEND_ROOM_MESSAGE', { message, roomName });
});

// $('#ul-message li').click(() => console.log('a'));
$('#ul-username').on('click', 'li', function() { 
    receiver = $(this).text();
    $('#ul-username li').removeClass('active');
    $(this).addClass('active');
});

$('#ul-room li').click(function() {
    roomName = $(this).text();
    $('#ul-room li').removeClass('active');
    $(this).addClass('active');
    socket.emit('CLIENT_JOIN_ROOM', roomName);
});

socket.on('NEW_MESSAGE', message => $('#ul-message').append(`<li>${message}</li>`));

socket.on('NEW_PRIVATE_MESSAGE', message => $('#ul-message').append(`<li style="color: green">${message}</li>`));

socket.on('NEW_ROOM_MESSAGE', message => $('#ul-message').append(`<li style="color: blue">${message}</li>`));

socket.on('USER_DISCONNECT', username => {
    $(`#xsocketuser-${username}`).remove();
});

