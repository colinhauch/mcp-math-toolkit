#!/usr/bin/env node

/**
 * Multiple test script to verify quantum random number generation variability
 */

import { spawn } from 'child_process';
import { resolve } from 'path';

async function testMultipleQuantumRNG() {
  console.log('Testing Multiple Quantum Random Number Generations...\n');

  for (let i = 1; i <= 5; i++) {
    const serverPath = resolve('./dist/index.js');
    
    // Start the MCP server
    const server = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let responseBuffer = '';
    
    server.stdout.on('data', (data) => {
      responseBuffer += data.toString();
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
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test the true random number tool
    const toolRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'true_random_number',
        arguments: {
          min: 1,
          max: 1000
        }
      }
    };

    server.stdin.write(JSON.stringify(toolRequest) + '\n');

    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Parse responses
    const responses = responseBuffer.split('\n').filter(line => line.trim());
    
    for (const response of responses) {
      try {
        const parsed = JSON.parse(response);
        if (parsed.id === 2) {
          console.log(`Test ${i}: ${parsed.result?.content?.[0]?.text}`);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    server.kill();
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait between tests
  }

  console.log('\n✅ Multiple quantum RNG tests completed!');
}

testMultipleQuantumRNG().catch(console.error);
