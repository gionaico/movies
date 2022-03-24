CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    date DATE default(CURRENT_DATE)
);


CREATE TABLE IF NOT EXISTS Movie (
    title VARCHAR NOT NULL PRIMARY KEY,
    date DATE default(CURRENT_DATE),
    release_date DATE NOT NULL,
    username VARCHAR NOT NULL,
    synopsis VARCHAR(255),
    CONSTRAINT fk_users
        FOREIGN KEY(username) 
        REFERENCES users(username)
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS FavouriteMovies (
    id INT GENERATED ALWAYS AS IDENTITY,
    username VARCHAR NOT NULL,
    movie VARCHAR NOT NULL,
    date DATE default(CURRENT_DATE),
    CONSTRAINT fk_users
        FOREIGN KEY(username) 
        REFERENCES users(username)
        ON DELETE CASCADE,
    CONSTRAINT fk_movie
        FOREIGN KEY(movie) 
        REFERENCES movie(title)
        ON DELETE CASCADE
);