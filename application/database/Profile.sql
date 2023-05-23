CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE,
  full_name VARCHAR(100),
  date_of_birth DATE,
  address VARCHAR(200),
  phone_number VARCHAR(20),
  bio TEXT,
  profile_image_url VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);