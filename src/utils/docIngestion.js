import mammoth from "mammoth";

/**
 * Extract plain text from an uploaded .docx File using mammoth.
 * @param {File} file - A File object from an <input type="file"> element.
 * @returns {Promise<string>} Extracted text content.
 */
export function extractDocxText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value || "");
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read .docx file"));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Attempt to extract text from a PDF using a simple BT/ET stream approach.
 * Does NOT use pdfjs-dist. Works best on simple/unencrypted PDFs.
 * @param {File} file - A File object for a .pdf.
 * @returns {Promise<string|null>} Extracted text, or null if extraction failed.
 */
export function extractPdfText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bytes = new Uint8Array(event.target.result);
        // Decode as Latin-1 to preserve byte values
        const raw = new TextDecoder("latin1").decode(bytes);

        // Extract text between BT (Begin Text) and ET (End Text) markers
        const segments = [];
        const btEtPattern = /BT[\s\S]*?ET/g;
        let btMatch;
        while ((btMatch = btEtPattern.exec(raw)) !== null) {
          const block = btMatch[0];
          // Match Tj and TJ operators for text strings
          // Tj: (text)Tj or <hex>Tj
          const tjPattern = /\(([^)]*)\)\s*Tj/g;
          let tjMatch;
          while ((tjMatch = tjPattern.exec(block)) !== null) {
            segments.push(tjMatch[1]);
          }
          // TJ: [(text) offset (text) ...]TJ
          const tjArrayPattern = /\[([^\]]*)\]\s*TJ/g;
          let tjArrayMatch;
          while ((tjArrayMatch = tjArrayPattern.exec(block)) !== null) {
            const inner = tjArrayMatch[1];
            const innerTj = /\(([^)]*)\)/g;
            let innerMatch;
            while ((innerMatch = innerTj.exec(inner)) !== null) {
              segments.push(innerMatch[1]);
            }
          }
        }

        if (segments.length === 0) {
          // Fallback: try to extract any printable text using simple heuristic
          const printable = raw.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s{3,}/g, "\n").trim();
          const meaningful = printable
            .split("\n")
            .filter((line) => line.trim().length > 4)
            .join("\n");
          resolve(meaningful.length > 20 ? meaningful : null);
          return;
        }

        // Clean up PDF escape sequences
        const text = segments
          .join(" ")
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "")
          .replace(/\\t/g, "\t")
          .replace(/\\\(/g, "(")
          .replace(/\\\)/g, ")")
          .replace(/\\\\/g, "\\")
          .trim();

        resolve(text || null);
      } catch (err) {
        console.warn("[docIngestion] PDF text extraction failed:", err);
        resolve(null);
      }
    };
    reader.onerror = () => resolve(null);
    reader.readAsArrayBuffer(file);
  });
}
