<h1 align="center">Gumball UI</h1>

<p align="center">A modern CSS Framework with a simplistic style. Includes a few JavaScript modules for interactivity which can all be set up with just HTML5 data attributes such as dropdown menus.</p>

[![Dependency Status](https://david-dm.org/jl-welch/gumball/dev-status.svg)](https://david-dm.org/jl-welch/gumball?type=dev)
[![CSS gzip size](http://img.badgesize.io/jl-welch/gumball/master/dist/stylesheets/gumball.min.css?compression=gzip&label=CSS+gzip+size)](https://github.com/jl-welch/gumball/blob/master/dist/stylesheets/gumball.min.css)
[![JS gzip size](http://img.badgesize.io/jl-welch/gumball/master/dist/javascripts/gumball.min.js?compression=gzip&label=JS+gzip+size)](https://github.com/jl-welch/gumball/blob/master/dist/javascripts/gumball.min.js)

## Base

Base files contain variables, mixins, functions and normalized styles.

## Components

Components take on a type of BEM approach using double underscore for elements and double hyphen for modifiers.

Usually, components do not contain margins as we want them to fit anywhere when placed on the page. Use spacing helpers where needed for margins etc.

## Helpers

Helper classes to help with page layout, spacing and other useful stuff, great for customizing components.

## Layout

Layout classes are for grids and containers.

## Installation

```shell
$ git clone git@github.com:jl-welch/gumball.git
$ cd gumball
$ npm install
```

## Contributing

Fork & clone the project. Make sure to have [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) extensions installed for your code editor.

Check the package.json file for a list of local development npm scripts.

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Browser support

- IE 10+

## Note on development:

Currently in the process of finishing off documentation with Hugo.

## License

[MIT License](https://github.com/jl-welch/gumball/blob/master/LICENSE)
