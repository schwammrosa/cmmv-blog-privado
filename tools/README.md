# Version Bump Tools

This folder contains scripts to automate project version incrementing.

## Available Scripts

### `version-bump.js`
Main script that increments the patch version (e.g. 0.1.0 → 0.1.1) in:
- Main project package.json
- All packages in `/packages`
- All apps in `/apps`

**Manual usage:**
```bash
node tools/version-bump.js
# or
pnpm run version:bump
```

### `setup-version-hook.js`
Script to configure/remove the Git hook that executes version bump automatically.

**Install the hook:**
```bash
node tools/setup-version-hook.js
# or
pnpm run version:setup
```

**Remove the hook:**
```bash
node tools/setup-version-hook.js remove
# or
pnpm run version:remove
```

## How It Works

1. **Automatic Hook**: When the hook is configured, the `version-bump.js` script runs automatically before each commit
2. **Version Increment**: The script identifies all `package.json` files in `/packages` and `/apps` directories and increments the patch version
3. **Automatic Staging**: Modified `package.json` files are automatically added to the commit

## Affected File Structure

```
cmmv-blog/
├── package.json                    # ✅ Version incremented
├── packages/
│   ├── newsletter/package.json     # ✅ Version incremented
│   ├── odds/package.json           # ✅ Version incremented
│   ├── plugin/package.json         # ✅ Version incremented
│   └── .../package.json            # ✅ Version incremented
└── apps/
    ├── api/package.json            # ✅ Version incremented
    ├── web/package.json            # ✅ Version incremented
    ├── admin/package.json          # ✅ Version incremented
    └── .../package.json            # ✅ Version incremented
```

## Usage Example

1. **Configure the hook (once):**
   ```bash
   pnpm run version:setup
   ```

2. **From then on, every time you make a commit:**
   ```bash
   git add .
   git commit -m "feat: new feature"
   ```
   
   The script will:
   - Automatically increment all versions
   - Add modified `package.json` files to the commit
   - Proceed with the commit normally

3. **To test manually:**
   ```bash
   pnpm run version:bump
   ```

## Example Output

```
🚀 Starting version bump...

📦 Updating root package version...
Updated package.json: 0.1.0 -> 0.1.1

📚 Updating packages versions...
Updated packages/newsletter/package.json: 0.1.0 -> 0.1.1
Updated packages/odds/package.json: 0.1.0 -> 0.1.1
Updated packages/plugin/package.json: 0.1.0 -> 0.1.1
...

🚀 Updating apps versions...
Updated apps/api/package.json: 0.0.1 -> 0.0.2
Updated apps/web/package.json: 0.0.1 -> 0.0.2
Updated apps/admin/package.json: 0.0.1 -> 0.0.2

✅ Version bump completed! Updated 13 package(s).
```

## Uninstall

To remove the automatic hook:
```bash
pnpm run version:remove
```

The scripts will remain available for manual use. 
