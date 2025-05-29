# Recipe Management Client

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
│   ├── apollo.js             # Apollo Client configuration
│   ├── App.js                # Main application component
│   ├── App.css               # Application styles
│   ├── index.js              # Entry point
│   ├── index.css             # Global styles
│   ├── components/           # React components
│   │   ├── RecipeList.js     # List of all recipes
│   │   ├── RecipeDetail.js   # Detailed view of a recipe
│   │   └── AddRecipe.js      # Form to add a new recipe
│   └── graphql/              # GraphQL queries and mutations
│       └── queries.js        # All GraphQL operations
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
- The backend implementation details can be found in the corresponding Spring Boot project.
