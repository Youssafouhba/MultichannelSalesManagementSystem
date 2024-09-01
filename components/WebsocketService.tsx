import { Client } from '@stomp/stompjs';
import { jwtDecode } from 'jwt-decode';
import SockJS from 'sockjs-client';

class WebSocketService {
  private static instance: WebSocketService | null = null;
  private notificationClient: Client | null = null;
  private token: string = '';
  private email: string = '';
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 5;
  private readonly reconnectInterval: number = 5000;
  private readonly heartbeatInterval: number = 10000; // 30 seconds
  private lastHeartbeat: number = Date.now();
  private connectionState: 'connecting' | 'connected' | 'disconnected' = 'disconnected';
  private heartbeatTimer: NodeJS.Timeout | null = null;

  private callbacks = {
    onNotificationReceived: null as ((notification: any) => void) | null,
    onOrderUpdate: null as ((orderUpdate: any) => void) | null,
    onConnectionStateChange: null as ((state: 'connecting' | 'connected' | 'disconnected') => void) | null,
  };

  private constructor(private apiBaseUrl: string) {}

  public static getInstance(apiBaseUrl: string): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(apiBaseUrl);
    }
    return WebSocketService.instance;
  }

  public connect(token: string): void {
    this.token = token;
    this.initializeNotificationClient();
  }



  public isConnected(): boolean {
    return this.connectionState === 'connected' &&
      this.notificationClient?.connected
  }

  public setCallback<T extends keyof typeof this.callbacks>(
    type: T,
    callback: typeof this.callbacks[T]
  ): void {
    this.callbacks[type] = callback;
  }



  private initializeNotificationClient(): void {
    this.notificationClient = this.createClient(
      `${this.apiBaseUrl}/notifications`,
      this.onNotificationConnected.bind(this)
    );
  }


  private createClient(url: string, onConnectCallback: () => void): Client {
    const client = new Client({
      brokerURL: url,
      connectHeaders: { Authorization: `Bearer ${this.token}` },
      debug: (str) => console.log(str),
      reconnectDelay: this.reconnectInterval,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
    });

    client.webSocketFactory = () => new SockJS(url);
    client.onConnect = onConnectCallback;
    client.onStompError = this.onError.bind(this);
    client.onDisconnect = this.onDisconnect.bind(this);
    client.activate();

    return client;
  }

  private onNotificationConnected(): void {
    console.log('Notification WebSocket connected');
    this.setConnectionState('connected');
    const userId = jwtDecode(this.token).userid;
    this.notificationClient?.subscribe(`/user/${userId}/queue/orders`, this.onOrderUpdateReceived.bind(this));
    this.notificationClient?.subscribe('/topic/public-notifications', this.onPublicNotificationReceived.bind(this));
    this.notificationClient?.subscribe(`/user/${userId}/queue/notifications`, this.onPublicNotificationReceived.bind(this));
    this.startHeartbeat();
  }


  private setConnectionState(state: 'connecting' | 'connected' | 'disconnected'): void {
    this.connectionState = state;
    this.callbacks.onConnectionStateChange?.(state);
    if (state === 'connected') {
      this.reconnectAttempts = 0;
    }
  }

  public onDisconnect(): void {
    console.log('WebSocket disconnected');

    if (this.notificationClient) {
      this.notificationClient.deactivate();
      this.notificationClient = null;
    }

    this.setConnectionState('disconnected');
    this.stopHeartbeat();
    this.handleReconnect();
  }

  private onError(frame: any): void {
    console.error('STOMP error:', frame);
    this.stopHeartbeat();
    this.handleReconnect();
  }





  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.setConnectionState('connecting');
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      const delay = Math.min(30000, Math.pow(2, this.reconnectAttempts) * 1000);
      setTimeout(() => {
        this.initializeNotificationClient();
      }, delay);
    } else {
      console.error('Max reconnect attempts reached. Please check your connection.');
      this.setConnectionState('disconnected');
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.sendHeartbeat();
      }
      this.checkConnection();
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private sendHeartbeat(): void {
    this.notificationClient?.publish({ destination: '/app', body: '' });
    this.lastHeartbeat = Date.now();
  }

  private checkConnection(): void {
    if (Date.now() - this.lastHeartbeat > this.heartbeatInterval * 2) {
      console.log('No heartbeat received, reconnecting...');
      this.stopHeartbeat();
      this.handleReconnect();
    }
  }

  private onOrderUpdateReceived(message: any): void {
    const parsedMessage = JSON.parse(message.body);
    this.callbacks.onOrderUpdate?.(parsedMessage);
  }

  private onPublicNotificationReceived(payload: any): void {
    const notification = JSON.parse(payload.body);
    this.callbacks.onNotificationReceived?.(notification);
  }

}

export default WebSocketService;