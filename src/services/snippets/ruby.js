export const rubySnippets = [
  {
    label: 'def',
    detail: 'Method definition',
    documentation: 'Define a new method',
    insertText: 'def ${1:method_name}\n\t${2}\nend',
    kind: 'Snippet'
  },
  {
    label: 'class',
    detail: 'Class definition',
    documentation: 'Define a new class',
    insertText: 'class ${1:ClassName}\n\tdef initialize(${2:params})\n\t\t${3}\n\tend\nend',
    kind: 'Snippet'
  },
  {
    label: 'module',
    detail: 'Module definition',
    documentation: 'Define a new module',
    insertText: 'module ${1:ModuleName}\n\t${2}\nend',
    kind: 'Snippet'
  },
  {
    label: 'if',
    detail: 'If statement',
    documentation: 'Create an if statement',
    insertText: 'if ${1:condition}\n\t${2}\nend',
    kind: 'Snippet'
  },
  {
    label: 'begin',
    detail: 'Begin/rescue block',
    documentation: 'Error handling',
    insertText: 'begin\n\t${1}\nrescue => error\n\tputs "Error: #{error.message}"\nend',
    kind: 'Snippet'
  },
  {
    label: 'each',
    detail: 'Each iterator',
    documentation: 'Iterate over a collection',
    insertText: '${1:collection}.each do |${2:item}|\n\t${3}\nend',
    kind: 'Snippet'
  },
  {
    label: 'map',
    detail: 'Map iterator',
    documentation: 'Map over a collection',
    insertText: '${1:collection}.map do |${2:item}|\n\t${3}\nend',
    kind: 'Snippet'
  },
  {
    label: 'select',
    detail: 'Select iterator',
    documentation: 'Filter a collection',
    insertText: '${1:collection}.select do |${2:item}|\n\t${3}\nend',
    kind: 'Snippet'
  }
]; 