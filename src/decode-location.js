/**
 * The decoding method is implemented by https://github.com/Flowerowl/xiami/blob/master/xiami.php
 */

module.exports = (location) => {
  let loc2 = parseInt(location.substr(0, 1))
  let loc3 = location.substr(1)
  let loc4 = Math.floor(loc3.length / loc2)
  let loc5 = loc3.length % loc2
  let loc6 = []
  let loc7 = 0
  let loc8 = ''
  let loc9 = ''
  let loc10 = ''
  while (loc7 < loc5) {
    loc6[loc7] = loc3.substr((loc4 + 1) * loc7, loc4 + 1)
    loc7++
  }
  loc7 = loc5
  while (loc7 < loc2) {
    loc6[loc7] = loc3.substr(loc4 * (loc7 - loc5) + (loc4 + 1) * loc5, loc4)
    loc7++
  }
  loc7 = 0
  while (loc7 < loc6[0].length) {
    loc10 = 0
    while (loc10 < loc6.length) {
      loc8 += loc6[loc10][loc7] !== undefined ? loc6[loc10][loc7] : ''
      loc10++
    }
    loc7++
  }

  loc9 = decodeURIComponent(loc8).replace(/\^/g, '0')
  return loc9
}
