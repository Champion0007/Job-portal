const fs = require('fs');
let pdfParse = null;
try {
  pdfParse = require('pdf-parse');
} catch (e) {
  // optional dependency not installed
}
let openai = null;
// Do NOT instantiate OpenAI at module load time to avoid hard crashes if env is misconfigured.
// We'll lazily initialize inside parseResume when needed.

const emptyResumeAnalysis = () => ({
  skills: [],
  experience: '',
  education: '',
  summary: '',
});

const KNOWN_SKILLS = [
  'javascript',
  'typescript',
  'react',
  'next.js',
  'node.js',
  'express',
  'mongodb',
  'mongoose',
  'mysql',
  'postgresql',
  'html',
  'css',
  'tailwind css',
  'bootstrap',
  'redux',
  'python',
  'django',
  'flask',
  'java',
  'spring boot',
  'c++',
  'c#',
  'php',
  'laravel',
  'git',
  'github',
  'docker',
  'kubernetes',
  'aws',
  'azure',
  'firebase',
  'rest api',
  'graphql',
  'sql',
  'data structures',
  'machine learning',
  'excel',
  'communication',
];

const SKILL_ALIASES = {
  js: 'javascript',
  'react.js': 'react',
  reactjs: 'react',
  'nextjs': 'next.js',
  'next js': 'next.js',
  node: 'node.js',
  'nodejs': 'node.js',
  'node js': 'node.js',
  expressjs: 'express',
  mongo: 'mongodb',
  tailwind: 'tailwind css',
  postgres: 'postgresql',
  rest: 'rest api',
  apis: 'rest api',
};

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => normalizeStringArray(item))
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/[,;\n|/]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const canonicalSkill = (skill) => {
  const value = String(skill || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  return SKILL_ALIASES[value] || value;
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const skillAppearsInText = (text, skill) => {
  const canonical = canonicalSkill(skill);
  const variants = new Set([
    canonical,
    canonical.replace(/\./g, ''),
    canonical.replace(/\./g, ' '),
  ]);

  return [...variants].some((variant) => {
    const pattern = new RegExp(`(^|[^a-z0-9+#])${escapeRegex(variant)}([^a-z0-9+#]|$)`, 'i');
    return pattern.test(text);
  });
};

const uniqueSkills = (skills) => {
  const seen = new Set();
  return normalizeStringArray(skills).filter((skill) => {
    const canonical = canonicalSkill(skill);
    if (!canonical || seen.has(canonical)) return false;
    seen.add(canonical);
    return true;
  });
};

const extractSkillsFromText = (text = '', candidates = KNOWN_SKILLS) => {
  const source = String(text || '').toLowerCase();
  return uniqueSkills(candidates).filter((skill) => skillAppearsInText(source, skill));
};

const normalizeResumeAnalysis = (value) => {
  const parsed = value && typeof value === 'object' ? value : {};
  return {
    skills: normalizeStringArray(parsed.skills),
    experience:
      typeof parsed.experience === 'string'
        ? parsed.experience
        : Array.isArray(parsed.experience)
          ? parsed.experience
              .map((item) =>
                typeof item === 'string' ? item : Object.values(item || {}).filter(Boolean).join(' ')
              )
              .filter(Boolean)
              .join('\n')
          : '',
    education:
      typeof parsed.education === 'string'
        ? parsed.education
        : Array.isArray(parsed.education)
          ? parsed.education
              .map((item) =>
                typeof item === 'string' ? item : Object.values(item || {}).filter(Boolean).join(' ')
              )
              .filter(Boolean)
              .join('\n')
          : '',
    summary: typeof parsed.summary === 'string' ? parsed.summary : '',
  };
};

const extractText = async (filePath, mimeType) => {
  if (mimeType !== 'application/pdf') {
    throw new Error('Only PDF files are supported');
  }

  const buffer = fs.readFileSync(filePath);
  if (!pdfParse) throw new Error("Missing dependency 'pdf-parse'. Run 'npm install pdf-parse' in backend to enable PDF parsing.");
  if (typeof pdfParse === 'function') {
    const data = await pdfParse(buffer);
    return data.text || '';
  }

  if (pdfParse.PDFParse) {
    const parser = new pdfParse.PDFParse({ data: buffer });
    try {
      const data = await parser.getText();
      return data.text || '';
    } finally {
      await parser.destroy();
    }
  }

  throw new Error("Unsupported 'pdf-parse' version");
};

const parseResume = async (filePath, mimeType) => {
  try {
    const text = await extractText(filePath, mimeType);
    const locallyDetectedSkills = extractSkillsFromText(text);

    if (!openai) {
      if (!process.env.OPENAI_API_KEY) {
        return {
          ...emptyResumeAnalysis(),
          skills: locallyDetectedSkills,
          summary: text.slice(0, 500),
        };
      }

      const OpenAI = require('openai');
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    const prompt = `Return only valid JSON with this exact shape:
{"skills":["string"],"experience":"string","education":"string","summary":"string"}
Extract it from this resume text. Keep summary under 80 words.

Resume text:
${text.slice(0, 12000)}`;

    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 800
    });

    const content = resp.choices?.[0]?.message?.content || resp?.choices?.[0]?.text || '';
    try {
      const json = JSON.parse(content);
      const analysis = normalizeResumeAnalysis(json);
      analysis.skills = uniqueSkills([...analysis.skills, ...locallyDetectedSkills]);
      return analysis;
    } catch (err) {
      return {
        ...emptyResumeAnalysis(),
        skills: locallyDetectedSkills,
        summary: text.slice(0, 500),
      };
    }
  } catch (err) {
    console.error('Resume parse fallback:', err.message || err);
    return emptyResumeAnalysis();
  }
};

const calculateResumeScore = (resumeAnalysis = {}, job = {}) => {
  const resumeSkills = uniqueSkills(resumeAnalysis.skills);
  let requiredSkills = uniqueSkills(job.requiredSkills || job.skills);

  if (requiredSkills.length === 0) {
    requiredSkills = extractSkillsFromText(`${job.title || ''}\n${job.description || ''}`);
  }

  if (requiredSkills.length === 0) {
    return {
      aiScore: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const resumeCanonicalSkills = resumeSkills.map(canonicalSkill);
  const resumeSkillText = resumeCanonicalSkills.join(' ');

  const matchedSkills = requiredSkills.filter((skill) =>
    resumeCanonicalSkills.includes(canonicalSkill(skill)) || skillAppearsInText(resumeSkillText, skill)
  );
  const missingSkills = requiredSkills.filter(
    (skill) => !matchedSkills.some((matched) => canonicalSkill(matched) === canonicalSkill(skill))
  );
  const aiScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return {
    aiScore,
    matchedSkills,
    missingSkills,
  };
};

module.exports = {
  extractText,
  parseResume,
  calculateResumeScore,
  extractSkillsFromText,
  normalizeResumeAnalysis,
  normalizeStringArray,
  emptyResumeAnalysis,
};
