import { connectToServer } from './socket-client'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h3>Client webSocket<span id='username'></span></h3>

    <div id='container-connect' class=''>
      <input id="input-username" placeholder="Enter your username" />
      <select id="select-channel">
        <option value='events'>Events</option>
        <option value='posts'>Posts</option>
      <select>
      <button id="btn-connect">Connect</button>
      <br/>
    </div>

    <br/>
    <span id="server-status">offline</span>

    <div id='container-connected' class='offline'>
      <ul id="clients-ul"></ul>

      <form id="message-form">
        <input placeholder="message" id="message-input" />
      </form>

      <h3>Messages</h3>
      <ul id="messages-ul"></ul>
    </div>   

  </div>
`

//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const inputUsername = document.querySelector<HTMLInputElement>('#input-username')!;
const selectChannel = document.querySelector<HTMLSelectElement>('#select-channel')!;
const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect')!;

btnConnect.addEventListener('click', () => {

  if ( inputUsername.value.trim().length <= 0 ) return alert('Enter a valid Username');

  connectToServer(inputUsername.value.trim(), selectChannel.value);
})
