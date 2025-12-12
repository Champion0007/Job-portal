const fs = require('fs');
let pdfParse = null;
let mammoth = null;
try {
  pdfParse = require('pdf-parse');
} catch (e) {
  // optional dependency not installed
}
try {
  mammoth = require('mammoth');
} catch (e) {
  // optional dependency not installed
}
let openai = null;
// Do NOT instantiate OpenAI at module load time to avoid hard crashes if env is misconfigured.
// We'll lazily initialize inside parseResume when needed.

const extractText = async (filePath, mimeType) => {
  const buffer = fs.readFileSync(filePath);
  if (mimeType === 'application/pdf') {
    if (!pdfParse) throw new Error("Missing dependency 'pdf-parse'. Run 'npm install pdf-parse' in backend to enable PDF parsing.");
    const data = await pdfParse(buffer);
    return data.text;
  }
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    if (!mammoth) throw new Error("Missing dependency 'mammoth'. Run 'npm install mammoth' in backend to enable DOCX parsing.");
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }
  return buffer.toString('utf8');
};

const parseResume = async (filePath, mimeType) => {
  const text = await extractText(filePath, mimeType);
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      return { raw: text, parsedJSON: null, message: 'OpenAI API key not configured. Set OPENAI_API_KEY to enable parsing.' };
    }
    // Try to initialize OpenAI lazily
    try {
      const OpenAI = require('openai');
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } catch (e) {
      console.error('Unable to initialize OpenAI client:', e.message || e);
      return { raw: text, parsedJSON: null, message: 'OpenAI initialization failed: ' + (e.message || String(e)) };
    }
  }

  const prompt = `Extract a JSON object from the resume text with keys: contact, summary, skills (array), experience (array of {title,company,from,to,description}), education (array). Resume text:\n${text}`;
  // Use the OpenAI Responses API or Chat completions depending on SDK; keep a simple call here
  try {
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800
    });
    const content = resp.choices?.[0]?.message?.content || resp?.choices?.[0]?.text || '';
    try {
      const json = JSON.parse(content);
      return json;
    } catch (err) {
      return { raw: text, parsedRaw: content };
    }
  } catch (err) {
    console.error('Error calling OpenAI:', err.message || err);
    return { raw: text, parsedJSON: null, message: 'OpenAI error: ' + (err.message || String(err)) };
  }
};

module.exports = { extractText, parseResume };
