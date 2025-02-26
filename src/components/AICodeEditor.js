import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import OutputPanel from './OutputPanel';
import { pistonService } from '../services/pistonService.js';
import { getLanguageCompletions } from '../services/languageService.js';
import EditorWrapper from './EditorWrapper';
import ErrorDisplay from './ErrorDisplay';
import { useTheme } from '../context/ThemeContext';

// Add default code template
const defaultCode = `// Write your code here
console.log("Hello World!");`;

// Map display language names to Piston runtime names
const languageMap = {
  javascript: 'javascript',
  python: 'python3',
  java: 'java',
  cpp: 'c++'
};

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

// Add loading state
const LoadingOverlay = () => (
  <div className="loading-overlay">
    <div className="spinner"></div>
    <p>Loading editor...</p>
  </div>
);

const AICodeEditor = () => {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const { theme, toggleTheme } = useTheme();
  const [error, setError] = useState(null);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    
    setSelectedLanguage(newLanguage);
    setCode('// Write your code here\n');
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleEditorDidMount = (editor, monaco) => {
    window.monacoEditor = editor;
    
    // Set editor theme-specific options
    const isDark = theme === 'vs-dark';
    editor.updateOptions({
      theme: theme,
      backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      fixedOverflowWidgets: true,
      automaticLayout: false,
      minimap: { enabled: false },
      fontSize: 14,
      fontFamily: "'Fira Code', monospace",
      renderLineHighlight: 'all',
      scrollbar: {
        useShadows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10
      }
    });
  };

  const executeCode = async () => {
    if (!code.trim()) {
      setOutput('// Please enter some code to execute');
      return;
    }

    try {
      setIsExecuting(true);
      setOutput('// Running code...');

      // Get the runtime name from the map
      const runtime = languageMap[selectedLanguage] || selectedLanguage;
      
      const result = await pistonService.executeCode(
        runtime,
        code,
        input
      );

      let finalOutput = '// Program Output:\n';
      
      if (result.run.error) {
        finalOutput += `Error: ${result.run.error}\n`;
      } else if (result.run.output) {
        finalOutput += result.run.output;
      } else {
        finalOutput += '// No output generated';
      }

      setOutput(finalOutput);
    } catch (error) {
      setOutput(`// Error executing code:\n${error.message}`);
      console.error('Code execution error:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="ai-code-editor">
      <div className="editor-header">
        <div className="logo-section">
        </div>
        <div className="editor-controls-left">
          <select 
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="language-selector"
            aria-label="language selector"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          
          <select
            value={theme}
            onChange={(e) => toggleTheme(e.target.value)}
            className="theme-selector"
            aria-label="theme selector"
          >
            <option value="vs-dark">Dark</option>
            <option value="vs">Light</option>
          </select>
        </div>
        <div className="editor-controls-right">
          <button 
            className={`run-button ${isExecuting ? 'executing' : ''}`}
            onClick={executeCode}
            disabled={isExecuting || !code.trim()}
          >
            {isExecuting ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>
      
      <div className="main-content">
        <div className="left-panel">
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <MonacoEditor
              height="100%"
              language={selectedLanguage}
              value={code}
              onChange={handleEditorChange}
              theme={theme}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                fixedOverflowWidgets: true,
                automaticLayout: true
              }}
            />
          </div>
        </div>

        <div className="right-panel">
          <div className="output-section">
            <h3 className="section-title">Output</h3>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICodeEditor;