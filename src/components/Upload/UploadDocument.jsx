import { useState } from "react";
import "../../upload.css";

export default function UploadDocument({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      await onUpload(file);
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <label className="upload-label">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={loading}
        />
        <span>{file ? file.name : "Choose PDF"}</span>
      </label>
      <button type="submit" disabled={!file || loading} className="btn-upload-submit">
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
