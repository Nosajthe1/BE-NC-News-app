## You'll need to make sure you connect the two databases (development and test). To do this you will need to create individual .env files using the .env-example as a template. 

You will have to require the .env.test and .env.development files to be able to connect to the specific databases you need. 
You will require a .env.test and a .env.development file to be able to connect to the appropriate database.

You will need to create two .env files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these .env files are .gitignored. 


This project serves as a backend for the NC News website. The server allows for creating, reading, updating and deleting articles, comments and votes from the database.

The server is implemented in Node.js, using express as the framework. The database used is PostgreSql.

A hosted version of this server can be seen here:

https://be-nc-news-je123.herokuapp.com/api
Prerequisites
Ensure you have node.js installed. To check if node.js is installed, in the terminal run

node -v
If no version is printed to the console, install node.js by visiting:

https://nodejs.org/en/download/
Ensure you have PostgreSQL installed. To check if PostgreSQL is installed, in the terminal run

which psql
If a file path is not printed to the console, install PostgreSQL by visiting:

https://www.postgresql.org/download/
Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

Installing
To use this server locally:

Clone the repo:
git clone https://github.com/Nosajthe1/BE-NC-News-app.git
Install NPM packages:
npm install
Create .env files:
touch .env.test && touch .env.development
Paste into .env.test:
PGDATABASE=nc_news_test
Paste into .env.development:
PGDATABASE=nc_news
Run the server locally with:
node app.js
Endpoints
To view all available endpoints visit

localhost:port_number/api
By default this is

localhost:9090/api
Running the tests
To run the tests

npm test
The tests cover:

GET requests for: topics, articles, article by its ID, users, comments for an article.
POST requests for: Comments.
DELETE requests for: Comments.
PATCH requests for: Article votes.
Sort querys for: Articles.
Error handling for all of the above.
Deployment
Due to heroku ending its free tiers I recommend you use render to deploy this server on a live system:

https://render.com/
A clear guide on how to do his can be found here

https://www.freecodecamp.org/news/how-to-deploy-nodejs-application-with-render/
Built With
cors: 2.8.5
dotenv: 16.0.0
express: 4.18.1
pg: 8.7.3
pg-format: 1.0.4
husky: 7.0.0
jest: 27.5.1
jest-extended: 2.0.0
jest-sorted: 1.0.14
supertest: 6.2.4
