export default function MessageBubble({ message }) {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "#10b981"; // green
    if (confidence >= 60) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  return (
    <div className={`message-bubble ${message.type}`}>
      <p>{message.text}</p>
      {message.type === "ai" && (
        <div style={{ marginTop: "8px", fontSize: "12px", opacity: 0.8 }}>
          {message.confidence !== undefined && (
            <div style={{ marginBottom: "4px" }}>
              <span style={{ color: getConfidenceColor(message.confidence) }}>
                ● Confidence: {message.confidence}%
              </span>
            </div>
          )}
          {message.responseTime && (
            <span>⏱ {(message.responseTime / 1000).toFixed(2)}s</span>
          )}
        </div>
      )}
    </div>
  );
}
