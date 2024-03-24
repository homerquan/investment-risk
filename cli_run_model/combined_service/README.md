* call by cli:
`node cli.js --input '{"goal":"I want to invest $5000 on Boeing for 6 months right now","context": {"timestamp":"2022-03-23", "text":"I have 100K cash in saving account"}}'`

* call by web
`node web.js`
```
curl -X POST http://localhost:3000/execute \
-H "Content-Type: application/json" \
-d '{"goal":"I want to invest $5000 on Boeing for 6 months right now","context": {"timestamp":"2022-03-23", "text":"I have 100K cash in saving account"}}'
```