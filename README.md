# What is Second Insight

It undertakes essential tasks such as scrutinizing annual reports and stock prices, and utilizing collected data to provide insightful risk assessments. Using LLM in both task generation (like some robotic task planning) and taking evidences to make finall assessement. 

# Links

* Devpost: https://devpost.com/software/second-insight
* Video demo: https://youtu.be/i5kxJhkhHWE
* Pitch: https://docs.google.com/presentation/d/1t4tPOh-BVFyevip1v9yUVrzVvci77Iu6ZEyJ_3aWCkQ

# How to run:

1. set openai api key in your enviroment: 
`export OPENAI_API_KEY= xxxxxxx`
2. install node dependences on all four folders in cli_run_model folder 
`npm i .`
3. start model web service: `cd cli_run_model/combined_service; node web.js`
4. start ui web service: `cd cli_run_model/ui; php -S 0.0.0.0:8000`
5. Open "http://local:8000" on you browser