#!/usr/bin/env node

import { createProject } from './createProject';

async function main() {
  const projectName = process.argv[2];

  if (!projectName) {
    console.error('❌ Please provide a project name');
    console.log('👉 Example: create-fountaincms my-cms');
    process.exit(1);
  }

  await createProject(projectName);
}

main();
