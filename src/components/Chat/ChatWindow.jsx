import MessageBubble from "./MessageBubble";
import CitationCard from "./CitationCard";
import "../../chat.css";

export default function ChatWindow({ messages, messagesEndRef }) {
  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="empty-state">
          <h2>Welcome to OpsMind AI</h2>
          <p>Upload documents and ask questions to get instant answers</p>
        </div>
      ) : (
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message-group ${message.type}`}>
              {message.type === "error" ? (
                <div style={{
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#fca5a5",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  maxWidth: "80%",
                  wordWrap: "break-word"
                }}>
                  {message.text}
                </div>
              ) : (
                <>
                  <MessageBubble message={message} />
                  {message.sources && message.sources.length > 0 && (
                    <div className="citations">
                      {message.sources.map((source, idx) => (
                        <CitationCard key={idx} source={source} index={idx + 1} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
