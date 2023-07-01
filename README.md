# NestJS Starter App

This is a dockerized NestJS starter app with authentication built-in.

## Table of Contents

- [Features](#features)
- [Concepts Employed](#concepts-employed)
- [Built With](#built-with)
- [Required Installations](#required-installations)
- [Installation](#installation)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

<!-- features -->

## Features

- Authentication using [passport](https://docs.nestjs.com/recipes/passport) local (email and password) and JWT strategies with <b>cookies</b>.
- Validation with [class-validator](https://www.npmjs.com/package/class-validator)
- Unit and integration tests ([jest](https://jestjs.io/) and [supertest](https://www.npmjs.com/package/supertest))
- Containerization with docker compose.
- ActiveRecord data modelling with [TypeORM](https://typeorm.io/)

<!-- concepts employed -->

## Concepts Employed

- Typescript - interfaces, generics and type definitions
- Nest Guards
- Nest pipes
- Nest interceptors
- Nest exception filters
- Containerization - Docker

<!-- BUILT WITH -->

## Built With

- NestJs
- Postgres
- TypeORM
- PassportJS
- Docker

<!-- REQUIRED INSTALLATION -->

## REQUIRED INSTALLATIONS

- Node
- Docker desktop

<!-- INSTALLATION -->

## Installation

Once you have installed the requiered packages shown on the [Required Installations](#required-installations), proceed with the following steps

`Ensure you have docker desktop installed and running`

Clone the Repository,

```Shell
your@pc:~$ git clone https://github.com/frankly034/nestjs-starter.git
```

Move to the downloaded folder

```Shell
your@pc:~$ cd nestjs-starter
```

Run with docker-compose

```Shell
your@pc:~$ docker-compose up
```

<!-- FUTURE IMPROVEMENTS -->

## Future Improvements

- Add SSO

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

- 🇳🇬 Lewis Ugege - franklynugege@gmail.com | [Github Account](https://github.com/frankly034) | [Twitter](https://twitter.com/@wizlulu) | [Linkedin](https://linkedin.com/in/lewis-ugege) |

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- <a href="https://nestjs.com/">NestJS</a>
- <a href="https://wanago.io/courses/api-with-nestjs/">Marcin Wanago</a>
