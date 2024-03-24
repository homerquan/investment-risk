#How to Use

Save the code in a file named tasks_creator.js.
Make sure you're in the directory containing tasks_creator.js in your terminal.
Make the script executable (optional for Windows users): chmod +x tasks_creator.js.
Run the tool by passing the input JSON string as an argument. Here's an example:

```
node index.js --input '{"goal":"I want to invest $5000 on Boeing for 6 months right now","context": {"timestamp":"2022-03-23", "text":"I have 100K cash in saving account"}}'
```

This command outputs the generated tasks in the specified format. Adjust the generateTasks function as necessary to handle different input cases and generate appropriate tasks.