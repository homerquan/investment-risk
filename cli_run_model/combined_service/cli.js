const { exec } = require('child_process');
const fs = require('fs-extra');
const { program } = require('commander');

// Function to run a command and wait for its completion
const runCommand = (command) => new Promise((resolve, reject) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return reject(error);
    }
    console.log(stdout);
    resolve(stdout);
  });
});

// Main function to run the commands in sequence
async function main(input) {
  try {
    // Ensuring previous step files are cleared
    await runCommand('rm -f input.json step1.json step2.json step3.json');
    // Step 1: Run tasks_creator
    await fs.writeJson('input.json', input); // Writing input to a file to avoid shell argument length limit and escaping issues
    await runCommand(`node ../tasks_creator --input '${JSON.stringify(input)}' > step1.json`);
    // Step 2: Run tasks_executor
    await runCommand('node ../tasks_executor --file step1.json > step2.json');
    // Step 3: Run advisor
    await runCommand(`node ../advisor --file step2.json --goal "${input.goal}" --context "${input.context.text + ". Ask time is " + input.context.timestamp}" ${input.goal} > step3.json`);
    
    const step3Data = await fs.readJson('step3.json');
    console.log(JSON.stringify(step3Data, null, 2)); // Pretty print the JSON

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Use commander to parse command line arguments
program
  .option('-i, --input <type>', 'Input data in JSON format');

program.parse(process.argv);
const options = program.opts();

// Check if input was provided
if (!options.input) {
  console.error('No input provided. Please use the -i option to provide input.');
  process.exit(1);
}

let input;
try {
  input = JSON.parse(options.input);
} catch (error) {
  console.error('Failed to parse input JSON. Please ensure it is correctly formatted.');
  process.exit(1);
}

main(input);