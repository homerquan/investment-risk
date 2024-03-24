* How to run:

1. set openai api key in your enviroment: 
`export OPENAI_API_KEY= xxxxxxx`
2. install node dependences on all four folders in cli_run_model folder 
`npm i .`
3. start model web service: `cd cli_run_model/combined_service; node web.js`
4. start ui web service: `cd cli_run_model/ui; php -S 0.0.0.0:8000`
5. Open "http://local:8000" on you browser