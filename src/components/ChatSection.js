import { Badge, Card, CardBody, Label } from "@windmill/react-ui";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

const ChatSection = ({ messages, setMessages, messageService, receiver, token }) => {
  const messagesEndRef = useRef(null);
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const joinMessage = {
      from: "admin",
      to: receiver,
      content: messageContent,
      timestamp: new Date()
    };

    messageService.sendMessage("/app/tg3edlappel", joinMessage, token);
    setMessages((prevMessages) => [...prevMessages, { ...joinMessage }]);
    setMessageContent("");
  };

  let lastDate = null;

  return (
    <div className="mt-3 mb-8 mr-4 h-screen flex flex-col">
      <Card className="shadow-md relative flex-grow overflow-y-auto">
        <CardBody>
          {messages.map((message, id) => {
            const messageDate = moment(message.timestamp).format('DD/MM/YYYY');
            const showDateBadge = messageDate !== lastDate;
            lastDate = messageDate;

            return (
              <div key={id} className="mb-4">
                {showDateBadge && (
                  <div className="text-center my-2">
                    <Badge type="neutral">
                      <p className="text-xs m-2">{messageDate}</p>
                    </Badge>
                  </div>
                )}
                <div className={`block ${message.to === "admin" ? "text-left" : "text-right"}`}>
                  <Badge type={message.to === "admin" ? "neutral" : "success"}>
                    <p className="text-sm m-3">{message.content}</p>
                  </Badge>
                  <p className={`text-xs mt-1 px-2 ${message.to === "admin" ? "text-left" : "text-right"}`}>
                    {message.timestamp ? moment(message.timestamp).format('hh:mm A') : ""}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </CardBody>
      </Card>
      <div>
        <Label className="">
          <div className="relative text-gray-500 focus-within:text-purple-600">
            <input
              onChange={(e) => setMessageContent(e.target.value)}
              value={messageContent}
              className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
              placeholder="Type your message here"
            />
            <button
              onClick={sendMessage}
              className="absolute inset-y-0 right-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            >
              Send
            </button>
          </div>
        </Label>
      </div>
    </div>
  );
};

export default ChatSection;