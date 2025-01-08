# ClueHunter.js

Find the exact evidence paragraph from the web page with full-local model.

# Installation

# Dev setups

I choose to follow the instructions from [this blod](https://velog.io/@surim014/Best-practice-for-creating-a-modern-npm-package).

Need up to node.js 18.

### Install dependencies

`npm install`

### Build

`npm run build`

### Publish

```bash
npm version <major|minor|patch>
npm publish
```

### Test

`npm test`

### Build and test

First build

`npm run build`

Then link the library

`npm link`

After that, run the link of library again at the root folder and the test folder.

```
npm link @rice-bobb/cluehunter
cd tests
npm link @rice-bobb/cluehunter
```

And run test!

```
npm test
```
