import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Default model — gemini-2.0-flash is fast, cheap, and follows instructions well
const getModel = () => genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Simple text generation helper
 */
const generate = async (prompt, systemInstruction = null) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    ...(systemInstruction && { systemInstruction }),
  });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
};

/**
 * JSON generation helper — tells Gemini to only return raw JSON (no fences)
 * type: 'array' | 'object'
 */
const generateJSON = async (prompt, type = "object") => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction:
      `You are a JSON generator. Output ONLY raw valid JSON with absolutely no markdown, ` +
      `no code fences, no explanations, no extra text before or after. ` +
      `Return a JSON ${type} directly.`,
  });

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();

  // Strip any accidental code fences just in case
  text = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();

  // Extract the outermost JSON boundary
  const openChar  = type === "array" ? "[" : "{";
  const closeChar = type === "array" ? "]" : "}";
  const start = text.indexOf(openChar);
  const end   = text.lastIndexOf(closeChar);

  if (start === -1 || end === -1 || end < start) {
    throw new Error(`No JSON ${type} found in Gemini response`);
  }

  return JSON.parse(text.slice(start, end + 1));
};

// ─────────────────────────────────────────────────────────────
// RESUME SUMMARIZER
// ─────────────────────────────────────────────────────────────
const summarizeResumeText = async (rawText) => {
  const prompt = `
You are an expert resume reviewer.

Extract and summarize the following structured information from the resume text below:

Resume:
"""
${rawText}
"""

Return the summary in this format:

- Education: <highest degree, major, college name, year>
- Projects: <2–3 notable projects with tech stack and outcome>
- Experience: <Key roles, company names, durations, responsibilities>
- Skills: <Most relevant technical and soft skills>
- Achievements: <Notable awards, recognitions, rankings>

If any category is missing, simply write "Not mentioned".
`;

  try {
    return await generate(prompt);
  } catch (error) {
    console.error("Resume summarization error:", error.message);
    return "Resume could not be summarized due to an error.";
  }
};

// ─────────────────────────────────────────────────────────────
// INTERVIEW QUESTION GENERATOR
// ─────────────────────────────────────────────────────────────
const generateQuestions = async ({
  num_of_questions,
  interview_type,
  role,
  experience_level,
  company_name,
  company_description,
  job_description,
  focus_area,
  resume_summary,
}) => {
  const prompt = `You are a senior technical interviewer and HR expert specializing in AI-driven interview assessments.

Your task is to generate ${num_of_questions} well-crafted, high-quality ${
    interview_type === "mixed"
      ? "technical and behavioral"
      : interview_type
  } interview questions for a ${experience_level} candidate applying for the role of ${role} at ${
    company_name || "Laar AI"
  }.

Contextual Information:
Company Description: ${company_description || "Not provided."}
Job Description: ${job_description || "Not provided."}
Resume Summary (Projects, Education, Skills, Experience): ${resume_summary || "Not provided."}
Candidate Focus Areas: ${focus_area || "None specified."}

Instructions:
- Generate a diverse mix of questions aligned with the resume, job description, and candidate level.
- For technical questions, focus on core concepts, problem-solving, system design, and resume-aligned skills.
- For behavioral questions, include prompts like "Tell me about yourself.", "What are your strengths and weaknesses?", "Describe a time you overcame a challenge.", "Why do you want this role?".
- Prioritize relevance to the role, resume, and company mission.
- Keep questions clear and concise with a numbered format.

For each question, follow it with:
Preferred Answer: <1–2 sentence ideal answer>

Example:
1. What is a linked list?
   Preferred Answer: A linked list is a linear data structure where each element is a node containing data and a reference to the next node.

2. Tell me about yourself.
   Preferred Answer: I'm a recent Computer Science graduate with a strong interest in frontend development.
`;

  try {
    const generatedText = await generate(prompt);
    const questions = [];
    const lines = generatedText.split("\n");
    let currentQuestion = null;
    let collectingAnswer = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (/^\d+\.\s/.test(line)) {
        if (currentQuestion && currentQuestion.preferred_answer) {
          questions.push(currentQuestion);
        }
        currentQuestion = { question: line.replace(/^\d+\.\s/, "").trim(), preferred_answer: "" };
        collectingAnswer = true;
      } else if (collectingAnswer && line.startsWith("Preferred Answer:")) {
        currentQuestion.preferred_answer = line.replace("Preferred Answer:", "").trim();
        collectingAnswer = false;
      } else if (collectingAnswer && currentQuestion && !currentQuestion.preferred_answer && line.trim()) {
        currentQuestion.preferred_answer += (currentQuestion.preferred_answer ? " " : "") + line.trim();
      }

      if (questions.length === num_of_questions - 1 && currentQuestion && currentQuestion.preferred_answer) {
        questions.push(currentQuestion);
        break;
      }
    }

    if (currentQuestion && !questions.includes(currentQuestion) && currentQuestion.preferred_answer) {
      questions.push(currentQuestion);
    }

    if (questions.length < num_of_questions) {
      throw new Error(`Only ${questions.length} valid questions generated, expected ${num_of_questions}`);
    }

    return questions;
  } catch (error) {
    console.error("Question generation error:", error.message);
    throw new Error(`Error generating questions: ${error?.message}`);
  }
};

// ─────────────────────────────────────────────────────────────
// ANSWER ANALYZER
// ─────────────────────────────────────────────────────────────
const analyzeAnswer = async ({ question, userAnswer, preferredAnswer, role, experience_level, interview_type }) => {
  const prompt = `You are an expert technical and HR interviewer and AI coach.

Analyze the user's answer "${userAnswer}" in response to the question "${question}", comparing it to the ideal preferred answer "${preferredAnswer}". Consider the following context:
- Role: ${role || "Not specified"}
- Experience Level: ${experience_level || "Not specified"}
- Interview Type: ${interview_type || "Not specified"}

Provide a detailed evaluation with the following format:
- Score: A numerical score out of 100 reflecting the accuracy and completeness of the user's answer.
- Feedback: A concise, constructive analysis of the user's answer, highlighting strengths and areas for improvement.

Output the response in the exact format above, with each item on a new line.

Example:
- Score: 85
- Feedback: The user provided a clear explanation of linked lists, demonstrating good understanding. However, they could improve by discussing time complexity and practical applications.`;

  try {
    const generatedText = await generate(prompt);
    const lines = generatedText.split("\n").map((l) => l.trim());
    let score = 0;
    let feedback = "Analysis failed to provide feedback";

    lines.forEach((line) => {
      if (line.startsWith("- Score:")) {
        score = parseInt(line.replace("- Score:", "").trim()) || 80;
      } else if (line.startsWith("- Feedback:")) {
        feedback = line.replace("- Feedback:", "").trim() || feedback;
      }
    });

    if (score < 0 || score > 100) throw new Error("Invalid score");
    return { score, feedback };
  } catch (error) {
    console.error("Answer analysis error:", error.message);
    return { score: 0, feedback: "Analysis failed" };
  }
};

// ─────────────────────────────────────────────────────────────
// INTERVIEW SUMMARY
// ─────────────────────────────────────────────────────────────
const interviewSummary = async (combinedFeedback) => {
  const feedbackText = combinedFeedback?.trim() || "No feedback provided.";
  const prompt = `I have combined feedback from my interview question and answers. Analyze it and generate:

- **Overall Summary:** A concise, reflective summary of how the interview went and key takeaways.
- **Strengths:** Up to 3 strengths, each with a short title and 2–3 line description of positive aspects.
- **Areas of Improvement:** Up to 3 improvement areas, each with a title and 2–3 line explanation focusing on what to do better.

Make the tone constructive and personalized (talk directly to me).

Raw feedback:
""" 
${feedbackText}
"""`;

  try {
    return await generate(prompt);
  } catch (error) {
    console.error("Interview summary error:", error.message);
    return "Interview summary could not be generated due to an error.";
  }
};

// ─────────────────────────────────────────────────────────────
// APTITUDE TEST QUESTION GENERATION
// ─────────────────────────────────────────────────────────────
const generateAptitudeQuestions = async ({ category, count = 10 }) => {
  const prompt = `Generate exactly ${count} high-quality multiple-choice questions for the aptitude category: "${category}".

Target audience: Final-year engineering students in Indian campus placement drives.

Each question must have:
- A clear, unambiguous question
- Exactly 4 options (as an array)
- One correct answer (0-based index: 0=A, 1=B, 2=C, 3=D)
- A brief explanation (1-2 sentences)

Return a JSON array in this exact format:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Explanation why option A is correct."
  }
]`;

  try {
    const parsed = await generateJSON(prompt, "array");
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Parsed result is not a valid question array");
    }
    console.log(`[Aptitude] Generated ${parsed.length} questions for category: ${category}`);
    return parsed.slice(0, count);
  } catch (error) {
    console.error("Aptitude question generation error:", error.message);
    throw new Error("Failed to generate aptitude questions");
  }
};

// ─────────────────────────────────────────────────────────────
// CODING CHALLENGE GENERATION
// ─────────────────────────────────────────────────────────────
const generateCodingChallenge = async ({ topic, difficulty }) => {
  const prompt = `Create a ${difficulty} difficulty coding challenge on the topic: "${topic}".

Return a JSON object in this exact format:
{
  "title": "Problem title",
  "difficulty": "${difficulty}",
  "topic": "${topic}",
  "description": "Clear problem statement (2-3 paragraphs)",
  "examples": [
    { "input": "example input", "output": "expected output", "explanation": "why" }
  ],
  "constraints": ["constraint 1", "constraint 2"],
  "starterCode": {
    "python": "def solution():\\n    # Write your code here\\n    pass",
    "javascript": "function solution() {\\n  // Write your code here\\n}"
  },
  "approach": "High-level approach explanation without giving away the solution",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)"
}`;

  try {
    const parsed = await generateJSON(prompt, "object");
    console.log(`[Coding] Generated challenge: ${parsed.title}`);
    return parsed;
  } catch (error) {
    console.error("Coding challenge generation error:", error.message);
    throw new Error("Failed to generate coding challenge");
  }
};

// ─────────────────────────────────────────────────────────────
// CODING HINT GENERATION
// ─────────────────────────────────────────────────────────────
const generateCodingHint = async ({ problem, userCode, language }) => {
  const prompt = `You are a helpful coding mentor.

Problem:
${problem}

Student's current code (${language}):
${userCode || "// No code written yet"}

Give ONE concise, actionable hint (2-4 sentences) that guides the student in the right direction WITHOUT giving away the full solution. Focus on what they should think about next.`;

  try {
    return await generate(prompt);
  } catch (error) {
    console.error("Hint generation error:", error.message);
    return "Think about breaking the problem into smaller steps and consider edge cases.";
  }
};

// ─────────────────────────────────────────────────────────────
// DASHBOARD INSIGHT GENERATION
// ─────────────────────────────────────────────────────────────
const generateDashboardInsight = async (reportsData) => {
  if (!reportsData || reportsData.length === 0) {
    return "Start your first mock interview to get personalized AI coaching insights here.";
  }

  const avgScore = (
    reportsData.reduce((s, r) => s + (Number(r.finalScore) || 0), 0) / reportsData.length
  ).toFixed(0);
  const recentScores = reportsData
    .slice(-3)
    .map((r) => `Score: ${r.finalScore}%, Weakness: ${r.areaOfImprovement?.slice(0, 80) || "N/A"}`)
    .join(" | ");

  const prompt = `You are an AI career coach. A college student is preparing for campus placements.

Here is their recent interview performance data:
- Average Score: ${avgScore}%
- Recent sessions: ${recentScores}

Write EXACTLY ONE sentence of actionable coaching advice (max 25 words) that is specific to their performance data. Be direct and encouraging. No fluff.`;

  try {
    return await generate(prompt);
  } catch (error) {
    console.error("Dashboard insight error:", error.message);
    return `Your average score of ${avgScore}% shows great progress — focus on your weak areas from feedback to break into the top tier.`;
  }
};

// ─────────────────────────────────────────────────────────────
// RESUME ATS SCORING
// ─────────────────────────────────────────────────────────────
const scoreResumeAgainstJD = async (resumeText, jobDescription) => {
  const prompt = `You are an expert ATS (Applicant Tracking System) and resume evaluator.

Resume:
"""
${resumeText.slice(0, 3000)}
"""

Job Description:
"""
${jobDescription.slice(0, 2000)}
"""

Analyze the resume against the job description and return a JSON object:
{
  "atsScore": 75,
  "matchedKeywords": ["React", "Node.js", "REST API"],
  "missingKeywords": ["Docker", "Kubernetes", "CI/CD"],
  "suggestions": [
    "Add measurable achievements to your experience section.",
    "Include the missing keywords naturally in your skills section."
  ],
  "summary": "2-3 sentence overall assessment of the resume vs JD fit."
}

"atsScore" must be a number 0-100. Be realistic and accurate.`;

  try {
    const parsed = await generateJSON(prompt, "object");
    console.log(`[ATS] Score generated: ${parsed.atsScore}`);
    return parsed;
  } catch (error) {
    console.error("ATS scoring error:", error.message);
    throw new Error("Failed to score resume");
  }
};

export {
  summarizeResumeText,
  generateQuestions,
  analyzeAnswer,
  interviewSummary,
  generateAptitudeQuestions,
  generateCodingChallenge,
  generateCodingHint,
  generateDashboardInsight,
  scoreResumeAgainstJD,
};
