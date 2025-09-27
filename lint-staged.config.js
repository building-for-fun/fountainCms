module.exports = {
  'frontend/src/**/*.{js,jsx,ts,tsx}': [
    'npm run format --workspace=frontend'
  ],
  'backend/src/**/*.{js,jsx,ts,tsx}': [
    'npm run format --workspace=backend'
  ]
};
