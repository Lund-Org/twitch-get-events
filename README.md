# TwitchGetEvents
[![Build Status](https://travis-ci.org/Lund-Org/twitch-get-events.svg?branch=master)](https://travis-ci.org/Lund-Org/twitch-get-events)

The module to get the events of a Twitch channel ('cause there is no doc for it)

## :fast_forward: Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

[Link to the documentation](https://lund-org.github.io/twitch-get-events/index.html)

You can find an example of http integration in the static folder.
It's also what is launched when you test the module.

### :new: Prerequisites

If you have **Docker**, you don't need anything on your computer.
If you don't have Docker, you need `node >= 9` and `npm >= 6`

- [Docker](https://www.docker.com/)
- [Node & npm](https://nodejs.org/en/)

You need a "client-id" from twitch too. To achieve it, you need to create an application [here](https://glass.twitch.tv/console/apps), then when you want to manage it, you will find a client identifier.

### :arrow_forward: Installing

For Docker users :

      # If you're an Unix user and you have npm
      npm run docker

      # If you're an Unix user and you don't have npm
      docker-compose -f etc/docker/docker-compose.yml up --build dev

      # If you're a Windows user and you have npm
      npm run windocker

      # If you're a Windows user and you don't have npm
      docker-compose.exe -f etc/docker/docker-compose.yml up --build dev

For Node/Npm users :

      npm install
      npm run dev


## :arrows_counterclockwise: Running the tests

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

      npm run test

## :arrow_up: Deployment

The package is build by Travis and is available [here](https://www.npmjs.com/package/@lund-org/twitch-events)

## :arrow_heading_down: Built With

* [Hapi](https://github.com/hapijs/hapi) (for demo purpose) - Server Framework for Node.js
* [Twith GQL API](https://dev.twitch.tv/) - The twitch dev portal

## :cool: Contributing

Contact us to know how to contribute.

## :1234: Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
