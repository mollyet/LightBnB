const properties = require("./json/properties.json");
const users = require("./json/users.json");

//connects to lightbnb database

const { Pool } = require("pg");
const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(
      `SELECT * FROM users
    WHERE email = $1`,
      [email]
    )
    .then((res) => {
      // console.log(res.rows)
      if (res.rows.length === 0){
        return null;
      }
      return res.rows[0]
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(
      `SELECT * FROM users
    WHERE id = $1`,
      [id]
    )
    .then((res) => {
      // console.log(res.rows)
      if (res.rows.length === 0){
        return null;
      }
      return res.rows[0]
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool 
  .query(
    `INSERT INTO users(name, email, password) VALUES $1 $2 $3 
    RETURING *;`,
    [user.name, user.email, user.password]
  )
  .then((res) => res.rows)
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id) {
  return pool
  .query(
    `SELECT properties.*, reservations.*, avg(rating) as rating  
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    AND reservations.end_date < now()::date
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date 
    LIMIT 10;`,
    [guest_id]
  )
  .then((res) => res.rows)
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  
  if(options.owner_id){
    queryParams.push(`%${options.owner_id}`)
    queryString += `AND owner_id $${queryParams.length} `;
  }
  
  if(options.minimum_price_per_night){
    queryParams.push(`%${options.minimum_price_per_night}`)
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }
  
  if(options.maximum_price_per_night){
    queryParams.push(`%${options.maximum_price_per_night}`)
    queryString += `AND cost_per_night =< $${queryParams.length} `;
  }
  
  if(options.minimum_rating){
    queryParams.push(`%${options.minimum_rating}`)
    queryString += `AND property_reviews.rating >= $${queryParams.length} `;

  }
  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
 
  let queryString = `
  INSERT INTO properties(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, number_of_bedrooms, number_of_bathrooms, parking_spaces, country, province, city, street, post_code) 
  VALUES $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14 
  RETURNING *;
  `;
  
  const input = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.number_of_bedrooms,
    property.number_of_bathrooms,
    property.parking_spaces,
    property.country,
    property.province,
    property.city,
    property.street,
    property.post_code
  ];
  return pool.query(queryString, input)
  .then((res) => res.rows[0])
};

exports.addProperty = addProperty;
