<h1 align="center">Gumball UI</h1>

<p align="center">A modern CSS Framework with a minimal style by default. Includes a few JavaScript modules for interactivity which can all be used with just HTML5 data attributes.</p>

[![Dependency Status](https://david-dm.org/jl-welch/gumball/dev-status.svg)](https://david-dm.org/jl-welch/gumball?type=dev)
[![CSS gzip size](http://img.badgesize.io/jl-welch/gumball/master/dist/stylesheets/gumball.min.css?compression=gzip&label=CSS+gzip+size)](https://github.com/jl-welch/gumball/blob/master/dist/stylesheets/gumball.min.css)
[![JS gzip size](http://img.badgesize.io/jl-welch/gumball/master/dist/javascripts/gumball.min.js?compression=gzip&label=JS+gzip+size)](https://github.com/jl-welch/gumball/blob/master/dist/javascripts/gumball.min.js)

## BEM

The main components of gumball take on a type of BEM approach using double underscore for __elements and double hyphen for --modifiers.

Usually, components do not contain margins and we generally want all components to work no matter where on the page they are. Helper classes are included to .. help you with spacing, colours, positioning and so on.

## Clone

This projects uses ESLint for code-quality and Prettier for pretty formatting. It helps if you have these extensions installed for your code editor.

```shell
$ git clone git@github.com:jl-welch/gumball.git
$ cd gumball
$ npm install
```

## Browser support

- IE 10+

### Note on development:

Currently in the process of finishing off documentation with Hugo, improvements to the framework are still being made daily.

## License

[MIT License](https://github.com/jl-welch/gumball/blob/master/LICENSE)
