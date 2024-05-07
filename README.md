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

- Node.js
- Express.js
- PostgreSql
- dependencies
  - ajv: JSON Schema validator
  - ajv-errors: Additional error messages for Ajv
  - ajv-formats: Additional formats for Ajv
  - bcrypt: Library for hashing passwords
  - express: Web framework for Node.js
  - jsonwebtoken: Library for JSON Web Tokens
  - knex: SQL query builder for Node.js
  - objection: ORM for Node.js
  - passport: Authentication middleware for Node.js
  - passport-jwt: Passport strategy for authenticating with a JSON Web Token
  - pg: PostgreSQL client for Node.js

## Installation

1. Ensure you have Node.js installed on your machine.
2. Clone the repository to your local machine.
3. Run `npm install` to install all node modules and dependencies.
4. Copy _.env.example_ file and make it _.env_ to have your own _.env_ file and change all variables to valid data.
5. Make new database, or use existing empty one and change **database** field to your databae*name in \_knexfile.js*.
6. Access the application in your browser at `http://localhost:3000`.
7. To use email verification route you need to update you google account configs
   - Go to your _myaccount.google.com_ (manage your google account button under your profile picture).
   - Go to **Security**.
   - Select **2-Step Verification** and turn it on.
   - Scroll down and click on **App passwords** and create one (you will use it instead of your google account password).
   - Thats all you need, now come back to the code and use your **email addres** and **App password** in your .env

Go by this link if you want get more information [Google help centre](https://support.google.com/mail/answer/185833?hl=en).

If there are problems with installation, please inform us about it.

## Usage

- Create a new post: Make a POST request to `/posts` with the post content in the request body.
- Read a post: Make a GET request to `/posts/:id` to retrieve a specific post.
- Update a post: Make a PUT request to `/posts/:id` with the updated post content.
- Delete a post: Make a DELETE request to `/posts/:id` to remove a post.
- Leave a comment: Make a POST request to `/posts/:id/comments` with the comment content.

## Running App

To run the app type `npm start` in terminal.
To run app in _developer mode_ type `npm run dev` in terminal (will run app using **nodemon**).

## AWS Integration

To integrate with AWS S3 for file storage, follow these steps:

1. Register for an AWS account.
2. Navigate to the AWS Management Console and create a new S3 bucket. Specify the bucket name and enable ACLs. Click "Create bucket".
3. After creating the bucket, navigate to your account name on the right side and select the "Security credentials" section.
4. Scroll down to the "Access keys" section and click "Create access key".
5. Save the Access key and Secret access key (note that the Secret access key will only be visible once, so make sure to save it securely).
6. Update the appropriate variables in your _.env_ file with the following information:
   - AWS Region
   - AWS_S3_BUCKET_NAME
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY

Make sure to install the required packages for AWS integration using npm:

```bash
npm install aws-sdk multer multer-s3 

## Contributing

Thank you for your interest in contributing to this project. At this time, we are not accepting external contributions. This project is currently maintained by the core development team. If you have suggestions or find issues, please feel free to write about that to our email.

We appreciate your understanding and support.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
