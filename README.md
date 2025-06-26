# MCP Random Toolkit

A lightweight, authless Model Context Protocol (MCP) server that provides random number generation capabilities. Built with Node.js, TypeScript, and designed for easy Docker deployment.

## Features

### Pseudo Random Numbers
- Generate pseudo random integers using JavaScript's Math.random()
- Configurable min/max range (inclusive)

### True Random Numbers
- Generate truly random integers using quantum random number generator
- Uses quantum entropy from https://lfdr.de/QRNG/ API
- Configurable min/max range (inclusive)

## Quick Start

### Prerequisites
- Node.js 18+ (for local development)
- Docker (for containerized deployment)

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

### Docker Deployment

1. **Build and run with Docker:**
   ```bash
   docker build -t mcp-math-toolkit .
   docker run mcp-math-toolkit
   ```

2. **Or use Docker Compose:**
   ```bash
   # Production
   docker-compose up

   # Development with live reload
   docker-compose --profile dev up mcp-math-toolkit-dev
   ```

## MCP Integration

This server implements the Model Context Protocol and communicates via stdio. It can be integrated with MCP-compatible clients by configuring them to launch this server as a subprocess.

### Example MCP Client Configuration

```json
{
  "mcpServers": {
    "random-toolkit": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/mcp-random-toolkit"
    }
  }
}
```

## Available Tools

### Random Number Generation
- `pseudo_random_integer(min, max)` - Generate a pseudo random integer between min and max values (inclusive)
- `true_random_integer(min, max)` - Generate a truly random integer using quantum random number generator between min and max values (inclusive)

## API Schema

Each tool follows a consistent schema pattern. For example:

```json
{
  "name": "pseudo_random_integer",
  "description": "Generate a pseudo random integer between min and max values (inclusive)",
  "inputSchema": {
    "type": "object",
    "properties": {
      "min": { "type": "number", "description": "Minimum value (default: 0)", "default": 0 },
      "max": { "type": "number", "description": "Maximum value (default: 1)", "default": 1 }
    },
    "required": []
  }
}
```

## Error Handling

The server includes comprehensive error handling for:
- Invalid min/max ranges (min > max)
- Network failures when accessing quantum RNG API
- Invalid responses from quantum RNG API
- Missing or invalid arguments

## Development

### Project Structure
```
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
├── test-quantum.mjs      # Test quantum random generation
├── test-multiple-quantum.mjs # Test multiple quantum calls
├── test-server.mjs       # Test server functionality
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── Dockerfile           # Container definition
├── docker-compose.yml   # Multi-container setup
└── README.md           # This file
```

### Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run with live reload using tsx
- `npm run watch` - Watch mode for development
- `npm start` - Run compiled version
- `npm run clean` - Remove dist directory
- `npm run type-check` - Check types without compilation

### Adding New Tools

1. Add the random number generation function to the `RandomToolkit` class
2. Define the tool schema in the `tools` array
3. Add a case in the request handler switch statement

Example:
```typescript
// Add to RandomToolkit class
static newRandomFunction(param: number): number {
  return Math.floor(Math.random() * param);
}

// Add to tools array
{
  name: "new_random_function",
  description: "Description of the function",
  inputSchema: {
    type: "object",
    properties: {
      param: { type: "number", description: "Parameter description" }
    },
    required: ["param"]
  }
}

// Add to switch statement
case "new_random_function":
  result = RandomToolkit.newRandomFunction(args.param);
  break;
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Security

This server is designed to be lightweight and authless. It should only be used in trusted environments. For production deployments requiring authentication, consider implementing additional security layers.
