package com.chatapp.chatwebsocket.controller;

import com.chatapp.chatwebsocket.beans.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;
    @MessageMapping("/hello")
    @SendTo("/topic/greeting")
    public ChatMessage handleChatMessage( ChatMessage message) {

        System.out.print(message);
        return  new ChatMessage(message.getMessage());
    }
}
