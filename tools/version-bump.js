#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function incrementPatchVersion(version) {
    const parts = version.split('.');
    parts[2] = (parseInt(parts[2]) + 1).toString();
    return parts.join('.');
}

function updatePackageVersion(packageJsonPath) {
    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const oldVersion = packageJson.version;
        packageJson.version = incrementPatchVersion(oldVersion);

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4) + '\n');
        console.log(`Updated ${path.relative(process.cwd(), packageJsonPath)}: ${oldVersion} -> ${packageJson.version}`);

        return packageJson.version;
    } catch (error) {
        console.error(`Error updating ${packageJsonPath}:`, error.message);
        return null;
    }
}

function findPackageJsonFiles(dir) {
    const packageJsonFiles = [];

    if (!fs.existsSync(dir)) {
        return packageJsonFiles;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            const packageJsonPath = path.join(itemPath, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                packageJsonFiles.push(packageJsonPath);
            }
        }
    }

    return packageJsonFiles;
}

function main() {
    console.log('🚀 Starting version bump...\n');

    const rootDir = process.cwd();
    const rootPackageJson = path.join(rootDir, 'package.json');

    let updatedCount = 0;

    console.log('📦 Updating root package version...');
    if (updatePackageVersion(rootPackageJson)) {
        updatedCount++;
    }

    console.log('\n📚 Updating packages versions...');
    const packagesDir = path.join(rootDir, 'packages');
    const packageFiles = findPackageJsonFiles(packagesDir);

    for (const packageFile of packageFiles) {
        if (updatePackageVersion(packageFile)) {
            updatedCount++;
        }
    }

    console.log('\n🚀 Updating apps versions...');
    const appsDir = path.join(rootDir, 'apps');
    const appFiles = findPackageJsonFiles(appsDir);

    for (const appFile of appFiles) {
        if (updatePackageVersion(appFile)) {
            updatedCount++;
        }
    }

    console.log(`\n✅ Version bump completed! Updated ${updatedCount} package(s).`);
}

if (require.main === module)
    main();

module.exports = { incrementPatchVersion, updatePackageVersion, findPackageJsonFiles };