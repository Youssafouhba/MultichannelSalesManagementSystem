// WebSocketService.ts
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { jwtDecode } from 'jwt-decode';
import config from '@/components/config';
import { useAppContext } from './AppContext';

class WebSocketService {
  public notificationsCount = 0
  private client: Client | null = null;
  private token: string = '';
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 5000;
  private onMessageCallback: ((message: any) => void) | null = null;

  constructor(private apiBaseUrl: string) {}

  public connect(token: string): void {
    this.token = token;
    this.initializeClient();
  }

  public disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.reconnectAttempts = 0;
  }

  public setOnMessageCallback(callback: (message: any) => void): void {
    this.onMessageCallback = callback;
  }

  private initializeClient(): void {
    this.client = new Client({
      brokerURL: `${this.apiBaseUrl}/notifications`,
      connectHeaders: { Authorization: `Bearer ${this.token}` },
      debug: (str) => console.log(str),
      reconnectDelay: this.reconnectInterval,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.webSocketFactory = () => {
      return new SockJS(`${this.apiBaseUrl}/notifications`);
    };

    this.client.onConnect = this.onConnected.bind(this);
    this.client.onStompError = this.onError.bind(this);

    this.client.activate();
  }

  private onConnected(): void {
    console.log('WebSocket connected');
    this.reconnectAttempts = 0;
    if (this.client) {
      const userId = jwtDecode(this.token).userid;
      this.client.subscribe('/topic/public-notifications', this.onMessageReceived.bind(this));
      this.client.subscribe(`/user/${userId}/queue/notifications`, this.onMessageReceived.bind(this));
    }
  }

  private onError(frame: any): void {
    console.error('STOMP error:', frame);
    this.handleReconnect();
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.initializeClient(), this.reconnectInterval);
    } else {
      console.error('Max reconnect attempts reached. Please check your connection.');
    }
  }

  private onMessageReceived(message: any): void {
    const parsedMessage = JSON.parse(message.body);
    console.log('Received message:', parsedMessage);
    console.log(this.notificationsCount++)
    if (this.onMessageCallback) {
      this.onMessageCallback(parsedMessage);
    }
  }

  public sendMessage(destination: string, body: any): void {
    if (this.client && this.client.connected) {
      this.client.publish({ destination, body: JSON.stringify(body) });
    } else {
      console.error('WebSocket is not connected');
    }
  }
}

export default WebSocketService;