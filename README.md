## You'll need to make sure you connect the two databases (development and test). To do this you will need to create individual .env files using the .env-example as a template. 

You will have to require the .env.test and .env.development files to be able to connect to the specific databases you need. 
You will require a .env.test and a .env.development file to be able to connect to the appropriate database.

You will need to create two .env files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these .env files are .gitignored. 



