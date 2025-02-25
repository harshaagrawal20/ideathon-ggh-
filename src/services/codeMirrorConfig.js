import { EditorState } from '@codemirror/state';
import { indentUnit } from '@codemirror/language';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';

export const getEditorConfig = (language) => {
  const baseConfig = {
    extensions: [
      keymap.of(defaultKeymap),
      EditorState.tabSize.of(2),
      indentUnit.of('  ')
    ]
  };

  const languageConfigs = {
    python: {
      ...baseConfig,
      extensions: [
        ...baseConfig.extensions,
        EditorState.tabSize.of(4),
        indentUnit.of('    ')
      ]
    },
    javascript: baseConfig,
    cpp: baseConfig
  };

  return languageConfigs[language] || baseConfig;
}; 