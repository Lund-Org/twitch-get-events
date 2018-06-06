# TwitchGetEvents
The module to get the events of a Twitch channel ('cause there is no API for it)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

**[Documentation link missing]**

You can find an example of http integration in the static folder.
It's also what is launched when you test the module.

### Prerequisites

If you have **Docker**, you don't need anything on your computer.
If you don't have Docker, you need `node >= 9` and `npm >= 6`

- [Docker](https://www.docker.com/)
- [Node & npm](https://nodejs.org/en/)

### Installing

For Docker users :

      # If you're an Unix user and you have npm
      npm run docker

      # If you're an Unix user and you don't have npm
      docker-compose -f etc/docker/docker-compose.yml up --build dev

      # If you're a Windows user and you have npm
      npm run windocker

      # If you're a Windows user and you don't have npm
      docker-compose.exe -f etc/docker/docker-compose.yml up --build dev

**[NOT TESTED YET]** For Node/Npm users :

      npm install
      npm start dev

## Running the tests

For Docker users :

      # If you're an Unix user and you have npm
      npm run dockertest

      # If you're an Unix user and you don't have npm
      docker-compose -f etc/docker/docker-compose.yml up --build test

      # If you're a Windows user and you have npm
      npm run windockertest

      # If you're a Windows user and you don't have npm
      docker-compose.exe -f etc/docker/docker-compose.yml up --build test

For Node/Npm users :

      npm start test

## Deployment

The package will be available on npm, need a link

## Built With

* [Puppeteer](https://github.com/GoogleChrome/puppeteer) - Headless Chrome Node API
* [Hapi](https://github.com/hapijs/hapi) (for demo purpose) - Server Framework for Node.js

## Contributing

Contact us to know how to contribute.
**[Mail address or link missing]**

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
