import React, { useState, useEffect } from 'react';
import MonacoEditor from './CodeMirrorEditor';
import { analyzeSuggestions } from '../services/aiService';
import { generateTests } from '../services/testGenerationService';
import TestSuggestionPanel from './TestSuggestionPanel';
// import CICDPanel from './CICDPanel';
import { analyzeSuggestions as generateSuggestions } from '../services/aiService';
import { editor } from 'monaco-editor';
import { getLanguageCompletions } from '../services/languageService';
import { analyzeCode, getSuggestions } from '../services/codeAnalysisService';
import OutputPanel from './OutputPanel';
import { pistonService } from '../services/pistonService';

const getDefaultTemplate = (language) => {
  const templates = {
    python: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import json
import logging
from typing import List, Dict, Optional
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Your code starts from here
`,

    javascript: `"use strict";

// Core imports
const fs = require('fs');
const path = require('path');
const util = require('util');

// Error handling setup
const handleError = (err) => {
  console.error('Error:', err.message);
};

try {
  // Your code starts from here

} catch (err) {
  handleError(err);
}`,

    typescript: `// Core imports and types
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { Request, Response, NextFunction } from 'express';

// Type definitions
interface Config {
  port: number;
  env: string;
}

// Your code starts from here
`,

    java: `import java.util.*;
import java.io.*;
import java.time.*;
import java.util.stream.*;
import java.util.function.*;
import java.util.logging.Logger;

public class Main {
    private static final Logger logger = Logger.getLogger(Main.class.getName());
    
    public static void main(String[] args) {
        try {
            // Your code starts from here
            
        } catch (Exception err) {
            logger.severe("Error: " + err.getMessage());
        }
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <memory>
#include <stdexcept>

using namespace std;

void handleError(const string& message) {
    cerr << "Error: " << message << endl;
    exit(1);
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    
    try {
        // Your code starts from here
        
    } catch (const exception& err) {
        handleError(err.what());
    }
    return 0;
}`,

    kotlin: `import java.util.*
import kotlinx.coroutines.*
import kotlin.system.measureTimeMillis

fun main() = runBlocking {
    try {
        // Setup logging
        val logger = Logger.getLogger("MainKt")
        
        // Your code starts from here
        
    } catch (err: Exception) {
        println("Error occurred: " + err.message)
    }
}`,

    rust: `use std::io::{self, Write};
use std::error::Error;
use std::collections::{HashMap, HashSet};
use std::fs::File;

fn main() -> Result<(), Box<dyn Error>> {
    // Setup error handling
    env_logger::init();
    
    // Your code starts from here
    
    Ok(())
}`,

    go: `package main

import (
    "fmt"
    "log"
    "os"
    "time"
    "errors"
)

func main() {
    // Setup error handling
    defer func() {
        if err := recover(); err != nil {
            log.Printf("Error occurred: %v", err)
        }
    }()
    
    // Your code starts from here
}`,

    php: `<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use Monolog\\Logger;
use Monolog\\Handler\\StreamHandler;
use Exception;

// Setup error handling
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Initialize logger
$logger = new Logger('app');
$logger->pushHandler(new StreamHandler('php://stderr', Logger::DEBUG));

try {
    // Your code starts from here
    
} catch (Exception $err) {
    $logger->error("An error occurred: " . $err->getMessage());
}`,

    ruby: `#!/usr/bin/env ruby

require 'json'
require 'date'
require 'fileutils'

// Your code starts from here
`,

    swift: `import Foundation
import UIKit

// Your code starts from here
`
  };

  return templates[language] || '// Your code starts from here\n';
};

const AICodeEditor = () => {
  // Initial example code with more test cases
  const initialCode = `// Example functions to test
const calculateFactorial = (n) => {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
};

const sortArray = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
};

// Example usage
const numbers = [5, 2, 8, 1, 9];
console.log('Sorted array:', sortArray(numbers));
console.log('Factorial of 5:', calculateFactorial(5));`;

  const [code, setCode] = useState(initialCode);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  
  // Initialize with empty test results instead of sample data
  const [testResults, setTestResults] = useState({
    testCode: '',
    coverage: { lines: 0, functions: 0, branches: 0 },
    suggestions: [],
    edgeCases: [],
    validationGaps: []
  });
  const [showTests, setShowTests] = useState(true);
  const [editingSuggestion, setEditingSuggestion] = useState(null);
  
  // Add new state for output
  const [output, setOutput] = useState('');
  
  // Add state for theme
  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'one-dark', label: 'One Dark' },
    { value: 'dracula', label: 'Dracula' },
    { value: 'github-light', label: 'GitHub Light' },
    { value: 'github-dark', label: 'GitHub Dark' },
    { value: 'vscode-dark', label: 'VS Code Dark' },
    { value: 'material-dark', label: 'Material Dark' },
  ];
  
  // Set default theme to light
  const [selectedTheme, setSelectedTheme] = useState('light');
  
  // Add state for input
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  
  useEffect(() => {
    // Generate initial test results
    const generateInitialTests = async () => {
      if (!initialCode.trim()) return;
      
      try {
        const result = await generateTests(initialCode, selectedLanguage);
        setTestResults({
          testCode: result.testCode || '// No tests generated',
          coverage: result.coverage || { lines: 0, functions: 0, branches: 0 },
          suggestions: result.suggestions || []
        });
      } catch (error) {
        console.error('Error generating initial tests:', error);
      }
    };

    generateInitialTests();
  }, [initialCode, selectedLanguage]); // Add missing dependencies

  useEffect(() => {
    // Add dependencies
    generateSuggestions(code, selectedLanguage);
  }, [code, selectedLanguage]); // Add missing dependencies

  const handleEditorChange = async (value) => {
    setCode(value);
    
    if (!value.trim()) {
      setSuggestions([]);
      setTestResults({
        testCode: '',
        coverage: { lines: 0, functions: 0, branches: 0 },
        suggestions: []
      });
      return;
    }

    // Clear previous timeouts
    clearTimeout(window.suggestionsTimeout);
    clearTimeout(window.testGenerationTimeout);

    // Get AI suggestions after a short delay
    window.suggestionsTimeout = setTimeout(async () => {
      try {
        console.log('Requesting suggestions for:', value); // Debug log
        const result = await analyzeSuggestions(value, selectedLanguage);
        console.log('Received suggestions:', result); // Debug log
        
        if (result.error) {
          setSuggestions([{
            preview: result.error,
            code: value,
            type: 'error'
          }]);
        } else if (Array.isArray(result) && result.length > 0) {
          setSuggestions(result);
        }
      } catch (error) {
        console.error('Error getting suggestions:', error);
        setSuggestions([{
          preview: `Error analyzing code: ${error.message}`,
          code: value,
          type: 'error'
        }]);
      }
    }, 1500);
    
    // Generate tests after a longer delay
    window.testGenerationTimeout = setTimeout(async () => {
      try {
        const result = await generateTests(value, selectedLanguage);
        setTestResults({
          testCode: result.testCode || '// No tests generated',
          coverage: result.coverage || { lines: 0, functions: 0, branches: 0 },
          suggestions: result.suggestions || []
        });
      } catch (error) {
        console.error('Error generating tests:', error);
        setTestResults({
          testCode: '// Error generating tests',
          coverage: { lines: 0, functions: 0, branches: 0 },
          suggestions: [`Error: ${error.message}`]
        });
      }
    }, 2000);

    // Analyze code in real-time for syntax and style issues
    if (window.monacoEditor) {
      const markers = analyzeCode(value, selectedLanguage, window.monacoEditor);
      const newSuggestions = getSuggestions(markers);
      
      // Update suggestions, keeping AI suggestions
      setSuggestions(prevSuggestions => {
        const aiSuggestions = prevSuggestions.filter(s => s.type === 'ai');
        return [...aiSuggestions, ...newSuggestions];
      });
    }
  };

  const applySuggestion = (suggestion) => {
    // Store current code for undo
    const currentCode = code;
    
    // Update both the state and editor content
    setCode(suggestion.code);

    // Get the editor reference
    const editorRef = window.monacoEditor;
    if (editorRef) {
      // Update the editor content
      editorRef.setValue(suggestion.code);
    }

    // Store for undo
    window.lastCode = currentCode;
  };

  // Update handleEditorDidMount
  const handleEditorDidMount = (editor, monaco) => {
    window.monacoEditor = editor;

    // Configure language providers
    const languages = ['python', 'javascript', 'java', 'cpp', 'typescript', 'kotlin', 'ruby'];
    
    languages.forEach(lang => {
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: (model, position) => {
          const completions = getLanguageCompletions(lang);
          const suggestions = completions.map(item => ({
            label: item.label,
            kind: monaco.languages.CompletionItemKind[item.kind],
            insertText: item.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: item.detail,
            documentation: item.documentation
          }));
          return { suggestions };
        },
        triggerCharacters: ['.', '(', '{', '[', '"', "'", '`'] // Trigger on these characters
      });
    });
  };

  const modifySuggestion = (suggestion, index) => {
    // Set the suggestion being edited
    setEditingSuggestion({
      index,
      originalCode: suggestion.code,
      modifiedCode: suggestion.code
    });
  };

  const saveModifiedSuggestion = (index, modifiedCode) => {
    // Update the suggestions array with the modified code
    const newSuggestions = [...suggestions];
    newSuggestions[index] = {
      ...newSuggestions[index],
      code: modifiedCode,
      preview: modifiedCode,
      isModified: true
    };
    setSuggestions(newSuggestions);
    setEditingSuggestion(null);
  };

  const rejectSuggestion = (index) => {
    // Remove the suggestion from the list
    const newSuggestions = suggestions.filter((_, i) => i !== index);
    setSuggestions(newSuggestions);
  };

  const cancelModification = () => {
    setEditingSuggestion(null);
  };

  const handleApplyTest = (testCode) => {
    // Create a new file for tests
    // This is where you'd implement the logic to create/update test files
    console.log('Applying test code:', testCode);
  };

  // Add this for debugging
  useEffect(() => {
    console.log('Current test results:', testResults);
  }, [testResults]);

  // Update the language change handler in AICodeEditor
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    
    // Get the editor instance
    const editor = window.monacoEditor;
    if (editor) {
      // Only set template if editor is empty or contains default content
      const currentContent = editor.getValue().trim();
      if (!currentContent || currentContent === initialCode) {
        editor.setValue(getDefaultTemplate(newLanguage));
      }
    }
  };

  // Add this near your other handler functions in AICodeEditor
  const handleSave = async () => {
    try {
      // You can implement actual save logic here
      // For example, saving to localStorage or making an API call
      localStorage.setItem('savedCode', code);
      
      // Optional: Show a success message
      console.log('Code saved successfully');
      
      // If you have a notification system
      // showNotification('Code saved successfully', 'success');
      
    } catch (error) {
      console.error('Error saving code:', error);
      
      // If you have a notification system
      // showNotification('Failed to save code', 'error');
    }
  };

  // Update executeCode function
  const executeCode = async () => {
    try {
      setIsExecuting(true);
      setOutput('Running code...');

      const result = await pistonService.executeCode(
        selectedLanguage,
        code,
        input
      );

      if (result.run) {
        let output = '';
        if (result.compile) {
          output += `// Compilation Output:\n${result.compile.output}\n\n`;
        }
        output += `// Program Output:\n${result.run.output}`;
        
        if (result.run.code !== 0) {
          output += `\n\n// Process exited with code ${result.run.code}`;
        }
        
        setOutput(output);
      } else if (result.message) {
        setOutput(`// Error: ${result.message}`);
      }
    } catch (error) {
      setOutput(`// Error: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="ai-code-editor">
      <div className="editor-header">
        <div className="editor-controls-left">
          <select 
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="language-selector"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="kotlin">Kotlin</option>
            <option value="php">PHP</option>
          </select>
          
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="theme-selector"
          >
            {themeOptions.map(theme => (
              <option key={theme.value} value={theme.value}>
                {theme.label}
              </option>
            ))}
          </select>
        </div>

        <div className="editor-controls-right">
          <button 
            className="toggle-tests-button"
            onClick={() => setShowTests(!showTests)}
          >
            {showTests ? '🔍 Hide Tests' : '🔍 Show Tests'}
          </button>
        </div>
      </div>
      
      <div className="main-content">
        <div className="editor-section">
          <div className="editor-container">
            <MonacoEditor
              code={code}
              language={selectedLanguage}
              onChange={handleEditorChange}
              onSave={handleSave}
              selectedTheme={selectedTheme}
            />
          </div>
          
          <div className="input-output-section">
            <div className="stdin-container">
              <label htmlFor="stdin-input">Program Input (STDIN)</label>
              <textarea
                id="stdin-input"
                className="stdin-input"
                placeholder="Enter input here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            
            <div className="output-container">
              <OutputPanel output={output} />
              <button 
                className={`run-button ${isExecuting ? 'running' : ''}`}
                onClick={executeCode}
                disabled={isExecuting}
              >
                {isExecuting ? (
                  <>
                    <span className="spinner"></span>
                    Running...
                  </>
                ) : (
                  <>
                    <span className="run-icon">▶</span>
                    Run Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="panels-container">
          <div className="suggestions-panel">
            <h3>
              <span className="panel-icon">💡</span>
              AI Suggestions
            </h3>
            {suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                {editingSuggestion?.index === index ? (
                  <div className="suggestion-editor">
                    <div className="suggestion-explanation">
                      {suggestion.explanation}
                    </div>
                    <MonacoEditor
                      code={editingSuggestion.modifiedCode}
                      language={selectedLanguage}
                      onChange={(value) => setEditingSuggestion({
                        ...editingSuggestion,
                        modifiedCode: value
                      })}
                    />
                    <div className="suggestion-edit-actions">
                      <button onClick={() => saveModifiedSuggestion(index, editingSuggestion.modifiedCode)}>
                        Save
                      </button>
                      <button onClick={cancelModification}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="suggestion-preview">
                      {suggestion.type === 'error-fix' && (
                        <div className="suggestion-error">
                          <div className="error-title">
                            <span className="error-icon">🔍</span>
                            {suggestion.issue}
                          </div>
                        </div>
                      )}
                      <div className="suggestion-explanation">
                        <span className="explanation-icon">💡</span>
                        {suggestion.explanation}
                      </div>
                      <pre className="suggestion-code">
                        <code>{suggestion.code}</code>
                      </pre>
                    </div>
                    <div className="suggestion-actions">
                      <button 
                        className="apply-button"
                        onClick={() => applySuggestion(suggestion)}
                        title="Apply this suggestion"
                      >
                        Apply
                      </button>
                      <button 
                        className="modify-button"
                        onClick={() => modifySuggestion(suggestion, index)}
                        title="Modify this suggestion"
                      >
                        Modify
                      </button>
                      <button 
                        className="reject-button"
                        onClick={() => rejectSuggestion(index)}
                        title="Remove this suggestion"
                      >
                        Reject
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {showTests && (
            <div className="test-panel">
              <h3>
                <span className="panel-icon">🧪</span>
                Test Results
              </h3>
              <TestSuggestionPanel
                testResults={testResults}
                onApplyTest={handleApplyTest}
                language={selectedLanguage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICodeEditor;