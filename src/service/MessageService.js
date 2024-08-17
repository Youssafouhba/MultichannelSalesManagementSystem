import { Client } from '@stomp/stompjs';
import axios from 'axios';

import { messaging_url } from "../constant/GlobalsVeriables";

var SockJS = require('sockjs-client/dist/sockjs.js');


const baseUrl = messaging_url;
const wsUrl = `${messaging_url}/secured/chat`;

class MessageService {
  static instance;

  constructor(token, onMessageReceived) {
    if (MessageService.instance) {
      return MessageService.instance;
    }
        this.onMessageReceived = onMessageReceived;

    this.client = new Client({
     // debug: (str) => { console.log(str); },
      brokerURL: wsUrl,
      connectHeaders: { Authorization: `Bearer ${token}` },
      appendMissingNULLonIncoming: true,
      onConnect: () => this.subscribe("/user/admin/queue/messages", token),
      onStompError: (err) => this.onError(err),
    });

    this.client.webSocketFactory = function () {
      return new SockJS(wsUrl);
    };


    this.instance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    MessageService.instance = this;
  }

  activate() {
    this.client.activate();
  }

  deactivate() {
    this.client.deactivate();
  }

  subscribe(destination, token) {
    this.client.subscribe(destination, this.onMessageReceived, {
      Authorization: `Bearer ${token}`,
    });
  }

  onError(err) {
    console.log(err);
  }

  sendMessage(destination, message, token) {
    this.client.publish({
      destination: destination,
      body: JSON.stringify(message),
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getConversation(token, id) {
    return this.instance.get(`/getConversation/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  getMyConversations(token) {
    return this.instance.get('/getMyConversations', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export default MessageService;
