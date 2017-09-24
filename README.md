# graphql-sequelize-paginate

[![Greenkeeper badge](https://badges.greenkeeper.io/Qard/graphql-sequelize-paginate.svg)](https://greenkeeper.io/)

Paginated finder to sequelize which produces graphql connection pages.

## Install

```sh
npm install graphql-sequelize-paginate
```

## Usage

```js
const paginator = require('graphql-sequelize-paginate')
const find = paginator({
  model: SomeModelOrAssociation,
  min: 1,
  max: 10
})

function resolver(root, { first, last, before, after }) {
  return find({ first, last, before, after }, {
    where: {
      extra: 'stuff'
    }
  })
}
```

---

### Copyright (c) 2017 Stephen Belanger

#### Licensed under MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
