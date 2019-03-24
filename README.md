<h1 align="center"><p>twitch-get-events</p></h1>
<center>

  [![Build Status](https://travis-ci.org/Lund-Org/twitch-get-events.svg?branch=master)](https://travis-ci.org/Lund-Org/twitch-get-events)
  [![Npm version](https://img.shields.io/npm/v/@lund-org/twitch-events.svg)](https://www.npmjs.com/package/@lund-org/twitch-events)
  [![Dependencies](https://img.shields.io/david/lund-org/twitch-get-events.svg)](https://github.com/lund-org/twitch-get-events/blob/master/package.json)
  [![Coverage](https://api.codeclimate.com/v1/badges/ae1f2d4ef820b5797908/test_coverage)](https://codeclimate.com/github/Lund-Org/twitch-get-events/test_coverage)
  [![Maintainability](https://api.codeclimate.com/v1/badges/ae1f2d4ef820b5797908/maintainability)](https://codeclimate.com/github/Lund-Org/twitch-get-events/maintainability)

</center>

The module to get the events of a Twitch channel ('cause there is no doc for it)

## :fast_forward: Getting Started

Install with npm :

      npm install --save @lund-org/twitch-events

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

[Link to the documentation](https://lund-org.github.io/twitch-get-events/index.html)

You can find an example of http integration in the static folder.	
It's also what is launched when you test the module.

### :new: Prerequisites

If you have **Docker**, you don't need anything on your computer.
If you don't have Docker, you need `node >= 9` and `npm >= 6`.

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

For Node/Npm users :

      npm install

      npm run test

## :arrow_up: Deployment

The package is build by Travis and is available [here](https://www.npmjs.com/package/@lund-org/twitch-events)

## :wrench: Environment variables

The environment variables are only used from tests.

- `TWITCH_USERNAME`: Represent a twitch username who has provided incoming events.
- `TWITCH_USERNAME_EMPTY`: Represent a twitch username who has never provided any event.  
- `TWITCH_USERNAME_NOT_FOUND`: Represent a twitch username who's not found.

## :arrow_heading_down: Built With

* [Twith GQL API](https://dev.twitch.tv/) - The twitch dev portal

## :cool: Contributing

Contact us to know how to contribute.

## :1234: Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Lund-Org/twitch-get-events/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
