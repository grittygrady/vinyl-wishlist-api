# Vinyl Wishlist

Vinyl Wishlist is a simple app to help you remember what records you've been wanting to purchase. As a vinyl collector myself, I frequently find myself at the record store unable to remember the records I've been looking for.

This is the backend for `Vinyl Wishlist`.  A live version of the app can be found live at https://vinyl-wishlist.vercel.app/

The front end client can be found at https://github.com/grittygrady/vinyl-wishlist.

## Landing Page

<img src="https://github.com/grittygrady/vinyl-wishlist/blob/master/src/images/previews/landing.png">

## Technology

#### Back End

* Node and Express
  * Authentication via Express-Sessions
  * RESTful Api
* Testing
  * Supertest
  * Mocha and Chai
* Database
  * Postgres
  * Knex.js

#### Production

Deployed via Heroku

## Set up

Major dependencies for this repo include Postgres, Node, Knex and Express-Sessions.

To get setup locally, do the following:

1. Clone this repository to your machine, `cd` into the directory and run `npm install`
2. Create the dev and test databases: `createdb -U postgres -d vinyl_wishlist` and `createdb -U postgres -d vinyl_wishlist_test`

3. Create a `.env` file in the project root.

Inside this file you'll need the following:

````
NODE_ENV=development
PORT=8000
DATABASE_URL="postgresql://postgres@localhost/vinyl_wishlist"
TEST_DATABASE_URL="postgresql://postgres@localhost/vinyl_wishlist_test"

````

4. Run the migrations for dev - `npm run migrate`
5. Run the migrations for test - `NODE_ENV=test npm run migrate`
6. Seed the database for dev

* `psql -U <db-user> -d vinyl_wishlist -f ./seeds/seed.records.sql`

Now, run the command above again for the test database as well.

7. Run the tests - `npm t`
8. Start the app - `npm run dev`