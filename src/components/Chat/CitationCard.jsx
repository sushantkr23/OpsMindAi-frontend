export default function CitationCard({ source, index }) {
  return (
    <div className="citation-card">
      <div className="citation-header">
        <span className="citation-number">[{index}]</span>
        <span className="citation-source" title={source.documentFilename || source.documentId}>
          {source.documentFilename || source.documentId}
        </span>
      </div>
      <p className="citation-page">📄 Page {source.pageNumber}</p>
      <p className="citation-score">
        ✓ Relevance: {(source.similarityScore * 100).toFixed(1)}%
      </p>
    </div>
  );
}
