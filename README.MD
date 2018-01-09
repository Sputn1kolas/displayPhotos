# Beta Climb

## Setting up local dev environment

Install node dependencies in app and server folders using `npm install`.

You will then need to setup your DB. Open the beta-server folder and run the following commands:

```
node dbFunctions.js migrate
node dbFunctions.js seed
```

`master` branch contains latest working code.
`production` branch is the latest test build.