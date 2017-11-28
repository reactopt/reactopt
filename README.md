# reactopt
[![npm version](https://badge.fury.io/js/reactopt.svg)](https://badge.fury.io/js/reactopt)

## About
An open-source, CLI React performance optimization tool.
** MODULE IS STILL IN DEVELOPMENT, NOT FULLY FUNCTIONAL YET **

## Install and Use
npm install
```bash
npm install --save-dev reactopt
```

Include this code at the top of your main React component file:
```js
import { reactopt } from 'reactopt';
reactopt(React);
```

Include this script in your package.json:
```js
"reactopt": "node node_modules/reactopt/main.js"
```

Run command
```bash
npm run reactopt {url of running application (local or remote), no brackets}
```

## Team
This module was created by Candace Rogers, Pam Lam, Vu Phung and Selina Zawacki.


## Credit
Utilizes a modified version of ([why-did-you-update by maicki](https://github.com/maicki/why-did-you-update))
