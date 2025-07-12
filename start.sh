#!/bin/bash

# Bootstrap Starter Kit Installer
# Usage: curl -sSL https://raw.githubusercontent.com/tedmdelacruz/bootstrap/refs/heads/master/start.sh | bash -s -- <project-name>

set -e

# Check if project name is provided
if [ $# -eq 0 ]; then
    echo "❌ Error: Project name is required"
    echo "Usage: curl -sSL https://raw.githubusercontent.com/tedmdelacruz/bootstrap/refs/heads/master/start.sh | bash -s -- <project-name>"
    echo "Example: curl -sSL https://raw.githubusercontent.com/tedmdelacruz/bootstrap/refs/heads/master/start.sh | bash -s -- my-awesome-app"
    exit 1
fi

PROJECT_NAME="$1"

echo "🚀 Bootstrap Starter Kit Installer"
echo "======================================"
echo "📝 Project name: $PROJECT_NAME"

# Check if project directory already exists
if [ -d "$PROJECT_NAME" ]; then
    echo "❌ Directory '$PROJECT_NAME' already exists. Please remove it or choose a different name."
    exit 1
fi

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "📁 Created temporary directory: $TEMP_DIR"

# Function to cleanup on exit
cleanup() {
    echo "🧹 Cleaning up temporary files..."
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

# Get the latest release URL
echo "🔍 Fetching latest release information..."
LATEST_RELEASE_URL=$(curl -s https://api.github.com/repos/tedmdelacruz/bootstrap/releases/latest | grep "zipball_url" | cut -d '"' -f 4)

if [ -z "$LATEST_RELEASE_URL" ]; then
    echo "❌ Failed to fetch latest release URL"
    exit 1
fi

echo "📦 Downloading latest release..."
curl -L -o "$TEMP_DIR/bootstrap.zip" "$LATEST_RELEASE_URL"

echo "📂 Extracting files..."
cd "$TEMP_DIR"
unzip -q bootstrap.zip

# Find the extracted directory (GitHub creates a directory with repo-commit format)
EXTRACTED_DIR=$(find . -maxdepth 1 -type d -name "tedmdelacruz-bootstrap-*" | head -1)

if [ -z "$EXTRACTED_DIR" ]; then
    echo "❌ Failed to find extracted directory"
    exit 1
fi

# Move to the original location
cd - > /dev/null
mv "$TEMP_DIR/$EXTRACTED_DIR" "$PROJECT_NAME"

echo "✅ Bootstrap starter kit successfully installed to './$PROJECT_NAME'"
echo ""
echo "🎯 Next steps:"
echo "   1. cd $PROJECT_NAME"
echo "   2. cp .env.example .env"
echo "   3. Edit .env with your configuration"
echo "   4. docker compose up -d --build"
echo ""
echo "📖 Documentation: https://github.com/tedmdelacruz/bootstrap"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000"