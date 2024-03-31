import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../helpers/Logics";
import { useChat } from "../../context/chatContext";
import { Avatar, Image, Text, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = useChat();

  return (
    <>
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <div style={{ display: "flex" }} key={i}>
                {isSameSender(messages, m, i, user._id) ||
                  (isLastMessage(messages, i, user._id) && (
                    <>
                      <Avatar
                        mt="7px"
                        mr={1}
                        size="sm"
                        cursor="pointer"
                        name={m.sender.name}
                        src={m.sender.pic}
                      />
                    </>
                  ))}

                <span
                  style={{
                    backgroundColor: `${
                      m.sender._id === user._id ? "blue" : "white"
                    }`,
                    color: `${m.sender._id === user._id ? "white" : "black"}`,
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 25px",
                    maxWidth: "75%",
                    fontSize: "15px",
                  }}
                >
                  {m.content}
                  {m.attachments && m.attachments.length > 0 && (
                    <div>
                      {m.attachments.map((attachment, index) => (
                        <div key={index}>
                          {attachment.type === "image" && (
                            <Image
                              src={attachment.url}
                              alt={attachment.alt}
                              style={{ width: "100px" }}
                            />
                          )}
                          {attachment.type === "audio" && (
                            <audio controls>
                              <source
                                src={attachment.url}
                                type="audio/mp3"
                                con
                              />
                              Your browser does not support the audio element.
                            </audio>
                          )}
                          {attachment.type === "video" && (
                            <video
                              src={attachment.url}
                              controls
                              style={{ width: "300px" }}
                            ></video>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </span>
              </div>
            </Tooltip>
          ))}
      </ScrollableFeed>
    </>
  );
};

export default ScrollableChat;
