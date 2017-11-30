<h1 align="center">
	<img width="600" src="https://cdn.rawgit.com/reactopt/reactopt/f25673ed/media/logo.png" alt="reactopt">
	<br>
	<br>
</h1>

# reactopt
[![npm version](https://badge.fury.io/js/reactopt.svg)](https://badge.fury.io/js/reactopt)

A CLI React performance optimization tool that identifies potential unnecessary re-rendering. 

# About
Reactopt identifies specific events that may be causing unnecessary re-rendering of components in your application, and which components may benefit from utilizing shouldComponentUpdate.

Prior to React 16, the module react-addons-perf helped identify locations that developers may want to implement shouldComponentUpdate to limit over-rendering. However, since the module is no longer supported we created Reactopt to fill the gap, and also provide increased functionality for any version of React.

Upon initiating Reactopt, your application will be launched in a browser for you to interact with. After you're finished and type 'done', you will see an audit on your application's component performance. 

1.5.0 is the first working verison of this module.

<p align="center"><img width="600" src="https://cdn.rawgit.com/reactopt/reactopt/2341c162/media/screenshot.png" alt="reactopt-screenshot"></p>

## Install and Use
npm install
```bash
npm install --save-dev reactopt
```

Include this code at the top of your main React component file (our module is meant to be used in [developement mode](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)):
```js
import React from 'react'

if (process.env.NODE_ENV !== 'production') {
	import { reactopt } from 'reactopt';
	reactopt(React);
}
```

Include this script in your package.json:
```js
"reactopt": "node node_modules/reactopt/main.js"
```

Run command
```bash
npm run reactopt localhost:####
```

## Team
This module was created by [Candace Rogers](https://github.com/candacerogue), [Pam Lam](https://github.com/itspamlam), [Vu Phung](https://github.com/Jin6Coding), [Selina Zawacki](https://github.com/szmoon)

## Contact
Like our app, found a bug?

Let us know! 

[reactopt@gmail.com](reactopt@gmail.com)

Visit us at www.reactopt.com

## Credit
Utilizes a modified version of ([why-did-you-update by maicki](https://github.com/maicki/why-did-you-update))
