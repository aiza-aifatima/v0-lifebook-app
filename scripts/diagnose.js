#!/usr/bin/env node

/**
 * Diagnostic script to check Lifebook development environment
 * Run with: node scripts/diagnose.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🔍 Lifebook Development Diagnostic\n');
console.log('================================\n');

let allChecksPassed = true;

// Check 1: Node.js version
console.log('1. Checking Node.js version...');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
  console.log(`   ✓ Node.js ${nodeVersion}`);
} catch (e) {
  console.log('   ✗ Node.js not found');
  allChecksPassed = false;
}

// Check 2: npm version
console.log('\n2. Checking npm version...');
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  console.log(`   ✓ npm ${npmVersion}`);
} catch (e) {
  console.log('   ✗ npm not found');
  allChecksPassed = false;
}

// Check 3: node_modules
console.log('\n3. Checking node_modules...');
if (fs.existsSync(path.join(__dirname, '../node_modules'))) {
  console.log('   ✓ node_modules exists');
} else {
  console.log('   ⚠ node_modules not found - Run: npm install');
  allChecksPassed = false;
}

// Check 4: .env.local file
console.log('\n4. Checking .env.local file...');
if (fs.existsSync(path.join(__dirname, '../.env.local'))) {
  console.log('   ✓ .env.local exists');
  
  // Check for required variables
  const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
  const hasUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
  const hasKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  if (hasUrl && hasKey) {
    console.log('   ✓ Required Supabase variables found');
  } else {
    console.log('   ⚠ Missing Supabase environment variables');
    allChecksPassed = false;
  }
} else {
  console.log('   ⚠ .env.local not found - Create from .env.example');
  allChecksPassed = false;
}

// Check 5: Key files
console.log('\n5. Checking key files...');
const keyFiles = [
  'app/layout.tsx',
  'app/page.tsx',
  'lib/supabase/client.ts',
  'lib/supabase/server.ts',
  'middleware.ts',
];

let filesOk = true;
keyFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, '../', file))) {
    console.log(`   ✓ ${file}`);
  } else {
    console.log(`   ✗ Missing: ${file}`);
    filesOk = false;
  }
});

if (!filesOk) {
  allChecksPassed = false;
}

// Check 6: Port availability
console.log('\n6. Checking port 3000 availability...');
try {
  const net = require('net');
  const server = net.createServer();
  
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log('   ⚠ Port 3000 is in use');
      console.log('   → Try: npm run dev -- -p 3001');
    } else {
      console.log('   ? Unable to check port');
    }
  });
  
  server.once('listening', () => {
    server.close();
    console.log('   ✓ Port 3000 is available');
  });
  
  server.listen(3000, '127.0.0.1');
} catch (e) {
  console.log('   ? Could not check port');
}

// Summary
console.log('\n================================\n');
if (allChecksPassed) {
  console.log('✅ All checks passed! Ready to run:\n');
  console.log('   npm run dev\n');
} else {
  console.log('⚠️  Some checks failed. See above for details.\n');
  console.log('Common fixes:\n');
  console.log('1. npm install');
  console.log('2. Create .env.local with Supabase credentials');
  console.log('3. Kill existing processes: lsof -ti:3000 | xargs kill -9\n');
}
