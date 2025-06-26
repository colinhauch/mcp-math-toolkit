#!/usr/bin/env node

/**
 * Test script to verify quantum random number generation
 */

import { spawn } from 'child_process';
import { resolve } from 'path';

async function testQuantumRNG() {
  console.log('Testing Quantum Random Number Generator...\n');

  const serverPath = resolve('./dist/index.js');
  
  // Start the MCP server
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let responseBuffer = '';
  
  server.stdout.on('data', (data) => {
    responseBuffer += data.toString();
  });

  server.stderr.on('data', (data) => {
    console.log('Server log:', data.toString().trim());
  });

  // Initialize the server
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };

  server.stdin.write(JSON.stringify(initRequest) + '\n');

  // Wait a bit for initialization
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test the true random number tool
  const toolRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'true_random_number',
      arguments: {
        min: 1,
        max: 100
      }
    }
  };

  console.log('Requesting quantum random number between 1 and 100...');
  server.stdin.write(JSON.stringify(toolRequest) + '\n');

  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Parse responses
  const responses = responseBuffer.split('\n').filter(line => line.trim());
  
  for (const response of responses) {
    try {
      const parsed = JSON.parse(response);
      if (parsed.id === 2) {
        console.log('✓ Quantum random number generated:', parsed.result?.content?.[0]?.text);
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }

  server.kill();
  console.log('\n✅ Quantum RNG test completed!');
}

testQuantumRNG().catch(console.error);
