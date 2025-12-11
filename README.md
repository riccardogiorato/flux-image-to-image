# Flux Image-to-Image Room Transformer

A Bun-based CLI tool that uses Together AI's FLUX models to transform room images with beautiful, functional furniture and thoughtful design.

## Features

- 🖥️ **CLI Tools**: Command-line interface for image transformation
- 🎨 **High Quality**: 1024x1024 resolution outputs
- 🔧 **Customizable**: Support for different FLUX models
- ⚡ **Fast Processing**: Direct API integration with Together AI

## Project Structure

```
flux-image-to-image/
├── src/
│   └── index.ts          # Main CLI application
├── .env                  # Environment variables
├── .env.example          # Environment template
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Setup

1. **Install dependencies:**

   ```bash
   bun install
   ```

2. **Set up your API key:**
   - Copy `.env.example` to `.env`
   - Get your Together AI API key from [https://together.ai](https://together.ai)
   - Add your API key to the `.env` file:
   ```
   TOGETHER_API_KEY=your_actual_api_key_here
   ```

## Usage

Run transformations from the command line:

```bash
# Basic usage with default model (FLUX.1-dev)
bun run src/index.ts

# Specify a different model
bun run src/index.ts "black-forest-labs/FLUX.1-dev"
```

The input image is fixed to: `https://i.ibb.co/GQy3R6qx/cluttered-living-room-JPWJRX.jpg`

Output files are automatically named based on the model name (e.g., `flux_1_dev_transformed.jpg`).

### Quick Test Commands

```bash
# Test with FLUX.1-dev
bun run test   # Uses FLUX.1-dev
bun run flux1  # Uses FLUX.1-dev
bun run flux2  # Uses FLUX.1-dev
```

## License

MIT
