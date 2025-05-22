import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Get Git info
const commitHash = execSync('git rev-parse HEAD').toString().trim();
const commitDate = execSync('git log -1 --format=%cd --date=iso-strict').toString().trim();

// Read current version
const versionFile = './public/version.json';
const versionData = JSON.parse(readFileSync(versionFile));

// Update version data
versionData.buildNumber += 1;
versionData.lastCommit = commitHash;
versionData.lastCommitDate = commitDate;
versionData.deploymentDate = new Date().toISOString();

// Write updated version
writeFileSync(versionFile, JSON.stringify(versionData, null, 2));

console.log(`Version updated to build ${versionData.buildNumber}`);
