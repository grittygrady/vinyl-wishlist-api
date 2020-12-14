module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
        process.env.REACT_APP_DATABASE_URL || 'postgresql://postgres@localhost/vinyl_wishlist',
    TEST_DATABASE_URL: 
        process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/vinyl_wishlist_test'
}