export default function MessageBubble({ message }) {
  return (
    <div className={`message-bubble ${message.type}`}>
      <p>{message.text}</p>
      {message.type === "ai" && message.sources && message.sources.length > 0 && (
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(99, 102, 241, 0.2)" }}>
          <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.6)", marginBottom: "8px" }}>
            <strong>Source:</strong>
          </div>
          {message.sources.map((source, idx) => (
            <div key={idx} style={{ fontSize: "12px", color: "rgba(99, 102, 241, 0.8)", marginBottom: "4px" }}>
              📄 {source.documentFilename}, Page {source.pageNumber}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
