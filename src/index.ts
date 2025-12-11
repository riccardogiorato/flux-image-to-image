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

// CLI mode - direct command execution
const model = process.argv[2] || "black-forest-labs/FLUX.1-dev";

if (model === "--help" || model === "-h") {
  console.log("Usage: bun run src/index.ts [model]");
  console.log("");
  console.log("Example: bun run src/index.ts black-forest-labs/FLUX.1-dev");
  console.log("Make sure to set TOGETHER_API_KEY environment variable");
  console.log("");
  console.log(
    "This script uses Together AI to transform room images with beautiful furniture and design."
  );
  console.log("Available models: black-forest-labs/FLUX.1-dev");
  console.log("");
  console.log(`Fixed input image: ${INPUT_IMAGE_URL}`);
  process.exit(0);
}

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
