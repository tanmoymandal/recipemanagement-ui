# Recipe Management Client

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-16.6.0-pink.svg)](https://graphql.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.13.0-blue.svg)](https://mui.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is a React-based frontend for the Recipe Management System, designed to work with a GraphQL API built with Spring Boot.

## Features

- View all recipes with search and filter capabilities
- View detailed recipe information
- Add new recipes
- Delete recipes
- Responsive design using Material-UI

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Project Structure

```
recipe-management-client/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── apollo.ts             # Apollo Client configuration
│   ├── App.tsx               # Main application component
│   ├── App.css               # Application styles
│   ├── index.tsx             # Entry point
│   ├── index.css             # Global styles
│   ├── components/           # React components
│   │   ├── RecipeList.tsx    # List of all recipes
│   │   ├── RecipeDetail.tsx  # Detailed view of a recipe
│   │   └── AddRecipe.tsx     # Form to add a new recipe
│   └── graphql/              # GraphQL queries and mutations
│       └── queries.ts        # All GraphQL operations
├── package.json
└── README.md
```

## Dependencies

- React
- React Router
- Apollo Client
- GraphQL
- Material-UI

## Backend Configuration

This frontend is designed to connect to a GraphQL API running at `http://localhost:8080/graphql`. Make sure your backend is running and accessible at this URL.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App configuration

## Notes

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- The backend implementation details can be found in the corresponding Spring Boot project. [recipemanagement](https://github.com/tanmoymandal/recipemanagement)
