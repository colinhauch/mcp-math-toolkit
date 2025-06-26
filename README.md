# MCP Math Toolkit

A lightweight, authless Model Context Protocol (MCP) server that provides mathematical operations and statistical functions. Built with Node.js, TypeScript, and designed for easy Docker deployment.

## Features

### Basic Arithmetic
- Addition, subtraction, multiplication, division
- Power operations and square root
- Absolute value and rounding

### Advanced Mathematics
- Trigonometric functions (sin, cos, tan)
- Logarithmic functions (natural log, log base 10)
- Factorial calculation

### Statistical Operations
- Mean, median, and standard deviation
- Minimum and maximum values
- Array-based statistical analysis

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
    "math-toolkit": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/mcp-math-toolkit"
    }
  }
}
```

## Available Tools

### Basic Operations
- `add(a, b)` - Add two numbers
- `subtract(a, b)` - Subtract b from a
- `multiply(a, b)` - Multiply two numbers
- `divide(a, b)` - Divide a by b

### Mathematical Functions
- `power(base, exponent)` - Raise base to power
- `sqrt(n)` - Square root
- `factorial(n)` - Factorial of non-negative integer
- `abs(n)` - Absolute value
- `round(n, decimals)` - Round to specified decimal places

### Trigonometric Functions
- `sin(angle)` - Sine (angle in radians)
- `cos(angle)` - Cosine (angle in radians)  
- `tan(angle)` - Tangent (angle in radians)

### Logarithmic Functions
- `log(n)` - Natural logarithm
- `log10(n)` - Base-10 logarithm

### Statistical Functions
- `mean(numbers)` - Arithmetic mean
- `median(numbers)` - Median value
- `standard_deviation(numbers)` - Standard deviation
- `min(numbers)` - Minimum value
- `max(numbers)` - Maximum value

## API Schema

Each tool follows a consistent schema pattern. For example:

```json
{
  "name": "add",
  "description": "Add two numbers",
  "inputSchema": {
    "type": "object",
    "properties": {
      "a": { "type": "number", "description": "First number" },
      "b": { "type": "number", "description": "Second number" }
    },
    "required": ["a", "b"]
  }
}
```

## Error Handling

The server includes comprehensive error handling for:
- Division by zero
- Invalid inputs (negative numbers for sqrt, non-integers for factorial)
- Empty arrays for statistical functions
- Invalid logarithm arguments

## Development

### Project Structure
```
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
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

1. Add the mathematical function to the `MathToolkit` class
2. Define the tool schema in the `tools` array
3. Add a case in the request handler switch statement

Example:
```typescript
// Add to MathToolkit class
static newFunction(param: number): number {
  return param * 2;
}

// Add to tools array
{
  name: "new_function",
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
case "new_function":
  result = MathToolkit.newFunction(args.param);
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
