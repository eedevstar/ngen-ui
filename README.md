# @navigate/ui

## Overview

`@navigate/ui` was ejected from Create React App. Most [CRA documentation](https://create-react-app.dev/) still applies.


## Installation
```
npm i
```   


## Scripts

#### `npm start`

Compiles and runs `@navigate/ui` for development on `localhost:3000`.

#### `npm run storybook`
This currently doesn't work. Do not spend time debugging storybook
Compiles and runs Storybook on `localhost:9009`. 

#### `npm run build`

Compiles and outputs a production build to the `build` folder.


## Environment variables
Environment variables should be set in the `.env` file. The default development values are committed to the repo. 

- `API_ENDPOINT` - REST service address (`localhost:4000` in development)
- `SOCKET_ENDPOINT` - Socket service address (`localhost:4040` in development)


## Deployment

To test a build locally on `localhost:5000`:
```
npm run build
npx serve -s build -l 5000
```

This may surface production-only issues before deploying remotely.

To deploy to an S3 bucket that has been configured to serve a single page app:
```
aws s3 sync build s3://<bucket>
```
