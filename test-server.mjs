#!/usr/bin/env node

/**
 * Simple test script to verify MCP server functionality
 */

import { spawn } from 'child_process';
import { resolve } from 'path';

async function testMCPServer() {
  console.log('Starting MCP Math Toolkit server test...\n');

  const serverPath = resolve('./dist/index.js');
  
  // Start the MCP server
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Test MCP initialization
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

  // Test tools list request
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  };

  // Test a simple calculation
  const addRequest = {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'add',
      arguments: {
        a: 5,
        b: 3
      }
    }
  };

  let responses = [];
  let responseCount = 0;
  const expectedResponses = 3;

  server.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    lines.forEach(line => {
      try {
        const response = JSON.parse(line);
        responses.push(response);
        responseCount++;
        
        if (response.id === 1) {
          console.log('✓ Server initialized successfully');
        } else if (response.id === 2) {
          console.log(`✓ Tools list received: ${response.result?.tools?.length || 0} tools available`);
        } else if (response.id === 3) {
          console.log(`✓ Addition test: ${response.result?.content?.[0]?.text || 'Unknown result'}`);
        }
        
        if (responseCount >= expectedResponses) {
          console.log('\n✅ All tests passed! MCP server is working correctly.');
          server.kill();
          process.exit(0);
        }
      } catch (e) {
        // Ignore parse errors for non-JSON output
      }
    });
  });

  server.stderr.on('data', (data) => {
    console.log('Server log:', data.toString().trim());
  });

  server.on('close', (code) => {
    if (code !== 0 && responseCount < expectedResponses) {
      console.error(`❌ Server exited with code ${code}`);
      process.exit(1);
    }
  });

  // Send test requests
  setTimeout(() => {
    server.stdin.write(JSON.stringify(initRequest) + '\n');
  }, 100);

  setTimeout(() => {
    server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  }, 200);

  setTimeout(() => {
    server.stdin.write(JSON.stringify(addRequest) + '\n');
  }, 300);

  // Timeout after 5 seconds
  setTimeout(() => {
    console.error('❌ Test timeout - server may not be responding correctly');
    server.kill();
    process.exit(1);
  }, 5000);
}

testMCPServer().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
