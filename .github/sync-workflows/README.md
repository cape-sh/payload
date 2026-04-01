# Sync Workflows for API & CLI Docs

These workflow files should be copied to the respective source repos.

## Setup

### 1. Create a GitHub PAT (Personal Access Token)

Create a fine-grained PAT with:
- **Resource owner:** `cape-sh` org (or `biqmind` if that's where the repos live)
- **Repository access:** `cape-sh/payload`
- **Permissions:** Contents (read/write), Pull requests (read/write)

### 2. Add the PAT as a secret in both source repos

In both `biqmind/cape-api-definitions` and `biqmind/cape-cli`:
- Go to Settings → Secrets and variables → Actions
- Add a new secret: `PAYLOAD_REPO_TOKEN` with the PAT value

### 3. Copy workflows

- Copy `sync-api-specs.yml` to `biqmind/cape-api-definitions/.github/workflows/`
- Copy `sync-cli-docs.yml` to `biqmind/cape-cli/.github/workflows/`

### How it works

On every push to `main`:
1. The workflow checks out the source repo
2. Copies the relevant files (API specs or CLI docs)
3. Opens a PR on `cape-sh/payload` with the updated files
4. Vercel auto-deploys a preview on the PR
5. You review and merge when ready
