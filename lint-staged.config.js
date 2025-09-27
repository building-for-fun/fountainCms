module.exports = {
  'frontend/src/**/*.{js,jsx,ts,tsx}': [
    'npm run lint --workspace=frontend',
    'npm run format --workspace=frontend'
  ],
  'backend/src/**/*.{js,jsx,ts,tsx}': [
    'npm run lint --workspace=backend',
    'npm run format --workspace=backend'
  ]
};
