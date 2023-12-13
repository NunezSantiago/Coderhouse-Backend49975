const socket = io()

let messageInput = document.getElementById('message')
let messagesDiv = document.getElementById('messages')

Swal.fire({
    title: "Ingrese un nombre",
    input: "text",
    text: "Nombre:",
    inputValidator: (value) => {
        return !value && "Por favor, ingrese su nombre."
    },
    allowOutsideClick: false
}).then(resultado => {
    socket.emit('id', resultado.value)
    messageInput.focus()

    socket.on('newMessage', data => {
        let message = document.createElement('p')
        message.innerHTML = `<strong>${data.user}</strong>: <i>${data.message}</i>`
        let br = document.createElement('br')

        messagesDiv.appendChild(message, br)

    })

    messageInput.addEventListener('keyup', e => {
        if(e.code === 'Enter' && e.target.value.trim().length > 0){
            socket.emit('message', {user: resultado.value, message: e.target.value.trim()})
            e.target.value = ''
        }
    })

})