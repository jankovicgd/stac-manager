# @stac-manager/client

## Introduction
The STAC-Manager is a tool designed for managing the values of a STAC (SpatioTemporal Asset Catalog) collection and its items. This interface provides a user-friendly way to modify and update the properties of collections and items within a STAC catalog.

## Installation and Usage
See root README.md for instructions on how to install and run the project.

## Client specific instructions

Some client options are controlled by environment variables. These are:
```
# App config
## Title and description of the app for metadata
APP_TITLE
APP_DESCRIPTION

# API
## If the app is being served in from a subfolder, the domain url must be set.
PUBLIC_URL
REACT_APP_STAC_BROWSER
REACT_APP_STAC_API

# Theming
REACT_APP_THEME_PRIMARY_COLOR
REACT_APP_THEME_SECONDARY_COLOR
```

You must provide a value for the `REACT_APP_STAC_API` environment variable. This should be the URL of the STAC API you wish to interact with.

If the `REACT_APP_STAC_BROWSER` environment variable is not set, [Radiant Earth's STAC Browser](https://radiantearth.github.io/stac-browser/) will be used by default, which will connect to the STAC API specified in `REACT_APP_STAC_API`.