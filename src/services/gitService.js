export class GitService {
  async commitChanges(code, message) {
    try {
      const response = await fetch('/api/git/commit', {
        method: 'POST',
        body: JSON.stringify({
          code,
          message,
          branch: 'main'
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Git commit failed:', error);
      throw error;
    }
  }
} 