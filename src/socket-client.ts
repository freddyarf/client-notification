import { Manager, Socket } from 'socket.io-client';

let socket: Socket;

export const connectToServer = (username: string, channel: string) => {

    const manager = new Manager('http://localhost:3500/socket.io/socket.io.js', {
            extraHeaders: {
                userName: username
            }
        });
    
    socket?.removeAllListeners();
    socket = manager.socket(`/${channel}`);

    addListeners(username, channel);
}


const addListeners = (username: string, channel: string) => {

    const clientsUl = document.querySelector('#clients-ul')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
    const serverStatusLabel = document.querySelector('#server-status')!;
    const containerConnect = document.querySelector('#container-connect')!;
    const containerConnected = document.querySelector('#container-connected')!;
    const spanUsername = document.querySelector('#username')!;

    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'connected';
        containerConnect.classList.add('offline');
        containerConnected.classList.remove('offline');
        spanUsername.innerHTML = ` - ${username} (${channel})`;
    });

    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'disconnected';
        containerConnect.classList.remove('offline');
        containerConnected.classList.add('offline');
        spanUsername.innerHTML = '';
    });

    socket.on('clients-updated', (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach( clientId => {
            clientsHtml += `
                <li>${ clientId }</li>
            `
        });
        clientsUl.innerHTML = clientsHtml;
    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if( messageInput.value.trim().length <= 0 ) return;

        socket.emit(`${channel.slice(0,-1)}-from-client`, { 
            id: 'me', 
            message: messageInput.value 
        });

        messageInput.value = '';
    });

    socket.on(`${channel.slice(0,-1)}-from-server`, ( payload: { fullName: string, message: string }) => {
        const newMessage = `
            <li>
                <strong>${ payload.fullName }</strong>
                <span>${ payload.message }</span>
            </li>
        `;
        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messagesUl.append( li );
    })
}