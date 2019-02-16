# plasma-burner
`plasma-burner` is a wallet interface to any PG plasma chain.

## Getting Started
The easiest way to try out `plasma-burner` is by heading to https://burner.plasma.group.

## Contributing
Welcome! If you're looking to contribute to `plasma-burner`, you're in the right place.

### Contributing Guide and CoC
Plasma Group follows a [Contributing Guide and Code of Conduct](https://github.com/plasma-group/plasma-burner/blob/master/.github/CONTRIBUTING.md) adapted slightly from the [Contributor Covenant](https://www.contributor-covenant.org/version/1/4/code-of-conduct.html).
All contributors are expected to read through this guide.
We're here to cultivate a welcoming and inclusive contributing environment, and every new contributor needs to do their part to uphold our community standards.

### Requirements and Setup
#### Cloning the Repo
Before you start working on `plasma-burner`, you'll need to clone our GitHub repository:

```
git clone git@github.com:plasma-group/plasma-burner.git
```

Now, enter the repository.

```
cd plasma-burner
```

#### Node.js
`plasma-burner` is tested and built with [`Node.js`](https://nodejs.org/en/).
Although you **do not need `Node.js` to use this library in your application**, you'll need to install `Node.js` (and its corresponding package manager, `npm`) for your system before **contributing**.

We've provided a [detailed explanation of now to install `Node.js`](https://plasma-core.readthedocs.io/en/latest/reference.html#installing-node-js) on Windows, Mac, and Linux.

#### Packages
`plasma-burner` makes use of several `npm` packages.

Install all required packages with:

```
npm install
```

### Serving Locally
`plasma-burner` is a [Vue.js](https://vuejs.org/) project.

You can serve the project locally by running:

```
npm run serve
```

### Building
`Vue.js` provides a simple way to build `plasma-burner` for in-browser usage.

If you'd like to build `plasma-burner` yourself, simply run:

```
npm run build
```
