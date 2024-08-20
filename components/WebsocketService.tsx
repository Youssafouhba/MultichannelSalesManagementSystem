import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { jwtDecode } from 'jwt-decode';
import config from '@/components/config';

class WebSocketService {
  private client: Client | null = null;
  private token: string = '';
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 5000;
  private onNotificationReceivedCallback: ((notification: any) => void) | null = null;
  private onOrderUpdateCallback: ((orderUpdate: any) => void) | null = null;

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

  public setNotificationCallback(callback: (notification: any) => void): void {
    this.onPublicNotificationReceived = callback;
  }

  public setOrderUpdateCallback(callback: (orderUpdate: any) => void): void {

    this.onOrderUpdateCallback = callback;
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

    this.client.webSocketFactory = () => new SockJS(`${this.apiBaseUrl}/notifications`);
    this.client.onConnect = this.onConnected.bind(this);
    this.client.onStompError = this.onError.bind(this);

    this.client.activate();
  }

  private onConnected(): void {
    console.log('WebSocket connected');
    this.reconnectAttempts = 0;
    if (this.client) {
      const userId = jwtDecode(this.token).userid;
      this.client.subscribe(`/user/${userId}/queue/orders`, this.onOrderUpdateReceived.bind(this));
      this.client.subscribe('/topic/public-notifications', this.onPrivateNotificationReceived.bind(this));
      this.client.subscribe(`/user/${userId}/queue/notifications`, this.onPublicNotificationReceived.bind(this));
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

  private onOrderUpdateReceived(message: any): void {
    const parsedMessage = JSON.parse(message.body);
    if (this.onOrderUpdateCallback) {
      this.onOrderUpdateCallback(parsedMessage);
    }
  }

  private onPublicNotificationReceived(payload: any) {
    const notification = JSON.parse(payload.body);
    if (this.onPublicNotificationReceived) {
      this.onPublicNotificationReceived(notification);
    }
    //console.log('Received public notification:', notification);
    //this.notificationsCount = this.notificationsCount + 1
    //setNotifications(prevNotifications => [notification, ...prevNotifications]);
  };

  private onPrivateNotificationReceived(payload: any) {
      //console.log('Received private notification:', payload);
      //this.notificationsCount = this.notificationsCount + 1
      const notification = JSON.parse(payload.body);
      if (this.onPrivateNotificationReceived) {
        this.onPrivateNotificationReceived(notification);
      }
      //setNotifications(prevNotifications => [notification, ...prevNotifications]);
  };

  public sendMessage(destination: string, body: any): void {
    if (this.client && this.client.connected) {
      this.client.publish({ destination, body: JSON.stringify(body) });
    } else {
      console.error('WebSocket is not connected');
    }
  }
}

export default WebSocketService;
