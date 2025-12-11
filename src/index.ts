import { Together } from "together-ai";
import { writeFileSync } from "fs";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

// Fixed input image URL
const INPUT_IMAGE_URL =
  "https://i.ibb.co/GQy3R6qx/cluttered-living-room-JPWJRX.jpg";

function slugifyModelName(model: string): string {
  // Extract the last part of the model name and make it filename-safe
  const parts = model.split("/");
  const modelName = parts[parts.length - 1] || model;
  return modelName.toLowerCase().replace(/[^a-z0-9]/g, "_");
}

async function generateImageToImage(model: string): Promise<string> {
  const prompt =
    "Keep the walls and windows similar to the original. Transform the room with beautiful, functional furniture and thoughtful design. Add stylish, comfortable seating, elegant storage solutions, and practical furniture pieces that make the space usable and inviting. Incorporate warm ambient lighting, tasteful decor accents, and a cohesive color scheme. Arrange furniture to create clear pathways and functional zones. Include cozy textiles, plants, and personal touches that make the room feel lived-in and welcoming. Remove any watermarks, logos, or text overlays that may be present in the original image. The result should be a gorgeous, highly functional space that's both aesthetically pleasing and comfortable for everyday living.";

  console.log(`Generating image-to-image transformation with ${model}...`);
  console.log(`Input image: ${INPUT_IMAGE_URL}`);

  const response = await together.images.generate({
    model: model,
    prompt: prompt,
    width: 1024,
    height: 1024,
    response_format: "base64",
    image_url: INPUT_IMAGE_URL,
  });

  if (response.data && response.data[0] && response.data[0].b64_json) {
    const base64Data = response.data[0].b64_json;
    const imageUrl = `data:image/jpeg;base64,${base64Data}`;
    console.log(`✅ Image transformation complete with ${model}!`);
    return imageUrl;
  } else {
    throw new Error("No image data received in response");
  }
}

// FLUX models that support image-to-image
const SUPPORTED_MODELS = [
  "black-forest-labs/FLUX.1-kontext-dev",
  "black-forest-labs/FLUX.1-kontext-pro",
  "black-forest-labs/FLUX.1-kontext-max",
  "black-forest-labs/FLUX.2-pro",
  "black-forest-labs/FLUX.2-flex"
];

async function runBatch(models: string[]) {
  console.log(`🚀 Starting batch processing of ${models.length} FLUX models...`);
  console.log(`Input image: ${INPUT_IMAGE_URL}`);
  console.log("");

  const results = [];

  for (const model of models) {
    try {
      console.log(`🔄 Processing ${model}...`);
      const result = await generateImageToImage(model);
      const outputFilename = `${slugifyModelName(model)}_transformed.jpg`;

      // Extract base64 data and save as file
      const parts = result.split(",");
      if (parts.length !== 2 || !parts[1]) {
        throw new Error("Invalid image data format");
      }
      const base64Data = parts[1];
      const outputBuffer = Buffer.from(base64Data, "base64");
      writeFileSync(outputFilename, outputBuffer);

      results.push({ model, success: true, filename: outputFilename });
      console.log(`✅ ${model} → ${outputFilename}`);
    } catch (error) {
      console.log(`❌ ${model} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      results.push({ model, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
    console.log("");
  }

  console.log("📊 Batch processing complete!");
  console.log(`Successful: ${results.filter(r => r.success).length}/${models.length}`);

  const successful = results.filter(r => r.success);
  if (successful.length > 0) {
    console.log("\n✅ Successfully generated:");
    successful.forEach(r => console.log(`   ${r.filename}`));
  }

  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log("\n❌ Failed models:");
    failed.forEach(r => console.log(`   ${r.model}: ${r.error}`));
  }
}

// CLI mode - direct command execution
const command = process.argv[2];

if (command === "--help" || command === "-h") {
  console.log("Usage: bun run src/index.ts [model|batch]");
  console.log("");
  console.log("Examples:");
  console.log("  bun run src/index.ts                          # Use default model (FLUX.1-dev)");
  console.log("  bun run src/index.ts black-forest-labs/FLUX.1-kontext-pro  # Specific model");
  console.log("  bun run src/index.ts batch                   # Run all supported FLUX models");
  console.log("");
  console.log("Make sure to set TOGETHER_API_KEY environment variable");
  console.log("");
  console.log("Supported models for batch:");
  SUPPORTED_MODELS.forEach(model => console.log(`  - ${model}`));
  console.log("");
  console.log(`Fixed input image: ${INPUT_IMAGE_URL}`);
  process.exit(0);
}

if (command === "batch") {
  if (!process.env.TOGETHER_API_KEY) {
    console.error("Please set the TOGETHER_API_KEY environment variable");
    console.error("You can get an API key from https://together.ai");
    process.exit(1);
  }

  runBatch(SUPPORTED_MODELS).catch(error => {
    console.error("❌ Batch processing failed:", error);
    process.exit(1);
  });
} else {
  // Single model mode
  const model = command || "black-forest-labs/FLUX.1-dev";

  if (!process.env.TOGETHER_API_KEY) {
    console.error("Please set the TOGETHER_API_KEY environment variable");
    console.error("You can get an API key from https://together.ai");
    process.exit(1);
  }

  try {
    const result = await generateImageToImage(model);
    const outputFilename = `${slugifyModelName(model)}_transformed.jpg`;

    // Extract base64 data and save as file
    const parts = result.split(",");
    if (parts.length !== 2 || !parts[1]) {
      throw new Error("Invalid image data format");
    }
    const base64Data = parts[1];
    const outputBuffer = Buffer.from(base64Data, "base64");
    writeFileSync(outputFilename, outputBuffer);
    console.log(`📁 Saved to: ${outputFilename}`);
  } catch (error) {
    console.error("❌ Error generating image:", error);
    process.exit(1);
  }
}
