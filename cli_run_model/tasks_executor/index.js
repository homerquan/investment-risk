#!/usr/bin/env node

const { program } = require("commander");
const moment = require("moment");
const fs = require('fs');
const process = require("process");
const yahooFinance = require("yahoo-finance");
const axios = require('axios');

const FMP_API_KEY = "f28c1df74c02fc9d574b79900a2d9147";

program
  .description("CLI tool to execute tasks and generate output")
  .requiredOption('-f, --file <string>', 'Input JSON file name');

program.parse(process.argv);

const options = program.opts();

const runAsync = async(tasks) => {
  const results = await executeTasks(tasks.actions);
  console.log(JSON.stringify(results));
}

if (options.file) {
  const tasks = JSON.parse(fs.readFileSync(options.file, 'utf8'));
  runAsync(tasks);
}

async function executeTasks(tasks) {
  // Mock function to execute tasks and return results
  let evidencs = {};
  let runningTasks = [];
  tasks.map(async (task) => {
    switch (task.action) {
      // add more action types later
      case "LOOK_REPORT":
        runningTasks.push(getAnnualReport(
          task.data.symbol,
          task.data.range.from,
          task.data.range.to
        ));
      case "LOOK_STOCK_PRICE":
        runningTasks.push(getStockPrice(
          task.data.symbol,
          task.data.range.from,
          task.data.range.to
        ));   
      default:
        // do nothing; 
    }
  });

  evidencs = await Promise.all(runningTasks);

  return {"report":evidencs[0],"stock":evidencs[1]};
}

async function getStockPrice(symbol, from, to) {
  const options = {
    // Include options such as period (daily, weekly, monthly)
    period: "m",
  };
  return new Promise((resolve, reject) => {
    yahooFinance.historical(
      {
        symbol,
        from,
        to,
        ...options,
      },
      (err, quotes) => {
        if (err) {
          reject(err);
        } else {
          resolve(quotes);
        }
      }
    );
  });
}

async function getAnnualReport(symbol, from, to) {
  const url = `https://financialmodelingprep.com/api/v3/financial-statement-full-as-reported/${symbol}?period=annual&limit=5&apikey=${FMP_API_KEY}`;

  try {
    const response = await axios.get(url);
    const reports = response.data;
    // Filter reports by the report release date
    const filteredReports = reports.filter(report => {
      const reportDate = new Date(report.date);
      const startDate = new Date(from);
      const endDate = new Date(to);
      return reportDate >= startDate && reportDate <= endDate;
    });
    return filteredReports;
  } catch (error) {
    console.error('Error fetching annual reports:', error);
  }
}



