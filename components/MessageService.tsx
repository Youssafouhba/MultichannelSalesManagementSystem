import { Client } from '@stomp/stompjs';
var SockJS = require('sockjs-client/dist/sockjs.js');

class MessageService {
    private static instance: MessageService | null = null;
    private token: string = '';
    private email: string = '';
    private messagingClient: Client | null = null;
    private callbacks = {
        onMessageReceived: null as ((message: any) => void) | null,
        onMessageSent: null as ((destination: string, body: any) => void) | null,
    };
    private constructor(token: string,email: string) {}
    public static getInstance(token: string,email: string): MessageService {
        if (!MessageService.instance) {
            MessageService.instance = new MessageService(token,email);
        }
        return MessageService.instance;
    }
    private onError(frame: any): void {
        console.error('STOMP error:', frame);
    }
    public connectMessaging(email: string): void {
        this.email = email;
        this.initializeMessagingClient();
    }
    private createClient(url: string, onConnectCallback: () => void): Client {
        const client = new Client({
          brokerURL: url,
          connectHeaders: { Authorization: `Bearer ${this.token}` },
          debug: (str) => console.log(str),
          appendMissingNULLonIncoming: true,
        });
    
        client.webSocketFactory = () => new SockJS(url);
        client.onConnect = onConnectCallback;
        client.onStompError = this.onError.bind(this);
        client.onDisconnect = this.onDisconnect.bind(this);
        client.activate();
    
        return client;
    }
    public setCallback<T extends keyof typeof this.callbacks>(
        type: T,
        callback: typeof this.callbacks[T]
      ): void {
        this.callbacks[type] = callback;
      }
    private initializeMessagingClient(): void {
        this.messagingClient = this.createClient(
          'https://messaging.wholesaled.xyz/secured/chat',
          this.onMessagingConnected.bind(this)
        );
    }

    private onMessagingConnected(): void {
        console.log('Messaging WebSocket connected');
        this.messagingClient?.subscribe(`/user/${this.email}/queue/messages`, this.onMessageReceived.bind(this));
    }

    public onDisconnect(): void {
        console.log('WebSocket disconnected');
    }
    
    private onMessageReceived(payload: any): void {
        const message = JSON.parse(payload.body);
        this.callbacks.onMessageReceived?.(message);
    }
    public sendMessage(destination: string, body: any): void {
        if (this.messagingClient?.connected) {
          this.messagingClient.publish({ destination, body: JSON.stringify(body) });
          this.callbacks.onMessageSent?.(destination, body);
        } else {
          console.error('Messaging WebSocket is not connected');
        }
      }
}

export default MessageService;
