const express = require('express');
const { exec } = require('child_process');
const fs = require('fs-extra');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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
async function processInput(input) {
  try {
    // Ensuring previous step files are cleared
    await runCommand('rm -f input.json step1.json step2.json step3.json');
    // Step 1: Run tasks_creator
    await fs.writeJson('input.json', input); // Writing input to a file to avoid shell argument length limit and escaping issues
    await runCommand(`node ../tasks_creator --input '${JSON.stringify(input)}' > step1.json`);
    // Step 2: Run tasks_executor
    await runCommand('node ../tasks_executor --file step1.json > step2.json');
    // Step 3: Run advisor
    await runCommand(`node ../advisor --file step2.json --goal "${input.goal}" --context "${input.context.text + ". Ask time is " + input.context.timestamp}" > step3.json`);
    
    const step3Data = await fs.readJson('step3.json');
    return JSON.stringify(step3Data, null, 2); // Return pretty printed JSON
  } catch (error) {
    console.error('An error occurred:', error);
    throw error; // Rethrow to handle in the Express route
  }
}

// Define POST route to process input
app.post('/execute', async (req, res) => {
  try {
    const input = req.body;
    const output = await processInput(input);
    res.json(JSON.parse(output));
  } catch (error) {
    res.status(500).send({ message: 'An error occurred during processing', error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
