#!/bin/bash

# Founder Radar Setup Verification Script
# This script checks if all dependencies and configurations are in place

echo "╔════════════════════════════════════════════════════════╗"
echo "║     Founder Radar - Setup Verification Script         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to print check result
check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        ((CHECKS_FAILED++))
    fi
}

echo "Checking dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Node.js
command -v node >/dev/null 2>&1
check_result $? "Node.js is installed ($(node --version 2>/dev/null || echo 'not found'))"

# Check npm
command -v npm >/dev/null 2>&1
check_result $? "npm is installed ($(npm --version 2>/dev/null || echo 'not found'))"

# Check PostgreSQL
command -v psql >/dev/null 2>&1
check_result $? "PostgreSQL is installed ($(psql --version 2>/dev/null | cut -d' ' -f3 || echo 'not found'))"

echo ""
echo "Checking project files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check package.json
[ -f "package.json" ]
check_result $? "package.json exists"

# Check tsconfig.json
[ -f "tsconfig.json" ]
check_result $? "tsconfig.json exists"

# Check node_modules
[ -d "node_modules" ]
check_result $? "node_modules directory exists (dependencies installed)"

# Check dist folder
[ -d "dist" ]
check_result $? "dist directory exists (project compiled)"

# Check .env file
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    ((CHECKS_PASSED++))

    # Check for required environment variables
    if grep -q "ANTHROPIC_API_KEY=.\+" .env 2>/dev/null; then
        echo -e "${GREEN}✓${NC} ANTHROPIC_API_KEY is set in .env"
        ((CHECKS_PASSED++))
    else
        echo -e "${YELLOW}⚠${NC} ANTHROPIC_API_KEY is not set in .env (required for AI enrichment)"
        ((CHECKS_FAILED++))
    fi

    if grep -q "DB_NAME=.\+" .env 2>/dev/null; then
        echo -e "${GREEN}✓${NC} DB_NAME is set in .env"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} DB_NAME is not set in .env"
        ((CHECKS_FAILED++))
    fi
else
    echo -e "${RED}✗${NC} .env file does not exist"
    echo -e "${YELLOW}→${NC} Run: cp .env.example .env"
    ((CHECKS_FAILED++))
fi

echo ""
echo "Checking source files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check critical source files
[ -f "src/index.ts" ]
check_result $? "src/index.ts exists"

[ -f "src/db/schema.sql" ]
check_result $? "src/db/schema.sql exists"

[ -f "config/default.json" ]
check_result $? "config/default.json exists"

[ -d "src/scrapers" ]
check_result $? "src/scrapers directory exists"

[ -d "src/services" ]
check_result $? "src/services directory exists"

echo ""
echo "Checking documentation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

[ -f "README.md" ]
check_result $? "README.md exists"

[ -f "SETUP.md" ]
check_result $? "SETUP.md exists"

[ -f "API.md" ]
check_result $? "API.md exists"

[ -f "QUICKSTART.md" ]
check_result $? "QUICKSTART.md exists"

echo ""
echo "Testing TypeScript compilation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

npm run build >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} TypeScript compilation successful"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗${NC} TypeScript compilation failed"
    echo -e "${YELLOW}→${NC} Run: npm run build (to see errors)"
    ((CHECKS_FAILED++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}Failed: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env and add your ANTHROPIC_API_KEY"
    echo "2. Create PostgreSQL database: createdb founder_radar"
    echo "3. Run migrations: npm run migrate"
    echo "4. Start server: npm start"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠ Some checks failed. Please review above.${NC}"
    echo ""
    echo "Setup guide: See SETUP.md for detailed instructions"
    echo ""
    exit 1
fi
