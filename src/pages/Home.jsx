import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { queryAPI, uploadAPI, documentAPI } from "../services/api";
import toast from "react-hot-toast";
import Navbar from "../components/Layout/Navbar";
import ChatWindow from "../components/Chat/ChatWindow";
import UploadDocument from "../components/Upload/UploadDocument";
import "../home.css";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      loadDocuments();
    }
  }, [isAuthenticated, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadDocuments = async () => {
    try {
      const response = await documentAPI.list();
      const docs = response.data.data || [];
      setDocuments(docs);
      console.log("Documents loaded:", docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
      toast.error("Failed to load documents");
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (selectedDocs.length === 0) {
      toast.error("Please select at least one document");
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: question,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      console.log("Sending query:", { question, documentIds: selectedDocs });
      
      const response = await queryAPI.ask(question, selectedDocs);
      
      console.log("Response received:", response);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to get answer");
      }

      // Extract answer data
      const answerData = response.data.data || response.data;
      const answer = answerData.answer || "No answer generated";
      const sources = answerData.sources || [];
      const confidence = answerData.confidence || 0;
      const responseTime = answerData.responseTime || 0;

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        text: answer,
        sources: sources,
        confidence: confidence,
        responseTime: responseTime,
        timestamp: new Date()
      };

      console.log("AI Message:", aiMessage);
      setMessages((prev) => [...prev, aiMessage]);
      toast.success("Answer generated successfully!");

    } catch (error) {
      console.error("Query error:", error);

      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "Failed to get answer. Please try again.";

      const errorMsg = {
        id: Date.now() + 1,
        type: "error",
        text: errorMessage,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, errorMsg]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    try {
      console.log("Uploading file:", file.name);
      await uploadAPI.uploadDocument(file);
      toast.success("Document uploaded successfully!");
      setShowUpload(false);
      loadDocuments();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload failed");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="home-container">
      <Navbar />

      <div className="home-content">
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>📄 Documents</h3>
            <button
              className="btn-upload"
              onClick={() => setShowUpload(!showUpload)}
              title="Upload PDF"
            >
              + Upload
            </button>
          </div>

          {showUpload && (
            <UploadDocument onUpload={handleUpload} />
          )}

          <div className="documents-list">
            {documents.length === 0 ? (
              <div style={{ 
                padding: "15px", 
                color: "var(--text-light)", 
                fontSize: "12px",
                textAlign: "center"
              }}>
                <p>📭 No documents yet</p>
                <p style={{ fontSize: "11px", marginTop: "5px" }}>
                  Upload a PDF to get started
                </p>
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc._id}
                  className={`doc-item ${selectedDocs.includes(doc._id) ? "selected" : ""}`}
                  onClick={() =>
                    setSelectedDocs((prev) =>
                      prev.includes(doc._id)
                        ? prev.filter((id) => id !== doc._id)
                        : [...prev, doc._id]
                    )
                  }
                  title={`Click to ${selectedDocs.includes(doc._id) ? "deselect" : "select"}`}
                >
                  <span className="doc-name">📋 {doc.originalName}</span>
                  <span className="doc-pages">📄 {doc.totalPages} pages</span>
                </div>
              ))
            )}
          </div>

          {selectedDocs.length > 0 && (
            <div style={{
              padding: "10px",
              background: "rgba(99, 102, 241, 0.1)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "6px",
              margin: "10px",
              fontSize: "12px",
              color: "var(--text-light)"
            }}>
              ✓ {selectedDocs.length} document{selectedDocs.length > 1 ? "s" : ""} selected
            </div>
          )}
        </div>

        <div className="chat-section">
          <ChatWindow messages={messages} messagesEndRef={messagesEndRef} />

          <form onSubmit={handleAsk} className="input-form">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                selectedDocs.length === 0
                  ? "Select a document first..."
                  : "Ask a question about your documents..."
              }
              disabled={loading || selectedDocs.length === 0}
            />
            <button 
              type="submit" 
              disabled={loading || selectedDocs.length === 0} 
              className="btn-send"
              title="Send question"
            >
              {loading ? "⏳" : "📤"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
