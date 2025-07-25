module.exports = {
  // TypeScript and JavaScript files
  '**/*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],

  // CSS and styling files
  '**/*.{css,scss,sass}': ['prettier --write'],

  // JSON files
  '**/*.json': ['prettier --write'],

  // Markdown files
  '**/*.md': ['prettier --write'],

  // YAML files
  '**/*.{yml,yaml}': ['prettier --write'],
}
