export const pythonSnippets = [
  {
    label: 'print',
    detail: 'print(value)',
    documentation: 'Print a value to the console',
    insertText: 'print(${1:value})',
    kind: 'Function'
  },
  {
    label: 'def',
    detail: 'def function_name(params):',
    documentation: 'Define a new function',
    insertText: 'def ${1:function_name}(${2:params}):\n\t${3:pass}',
    kind: 'Snippet'
  },
  {
    label: 'class',
    detail: 'class ClassName:',
    documentation: 'Create a new class',
    insertText: 'class ${1:ClassName}:\n\tdef __init__(self${2:, params}):\n\t\t${3:pass}',
    kind: 'Snippet'
  },
  {
    label: 'if',
    detail: 'if condition:',
    documentation: 'If statement',
    insertText: 'if ${1:condition}:\n\t${2:pass}',
    kind: 'Snippet'
  },
  {
    label: 'for',
    detail: 'for item in iterable:',
    documentation: 'For loop',
    insertText: 'for ${1:item} in ${2:iterable}:\n\t${3:pass}',
    kind: 'Snippet'
  },
  {
    label: 'while',
    detail: 'while condition:',
    documentation: 'While loop',
    insertText: 'while ${1:condition}:\n\t${2:pass}',
    kind: 'Snippet'
  },
  {
    label: 'try',
    detail: 'try-except block',
    documentation: 'Exception handling',
    insertText: 'try:\n\t${1:pass}\nexcept ${2:Exception} as e:\n\t${3:print(f"Error: {e}")}',
    kind: 'Snippet'
  },
  {
    label: 'with',
    detail: 'with context manager',
    documentation: 'Context manager pattern',
    insertText: 'with ${1:expression} as ${2:variable}:\n\t${3:pass}',
    kind: 'Snippet'
  },
  {
    label: 'import',
    detail: 'Import statement',
    documentation: 'Import a module',
    insertText: 'import ${1:module}',
    kind: 'Snippet'
  },
  {
    label: 'from',
    detail: 'From import statement',
    documentation: 'Import specific items from a module',
    insertText: 'from ${1:module} import ${2:item}',
    kind: 'Snippet'
  },
  {
    label: 'lambda',
    detail: 'Lambda function',
    documentation: 'Create an anonymous function',
    insertText: 'lambda ${1:x}: ${2:x}',
    kind: 'Snippet'
  },
  {
    label: 'list',
    detail: 'List comprehension',
    documentation: 'Create a list using comprehension',
    insertText: '[${1:expression} for ${2:item} in ${3:iterable}]',
    kind: 'Snippet'
  },
  {
    label: 'dict',
    detail: 'Dictionary comprehension',
    documentation: 'Create a dictionary using comprehension',
    insertText: '{${1:key}: ${2:value} for ${3:item} in ${4:iterable}}',
    kind: 'Snippet'
  },
  {
    label: 'async',
    detail: 'Async function definition',
    documentation: 'Create an asynchronous function',
    insertText: 'async def ${1:function_name}(${2:params}):\n\t${3:pass}',
    kind: 'Snippet'
  },
  {
    label: 'await',
    detail: 'Await expression',
    documentation: 'Wait for an async operation',
    insertText: 'await ${1:coroutine}',
    kind: 'Snippet'
  },
  {
    label: 'decorator',
    detail: 'Function decorator',
    documentation: 'Create a function decorator',
    insertText: 'def ${1:decorator_name}(func):\n\tdef wrapper(*args, **kwargs):\n\t\t${2:pass}\n\treturn wrapper',
    kind: 'Snippet'
  }
]; 