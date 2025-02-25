import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export class CollaborationService {
  constructor(editor) {
    this.ydoc = new Y.Doc();
    this.provider = new WebsocketProvider(
      'ws://localhost:1234', 
      'monaco-editor', 
      this.ydoc
    );
    this.ytext = this.ydoc.getText('monaco');
    
    // Bind Monaco editor
    this.binding = new MonacoBinding(
      this.ytext, 
      editor.getModel(), 
      new Set([editor]), 
      this.provider.awareness
    );
  }
} 