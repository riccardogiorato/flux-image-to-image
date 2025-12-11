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

## Supported Models

- `black-forest-labs/FLUX.1-dev` (default)

## What the Transformation Does

The system uses this detailed prompt to transform rooms:

> "Keep the walls and windows similar to the original. Transform the room with beautiful, functional furniture and thoughtful design. Add stylish, comfortable seating, elegant storage solutions, and practical furniture pieces that make the space usable and inviting. Incorporate warm ambient lighting, tasteful decor accents, and a cohesive color scheme. Arrange furniture to create clear pathways and functional zones. Include cozy textiles, plants, and personal touches that make the room feel lived-in and welcoming. Remove any watermarks, logos, or text overlays that may be present in the original image. The result should be a gorgeous, highly functional space that's both aesthetically pleasing and comfortable for everyday living."

The script will:
1. Take your input image URL
2. Send it to Together AI with the transformation prompt
3. Save the transformed image as `transformed_room.jpg` (or your specified output path)

## What the transformation does

The script uses this detailed prompt to transform your room:

> "Keep the walls and windows similar to the original. Transform the room with beautiful, functional furniture and thoughtful design. Add stylish, comfortable seating, elegant storage solutions, and practical furniture pieces that make the space usable and inviting. Incorporate warm ambient lighting, tasteful decor accents, and a cohesive color scheme. Arrange furniture to create clear pathways and functional zones. Include cozy textiles, plants, and personal touches that make the room feel lived-in and welcoming. Remove any watermarks, logos, or text overlays that may be present in the original image. The result should be a gorgeous, highly functional space that's both aesthetically pleasing and comfortable for everyday living."

## Requirements

- Bun runtime
- Together AI API key
- Input image (JPG, PNG, or other common formats)

## Supported Models

Currently uses `black-forest-labs/FLUX.1-kontext-pro` for optimal image-to-image results.

## Troubleshooting

- Make sure your `.env` file contains a valid `TOGETHER_API_KEY`
- Ensure your input image exists and is a valid image file
- Check that you have sufficient API credits with Together AI

## License

MIT