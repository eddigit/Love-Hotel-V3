import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Get Git info
const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
const commitMessage = execSync('git log -1 --pretty=%B').toString().trim();
const commitDate = new Date().toISOString();

// Read current version
const versionFile = './public/version.json';
const versionData = JSON.parse(readFileSync(versionFile));

// Update version data
versionData.buildNumber += 1;
versionData.lastCommit = commitHash;
versionData.lastCommitMessage = commitMessage;
versionData.lastCommitDate = commitDate;
versionData.deploymentDate = new Date().toISOString();

// Write updated version
writeFileSync(versionFile, JSON.stringify(versionData, null, 2));

console.log(`Version updated to build ${versionData.buildNumber}`);