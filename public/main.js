const socket = io();

$('#div-chat').hide();

socket.on('PICK_ANOTHER_USERNAME', () => alert('Choose another username'));

socket.on('SIGN_UP_SUCCESSFULLY', arrUsername => {
    $('#div-chat').show();
    $('#div-dang-ky').hide();

    arrUsername.forEach(username => $('#ul-username').append(`<li>${username}</li>`));
    socket.on('NEW_USER_SIGN_UP', username => $('#ul-username').append(`<li>${username}</li>`));
});

$('#btn-dang-ky').click(() => {
    const username = $('#txt-username').val();
    socket.emit('CLIENT_SIGN_UP', username);
});