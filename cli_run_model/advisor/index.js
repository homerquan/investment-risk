#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const process = require('process');
const OpenAI = require("openai");

program
  .description('CLI tool to perform risk analysis on investment opportunities')
  .requiredOption('-f, --file <string>', 'Input JSON file name')
  .requiredOption('-g, --goal <string>', 'goal text')
  .requiredOption('-c, --context <string>', 'context text');

program.parse(process.argv);

const options = program.opts();


const run = async()=>{
  const inputData = JSON.parse(fs.readFileSync(options.file, 'utf8'));
  const analysis = await performRiskAnalysis(inputData);
  console.log(JSON.stringify(analysis, null, 2));
}

if (options.file) {
  run();
}

async function performRiskAnalysis(data, model = "gpt3.5") {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
  });

  let advaice = {};

  const goal = options.goal;
  const context = options.context;

  let prompt = `
assume an investor want to do this: ${goal} (right now means 2022/1/1), and claim with this context: ${context} 
based on following JSON data about annual report and stock price history
  
=== report and stock price history ====

${data}

===
  
  please give risk analysis in the following JSON format (replace data please):

===
{
  "summary": "Based on Boeing's annual report and stock market performance as of 2022/01/01, %more summary from JSON data about annual report and stock price history%",
 "score": 3,
  "risks": [
    {
      "name": "Market Competition",
      "details": "Boeing faces intense competition from Airbus in the commercial aviation sector. Any significant advancements or sales victories by Airbus could negatively impact Boeing's market share and stock price.",
      "evidence": "%explain why this is a risk based on JSON data about annual report and stock price history%"
    },
    {
      "name": "Regulatory Risks",
      "details": "Boeing is still navigating the aftermath of the 737 MAX incidents, with ongoing regulatory scrutiny that could affect its operational freedom and impose additional costs.",
      "evidence": "%explain why this is a risk based on JSON data about annual report and stock price history%"
    },
    {
"      name": "Supply Chain Disruptions",
      "details": "Global supply chain issues, partly due to the pandemic, could delay Boeing's production schedules and deliveries, impacting revenue forecasts.",
      "evidence": "%explain why this is a risk based on JSON data about annual report and stock price history%"
    },
    {
      "name": "Geopolitical Tensions",
      "details": "Escalating geopolitical tensions, especially involving key markets or suppliers, could disrupt Boeing's operations or alter the defense spending patterns of governments, affecting both commercial and defense sectors.",
      "evidence": "%explain why this is a risk based on JSON data about annual report and stock price history%"
    }
  ],
  "bi": {}
}
===
Plese note:
Summary is the general suggestion for investor to consider 
Score is reflect the recommendation of buy it or not (5 is strong recommended to buy, 0 is least recommended) 
Risks list the itemized each potential risk, and in detail, give the evidence (E.g., data in report ) to support this assessment
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
    advice = JSON.parse(output);
  } catch (e) {
    console.error("Error parsing advice:", e);
  }

  return  advice;
}