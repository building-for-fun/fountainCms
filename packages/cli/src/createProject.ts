import path from 'path';
import fs from 'fs-extra';
import { execa } from 'execa';

export async function createProject(projectName: string) {
    const targetDir = path.resolve(process.cwd(), projectName);
    const templateDir = path.resolve(__dirname, 'templates/monorepo');

    if (await fs.pathExists(targetDir)) {
        console.error('❌ Directory already exists:', projectName);
        process.exit(1);
    }

    console.log('📦 Creating FountainCMS project...');
    await fs.copy(templateDir, targetDir);

    console.log('📥 Installing dependencies...');
    await execa('npm', ['install'], {
        cwd: targetDir,
        stdio: 'inherit'
    });

    console.log('\n✅ FountainCMS created successfully!');
    console.log(`👉 cd ${projectName}`);
    console.log('👉 npm run dev');
}
