import React, { useState } from 'react';
import { AISuggestions } from './components/AISuggestions.js';

export function YourComponent() {
  const [code, setCode] = useState('');

  const handleApplySuggestion = (suggestion) => {
    setCode(suggestion);
  };

  return (
    <div>
      {/* Your code editor component */}
      <AISuggestions 
        code={code} 
        onApply={handleApplySuggestion} 
      />
    </div>
  );
} 