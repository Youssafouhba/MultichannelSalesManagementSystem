import { Avatar } from "@windmill/react-ui";
import moment from "moment";
import React from "react";

const ChatUserCard = ({ participantsName, lastMessage, lastMessageTime, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className="flex items-center my-4 transition duration-100 hover:ease-in dark:hover:bg-gray-600 hover:bg-gray-300 rounded-lg cursor-pointer"
    >
      <div className="mr-5 m-1 relative">
        <Avatar
          className="hidden md:inline-block"
          src={"https://res.cloudinary.com/dlkvn0fpz/image/upload/v1722530752/pfsfiles/sg4ebvzr3yjfpteme7xz.webp"}
          alt="user icon"
        />
      </div>
      <div>
        <p className="text-gray-800 dark:text-gray-300 text-sm">
          {participantsName}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-xs">
          {lastMessage}
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-xs">
          {lastMessageTime ? moment(lastMessageTime).format('hh:mm A') : ""}
        </p>
      </div>
    </div>
  );
};

export default ChatUserCard;
