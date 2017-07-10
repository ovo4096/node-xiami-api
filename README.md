# node-xiami-api
Xiami music API for Node.js.

## Examples

```javascript
const { Album } = require('../src')

Album.search('十年').then((data) => {
  console.log(data)
}).catch((e) => {
  console.log(e)
})
```
