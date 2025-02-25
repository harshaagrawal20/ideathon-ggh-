import React, { useState } from 'react';
import { AISuggestions } from './components/AISuggestions';

export function YourComponent() {
  const [code, setCode] = useState('');

  const handleApplySuggestion = (suggestion: string) => {
    // Apply the suggestion to your code editor
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