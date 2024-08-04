package com.wholesaled.messagin.config;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class CustomWebSocketHandler extends TextWebSocketHandler {

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        if (message instanceof TextMessage) {
            TextMessage msg = (TextMessage) message;
            String payload = msg.getPayload();
            message = new TextMessage(payload + "\u0000");
        }
        super.handleMessage(session, message);
    }
}