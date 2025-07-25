module.exports = {
  // TypeScript and JavaScript files
  '**/*.{ts,tsx,js,jsx}': ['npx eslint --fix', 'npx prettier --write'],

  // CSS and styling files
  '**/*.{css,scss,sass}': ['npx prettier --write'],

  // JSON files
  '**/*.json': ['npx prettier --write'],

  // Markdown files
  '**/*.md': ['npx prettier --write'],

  // YAML files
  '**/*.{yml,yaml}': ['npx prettier --write'],
}
