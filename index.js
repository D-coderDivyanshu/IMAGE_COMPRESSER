const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const yargs = require('yargs');

// Define command-line options
/*
    -> Yargs is a command line parser, it helps in parsing command line arguments in a connivent way.
    -> It gives us following features
      1. parsing arguments
      2. creating options
      3. help generation
      4. Demand options
*/
const options = yargs
  .usage('Usage: $0 --path <path> [--output <output-path>]')
  .option('p', {
    alias: 'path',
    describe: 'Path to the directory containing images',
    demandOption: true,
    type: 'string',
  })
  .option('o', {
    alias: 'output',
    describe: 'Output path for compressed images',
    type: 'string',
  })
  .argv;

// Function to compress images in a directory
const compressImages = async (inputPath, outputPath) => {
  try {
    // Read the list of files in the directory
    const files = fs.readdirSync(inputPath);

    // Create the output directory if it doesn't exist
    if (outputPath && !fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    // Process each file in the directory
    for (const file of files) {
      const inputFilePath = path.join(inputPath, file);
      const outputFilePath = outputPath
        ? path.join(outputPath, file)
        : inputFilePath;

      // Check if the file is an image (you can add more image extensions if needed)
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        console.log(`Compressing: ${inputFilePath}`);

        // Compress the image using Sharp
        await sharp(inputFilePath).toFile(outputFilePath);
      } else {
        console.log(`Skipping non-image file: ${inputFilePath}`);
      }
    }

    console.log('Compression complete!');
  } catch (error) {
    console.error('Error compressing images:', error.message);
  }
};

// Run the image compression function
compressImages(options.path, options.output);
