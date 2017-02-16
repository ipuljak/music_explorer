# Spotify Artist Explorer

## Table of Contents
- [About](#about)  
- [Installation](#installation)  
- [Demo](#demo)  
- [How To Use](#howtouse)  
- [File Structure](#structure)  
- [Technologies Used](#techused)  
- [About Me](#aboutme)  

### About
This is a React and D3 application that I made which utilizes the Spotify and Last.fm APIs to fetch and display information about an artist, as well as give suggestions to similar artists through a dynamically expandable node tree diagram. The purpose of the application is to let the user explore and discover music similar to their tastes by finding comparable artists and giving the user some music to preview.

### Installation
To install, run:

`npm install`

To run the tests:

`npm run test`

To run the development server (default port 3000):

`npm start`

To run the production server:

`npm run build`

and then serve the build files using the server of your choice.

### Demo
This application can be demoed [here](https://puljak.ca/artist_explorer).

### How To Use
To use this application, enter an artist that you'd like to explore in the search bar. The application will load in the information about the artist including a photograph, a wiki-like blurb about them, as well as a list of some top tracks which can be clicked to play a 30 second preview. 

A node image of the artist will also appear as the starting point of a D3 generated node diagram on the left, and when clicked will expand 5 additional nodes representing what Spotify deems to be similar artists. Each of these additional artists can also be clicked to expand their similar artists, as well as load their information and top tracks. The diagram can be resized through scrolling the mouse wheel, as well as dragged around while holding down the left mouse button. 

### File Structure
```
├── node_modules/
|   ├── Module dependencies
├── public/
|   ├── Public files served - index, stylesheets, favicon, etc.
├── src/
│   ├── actions/
|   |   ├── Redux actions and type constant definitions
│   ├── app/
│   │   ├── App component entry point
│   ├── components/
│   │   ├── React components that make up the application
│   ├── d3/
│   │   ├── Code for generating an expandable node diagram
│   ├── reducers/
│   │   ├── Redux reducer for artist exploring actions
|   ├── index.js
|   |   ├── Main index file, all definitions & reactDOM render
├── package.json
|   ├── package.json file
├── README.md
|   ├── README.md file
```

### Technology Used
The following are some of the various frameworks and libraries used to create this application:
- create-react-app to initialize the project configuration
- React for the front-end
- Redux to store the state
- D3.js to create the dynamically expandable node diagram
- axios for promise based HTTP calls
- redux-thunk middleware

### About Me
For more information about me, visit my website at [puljak.ca](https://puljak.ca)!