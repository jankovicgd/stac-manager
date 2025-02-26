# STAC-Manager 📡 📄 — Development

## Installation and Usage
The steps below will walk you through setting up your own instance of the project.

### Install Project Dependencies
To set up the development environment for this website, you'll need to install the following on your system:

- [Node](http://nodejs.org/) v20 (To manage multiple node versions we recommend [nvm](https://github.com/creationix/nvm))

### Install Application Dependencies

If you use [`nvm`](https://github.com/creationix/nvm), activate the desired Node version:

```
nvm install
```

Install Node modules:

```
npm install
```

### Running the App

To run the client app in development mode:
```
npm run plugins:build
npm run client:serve
```

If you're going to work on the form builder plugin system as well, you may want to run the watch mode on the packages:
```
npm run plugins:watch
```

### Building for Production
Build the app for production:
```
npm run all:build
```
This bundles the app in production mode, optimizing the build for performance. The build is minified, and filenames include hashes.

## Contributing
Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.
