import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender } from "../config/chatLogics";
import { useContext ,useEffect} from "react";
import { chatContext } from "../Context/context";
import { Tooltip } from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { isSameSenderMargin } from "../config/chatLogics";
import { isSameUser } from "../config/chatLogics";

const ScrollableChat = ({ messages }) => {
  const { user } = useContext(chatContext);

  useEffect(() => {
    console.log("Current User:", user);
    console.log("Messages:", messages);
  }, [user, messages]);


  if (!Array.isArray(messages)) return null;

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div key={m._id} style={{ display: "flex" }}>
            {(isSameSender(messages, m, i, user?._id) ||
              isLastMessage(messages, i, user?._id)) && (
              <Tooltip label={m.sender?.name} placement="bottom-start" hasArrow>
                <Avatar
                  size="sm"
                  name={m.sender?.name || "Username"}
                  src={m.sender?.pic || "https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"}
                  cursor={"pointer"}
                  mr={1}
                  mt={"7px"}
                />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor:
                  String(m.sender?._id) === String(user?._id)
                    ? "lightgreen"
                    : "lightblue",
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft :isSameSenderMargin(messages,m,i,user?._id),
                marginTop : isSameUser(messages,m,i,user?._id) ? 3:10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
