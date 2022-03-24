# Funcionalidad

- Endpoints:
  - Registration. Required: username, password.
  - Login.
  - Logout.
  - Create film. Required fields: title (unique), release date, synopsis.
  - Get paginated title list with an optional filter by title.
  - Get a film detail.
  - Update a film (restricted to its creator).
  - Delete a film (restricted to its creator).
  - Add/Remove stored films to/from user favourites.
  - Store data in a database of your choice
- Username and password minimum validations (like minimum length, …)
- Authentication via JWT token
- Proper Error handling
- Logging system
- Deployment via Docker
- Unit and integration tests.

# Solution description.

I have created a graphql server, in my opinion it offers many advantages over an API, such as documentation, a typed system, and a dashboard where you can test and see the available endpoints. I have developed the application with typescript, I think it provides greater code clarity and is more scalable.

- ## Technologies
  - [express: ](https://expressjs.com/es/4x/api.html) To create and start my server.
  - [graphql: ](https://graphql.org/) To provide a complete and understandable description of the data in my API.
  - [apollo: ](https://www.apollographql.com/) To build and manage graphql.
  - [type-graphql: ](https://typegraphql.com/) To manage graphql configuration.
  - [class-validator: ](https://github.com/typestack/class-validator) To manage params which arrive to graphql.
  - [moleculer: ](https://moleculer.services/) To create services.
  - [protobufjs: ](https://www.npmjs.com/package/protobufjs) Used as serializer in moleculer.
  - [jsonwebtoken: ](https://jwt.io/) To create a valid token and authenticate to users.
  - [bunyan: ](https://github.com/trentm/node-bunyan) To create a system of records that can be saved to a database, for example elasticsearch.
  - [pg: ](https://www.postgresql.org/) To save data.
  - [bcrypt: ](https://www.npmjs.com/package/bcrypt) To encrypt passwords.
  - [typeorm: ](https://typeorm.io/) To control my database from the server.

# To start project

```sh
  git clone https://github.com/gionaico/movies.git

  cd movies

  yarn install

  mkdir ./deploy/docker/app/db/data-postgres ./deploy/docker/app/db/pgadmin

  yarn run build

  cd deploy/docker/app

  docker-compose up -d


```

[Open in your browser](http://localhost:5065/graphql).

To use the app you need to register and then login.

```js

  // REGISTER
  mutation{
    register(data:{username:"username", password:"123456789Aa-"}){
      username
    }
  }

  // LOGIN
  mutation{
    login(data:{username:"username", password:"123456789Aa-"})
  }
```

Login return a token which you have to use it in each request.

Example Mutation

```js

  mutation{
    createMovie(data:{title:"matrix", synopsis:"pelicula futurista auq hay que ver.", release_date:"2021"}){
      title
      synopsis
    }
  }


  {
    "Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwiaWF0IjoxNjQ3MjgyNDQxLCJleHAiOjE2NDcyODYwNDF9.hqPJeBSLACK1t_KWclSUAOpwfJHvuWBNAHJlVmkpxec"
  }
```

[Example with picture](./src/public/gqlMovies.png) at the left you can see the SCHEMA and DOCS.

If you want to check the postgres db use [Dbeaver](https://dbeaver.io/) or open in your [browser pgadmin](http://localhost:5066)
```sh
  # pgadmin
  user: email@email.com
  password: 987654321Aa-
  # Dbeaver
  host: localhost
  port: 5670
  user: postgres
  password: 123456789Aa-
```