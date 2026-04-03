import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaCheck, FaTimes, FaCode, FaCog } from 'react-icons/fa';

// You'll need to install: npm install @monaco-editor/react
import Editor from '@monaco-editor/react';

export default function CodeEditor({ 
  question, 
  language = 'javascript',
  onSubmit,
  testCases = []
}) {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const languages = [
    { value: 'javascript', label: 'JavaScript', starter: '// Write your code here\nfunction solution() {\n  \n}' },
    { value: 'python', label: 'Python', starter: '# Write your code here\ndef solution():\n    pass' },
    { value: 'java', label: 'Java', starter: '// Write your code here\npublic class Solution {\n    \n}' },
    { value: 'cpp', label: 'C++', starter: '// Write your code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n}' },
  ];

  // Set starter code when language changes
  useEffect(() => {
    const lang = languages.find(l => l.value === selectedLanguage);
    setCode(lang?.starter || '');
  }, [selectedLanguage]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');

    try {
      // For demo purposes, we'll use eval for JavaScript
      // In production, use Judge0 API or similar service
      if (selectedLanguage === 'javascript') {
        const result = eval(code);
        setOutput(String(result));
      } else {
        // For other languages, you'd call an API
        setOutput('Code execution for this language requires backend API integration.');
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runTestCases = async () => {
    setIsRunning(true);
    const results = [];

    try {
      for (const testCase of testCases) {
        try {
          // Execute code with test input
          const result = eval(`${code}; solution(${JSON.stringify(testCase.input)})`);
          const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
          
          results.push({
            input: testCase.input,
            expected: testCase.expected,
            actual: result,
            passed
          });
        } catch (error) {
          results.push({
            input: testCase.input,
            expected: testCase.expected,
            actual: error.message,
            passed: false
          });
        }
      }
      setTestResults(results);
    } catch (error) {
      setOutput(`Error running test cases: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        code,
        language: selectedLanguage,
        testResults
      });
    }
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(r => r.passed);

  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <FaCode />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Coding Challenge
          </h3>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {question}
        </p>
      </div>

      {/* Language Selector & Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-4 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
        >
          {languages.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runCode}
          disabled={isRunning || !code.trim()}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPlay />
          Run Code
        </motion.button>

        {testCases.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runTestCases}
            disabled={isRunning || !code.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaCog />
            Run Tests
          </motion.button>
        )}
      </div>

      {/* Code Editor */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg">
        <Editor
          height="400px"
          language={selectedLanguage}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Output Console */}
      {output && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-2xl p-6 border-2 border-slate-700"
        >
          <h4 className="text-sm font-bold text-emerald-400 mb-3">Output:</h4>
          <pre className="text-slate-300 font-mono text-sm whitespace-pre-wrap">
            {output}
          </pre>
        </motion.div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            Test Results
            {allTestsPassed && (
              <span className="text-emerald-500">
                <FaCheck />
              </span>
            )}
          </h4>
          
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 ${
                result.passed
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500'
                  : 'bg-red-50 dark:bg-red-950/20 border-red-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {result.passed ? (
                  <FaCheck className="text-emerald-600" />
                ) : (
                  <FaTimes className="text-red-600" />
                )}
                <span className="font-bold text-slate-900 dark:text-white">
                  Test Case {index + 1}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-slate-600 dark:text-slate-400">Input:</div>
                  <code className="text-slate-900 dark:text-white">
                    {JSON.stringify(result.input)}
                  </code>
                </div>
                <div>
                  <div className="font-semibold text-slate-600 dark:text-slate-400">Expected:</div>
                  <code className="text-slate-900 dark:text-white">
                    {JSON.stringify(result.expected)}
                  </code>
                </div>
                <div>
                  <div className="font-semibold text-slate-600 dark:text-slate-400">Got:</div>
                  <code className={result.passed ? 'text-emerald-600' : 'text-red-600'}>
                    {JSON.stringify(result.actual)}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={!code.trim()}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-black text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Solution
      </motion.button>
    </div>
  );
}