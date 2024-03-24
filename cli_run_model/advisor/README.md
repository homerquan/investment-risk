# Advice 

Have the code in a file named advisor/index.js.
In your terminal, navigate to the directory containing advisor.js.
Make the script executable (optional for Windows): chmod +x advisor.js.
Run the tool by passing the tasks JSON string as an argument. For example:

* How to run
`node index.js --file ../tasks_executor/output.json --goal "I want to invest $5000 on AAPL for 6 months right now" --context "I have 100K cash in saving account"`

This will output a mock risk analysis summary and identified risks based on the input data, which you would need to adjust according to real-world analyses and data for practical use.