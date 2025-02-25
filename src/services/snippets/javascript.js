export const javascriptSnippets = [
  {
    label: 'function',
    detail: 'function declaration',
    documentation: 'Create a new function',
    insertText: 'function ${1:name}(${2:params}) {\n\t${3}\n}',
    kind: 'Snippet'
  },
  {
    label: 'arrow',
    detail: 'Arrow function',
    documentation: 'Create an arrow function',
    insertText: '(${1:params}) => {\n\t${2}\n}',
    kind: 'Snippet'
  },
  {
    label: 'class',
    detail: 'Class declaration',
    documentation: 'Create a new class',
    insertText: 'class ${1:Name} {\n\tconstructor(${2:params}) {\n\t\t${3}\n\t}\n}',
    kind: 'Snippet'
  },
  {
    label: 'if',
    detail: 'If statement',
    documentation: 'Create an if statement',
    insertText: 'if (${1:condition}) {\n\t${2}\n}',
    kind: 'Snippet'
  },
  {
    label: 'try',
    detail: 'Try-catch block',
    documentation: 'Error handling',
    insertText: 'try {\n\t${1}\n} catch (error) {\n\tconsole.error(error);\n}',
    kind: 'Snippet'
  },
  {
    label: 'promise',
    detail: 'New Promise',
    documentation: 'Create a new Promise',
    insertText: 'new Promise((resolve, reject) => {\n\t${1}\n})',
    kind: 'Snippet'
  },
  {
    label: 'async',
    detail: 'Async function',
    documentation: 'Create an async function',
    insertText: 'async function ${1:name}(${2:params}) {\n\ttry {\n\t\t${3}\n\t} catch (error) {\n\t\tconsole.error(error);\n\t}\n}',
    kind: 'Snippet'
  },
  {
    label: 'map',
    detail: 'Array map',
    documentation: 'Map over an array',
    insertText: '${1:array}.map(${2:item} => {\n\treturn ${3}\n})',
    kind: 'Snippet'
  },
  {
    label: 'filter',
    detail: 'Array filter',
    documentation: 'Filter an array',
    insertText: '${1:array}.filter(${2:item} => {\n\treturn ${3:condition}\n})',
    kind: 'Snippet'
  },
  {
    label: 'reduce',
    detail: 'Array reduce',
    documentation: 'Reduce an array',
    insertText: '${1:array}.reduce((${2:acc}, ${3:curr}) => {\n\treturn ${4}\n}, ${5:initial})',
    kind: 'Snippet'
  }
]; 