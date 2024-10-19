# CRUD API
## Description
Implementation of a simple CRUD API using in-memory database underneath

## Entry notes
#### 🚀 Use ^22.x.x LTS version of Node.js (current used 22.9.0)

```bash
$ node --version
```

Otherwise, please install [Node.js](https://nodejs.org) for required version.

#### 🚀 Install dependencies

```bash
$ npm install
```


> **Note (before any further action):**
> - Rename `.env.sample` to `.env` – it contains application environmental variables.
> - By default, the PORT is set to **4000**
---

### 🚀 Scripts to run
#### 🚀 Build an application
```bash
# Build mode
$ npm run build
```
#### Run in `Development` mode
```bash
# Development mode
$ npm run start
```
#### Run in `Production` mode
```bash
# Production mode
$ npm run start:prod
```
#### Run tests
```bash
# Test mode
$npm run test
```

### CRUD & Endpoints

| methods | URL                                   |  
|:-------:|---------------------------------------|  
|   GET   | http://localhost:4000/api/users       |  
|   GET   | http://localhost:4000/api/users/{:id} |  
|  POST   | http://localhost:4000/api/users       |
|   PUT   | http://localhost:4000/api/users/{:id} |
| DELETE  | http://localhost:4000/api/users/{:id} |

---

## Technical requirements

- Task can be implemented on Javascript or Typescript
- Only
  - `nodemon`,
  - `dotenv`,
  - `cross-env`,
  - `typescript`,
  - `ts-node`, `ts-node-dev`,
  - `eslint` and its plugins,
  - `webpack-cli`, `webpack` and its plugins,
  - `prettier`,
  - `uuid`,
  - `@types/*` as well as libraries used for testing are allowed
- Prefer asynchronous API whenever possible

## Implementation details

1. Implemented endpoint api/users:
- **GET** `api/users` is used to **GET** all persons
  - Server should answer with `status code` **200** and all users records
- **GET** `api/users/{userId}`
  - Server should answer with `status code` **200** and record with `id === userId` if it exists
  - Server should answer with `status code` **400** and corresponding message if userId is invalid (not uuid)
  - Server should answer with `status code` **404
    ** and corresponding message if record with `id === userId` doesn't exist
- **POST** `api/users` is used to create record about new user and store it in database
  - Server should answer with `status code` **201** and newly created record
  - Server should answer with `status code` **400
    ** and corresponding message if request body does not contain required fields
- **PUT** `api/users/{userId}` is used to update existing user
  - Server should answer with `status code` **200** and updated record
  - Server should answer with `status code` **400** and corresponding message if userId is invalid (not `uuid`)
  - Server should answer with `status code` **404
    ** and corresponding message if record with `id === userId` doesn't exist
- **DELETE** `api/users/{userId}` is used to **DELETE** existing user from database
  - Server should answer with `status code` **204** if the record is found and **DELETE**d
  - Server should answer with `status code` **400** and corresponding message if userId is invalid (not `uuid`)
  - Server should answer with `status code` **404
    ** and corresponding message if record with `id === userId` doesn't exist
2. Users are stored as objects that have following properties:
- `id` — unique identifier (string, `uuid`) generated on server side
- `username` — user's name (string, required)
- `age` — user's age (number, required)
- `hobbies` — user's hobbies (array of strings or empty array, required)
3. Requests to non-existing endpoints (e.g. some-non/existing/resource) should be handled (server should answer with `status code`
   **404** and corresponding human-friendly message)
4. Errors on the server side that occur during the processing of a request should be handled and processed correctly (server should answer with `status code`
   **500** and corresponding human-friendly message)

> Please follow the url: `/api/users/error` to test this Term.

5. Value of port on which application is running should be stored in `.env` file

> Please do not forget to rename `.env.sample` to `.env`

6. There should be 2 modes of running application (development and production):
- The application is run in development mode using `nodemon` or ts-node-dev (there is a npm script start:dev)
- The application is run in production mode (there is a npm script start:prod that starts the build process and then runs the bundled file)
7. There could be some tests for API (not less than 3 scenarios). Example of test scenario:  
   i. **GET** all records with a **GET** api/users request (an empty array is expected)  
   ii. A new object is created by a **POST
   ** api/users request (a response containing newly created record is expected)  
   iii. With a **GET** api/user/{userId} request, we try to **GET
   ** the created record by its id (the created record is expected)  
   iv. We try to update the created record with a **PUT
   ** api/users/{userId}request (a response is expected containing an updated object with the same id)  
   v. With a **DELETE** api/users/{userId} request, we **DELETE
   ** the created object by id (confirmation of successful deletion is expected)  
   vi. With a **GET** api/users/{userId} request, we are trying to **GET** a **DELETE
   **d object by id (expected answer is that there is no such object)
8. There could be implemented horizontal scaling for application, there should be npm script start:multi that starts multiple instances of your application using the Node.js Cluster API (equal to the number of available parallelism - 1 on the host machine, each listening on port PORT + n) with a load balancer that distributes requests across them (using Round-robin algorithm). For example: available parallelism is 4, PORT is
   **4000**. Running:

```bash
$ npm run start:multi
```

it should work as follow:

- On `localhost:4000/api` load balancer is listening for requests
- On `localhost:4001/api`, `localhost:4002/api`, `localhost:4003/api` workers are listening for requests from load balancer
- When user sends request to `localhost:4000/api`, load balancer sends this request to `localhost:4001/api`, next user request is sent to `localhost:4002/api` and so on.
- After sending request to `localhost:4003/api` load balancer starts from the first worker again (sends request to `localhost:4001/api`)
- State of `db` should be consistent between different workers, for example:
  - First **POST** request addressed to `localhost:4001/api` creates user
  - Second **GET** request addressed to `localhost:4002/api` should return created user
  - Third **DELETE** request addressed to `localhost:4003/api` **DELETE**s created user
  - Fourth **GET** request addressed to `localhost:4001/api` should return `status code` **404** for created user

