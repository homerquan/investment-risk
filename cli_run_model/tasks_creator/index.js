#!/usr/bin/env node

const { program } = require('commander');
const process = require('process');
const OpenAI = require("openai");

program
  .description('CLI tool to generate tasks based on input goals and contexts')
  .requiredOption('-i, --input <string>', 'Input JSON string with goal and context');

program.parse(process.argv);

const options = program.opts();

const run = async()=>{
  const input = JSON.parse(options.input);
  const tasks = await generateTasks(input);
  console.log(JSON.stringify(tasks));
}

if (options.input) {
  run();
}

async function generateTasks(input, model = "gpt3.5") {

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
  });

  let tasks = []

  let prompt = `
  Assuming you have to decide what to do to help a client analysis past 1 year history data (from input timestamp) to evaluate investment risks. A client ask to evaluate risk
  based on the following input, decide on the tasks to be performed:\n${JSON.stringify(input)}\n\nIf 
  the input is about an investment decision, output one or two actions (If it's a company with stock symbol it need to have both) in the json format (LOOK_REPORT and LOOK_STOCK_PRICE)
  replace symbol and date range according to input 
  ===
  {
    actions:[
    {
      "action": "LOOK_REPORT",
      "data": {
        "symbol": "BA",
        "range": {
          "from": "<e.g., yyyy-mm-dd>",
          "to": "<e.g., yyyy-mm-dd>"
        }
      }
    },
    {
      "action": "LOOK_STOCK_PRICE",
      "data": {
        "symbol": "BA",
        "range": {
          "from": "<e.g., yyyy-mm-dd>",
          "to": "<e.g., yyyy-mm-dd>"
        }
      }
    }
  ]
}
  ===
  Otherwise, including if the input ask a unknown company, state that "it's not an investment decision or can't understand" in json format.
  ===
  {"error":"it's not an investment decision or we can't understand"}
  ===
  `;

  // Prepare the prompt for OpenAI based on the input
  const messages = [
    {"role": "system", "content": prompt },
  ];

  // Specify the model to use
  const modelName = model === "gpt4" ? "gpt-4-turbo-preview" : "gpt-3.5-turbo-0125"; // Example model names for GPT-3.5 and GPT-4

  response = await openai.chat.completions.create({
    model: modelName,
    messages: messages,
    max_tokens: 500,
    response_format: { "type": "json_object" },
    n: 1,
    stop: null,
    temperature: 0.1,
  })

  const output = response.choices[0]?.message?.content;

  // Process the output here to convert it into tasks
  // This part of the code would depend on how you want to parse the API's output
  // For the example given, you would parse the output into JSON, if possible, or handle the error message

  try {
    tasks = JSON.parse(output);
  } catch (e) {
    console.error("Error parsing tasks:", e);
  }

  return tasks;
}