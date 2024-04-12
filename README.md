# Posts_App

The post app allows users to **create**, **read**, **update**, **delete** posts, and **leave comments**. The app stores the post data in a database, allowing users to retrieve and edit their posts at any time. Additionally, the app may provide features such as user authentication, post categorization, and search functionality.

## Table of Contents
- [Features](#features)
- [Technologies_Used](#technologies-used)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create new posts
- Read existing posts
- Update posts
- Delete posts
- Leave comments on posts


## Technologies Used

-Node.js
-Express.js
-PostgreSql
-dependencies
    -ajv: JSON Schema validator
    -ajv-errors: Additional error messages for Ajv
    -ajv-formats: Additional formats for Ajv
    -bcrypt: Library for hashing passwords
    -express: Web framework for Node.js
    -jsonwebtoken: Library for JSON Web Tokens
    -knex: SQL query builder for Node.js
    -objection: ORM for Node.js
    -passport: Authentication middleware for Node.js
    -passport-jwt: Passport strategy for authenticating with a JSON Web Token
    -pg: PostgreSQL client for Node.js


## Installation

1. Ensure you have Node.js installed on your machine.
2. Clone the repository to your local machine.
3. Run `npm install` to install all node modules and dependencies.
4. Copy *.env.example* file and make it *.env* to have your own *.env* file and change all variables to valid data.
5. Make new database, or use existing empty one and change **database** field to your databae_name in *knexfile.js*.
6. Access the application in your browser at `http://localhost:3000`.


## Usage

- Create a new post: Make a POST request to `/posts` with the post content in the request body.
- Read a post: Make a GET request to `/posts/:id` to retrieve a specific post.
- Update a post: Make a PUT request to `/posts/:id` with the updated post content.
- Delete a post: Make a DELETE request to `/posts/:id` to remove a post.
- Leave a comment: Make a POST request to `/posts/:id/comments` with the comment content.


## Running App

To run the app type `npm start` in terminal.
To run app in *developer mode* type `npm run dev` in terminal (will run app using **nodemon**).


## Contributing

Thank you for your interest in contributing to this project. At this time, we are not accepting external contributions. This project is currently maintained by the core development team. If you have suggestions or find issues, please feel free to write about that to our email.

We appreciate your understanding and support.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
