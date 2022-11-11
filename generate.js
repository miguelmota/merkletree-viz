const keccak256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')
const rawLeaves = []
for (let i = 0; i < 10; i++) {
  rawLeaves.push(`${i}`)
}
const leaves = rawLeaves.map(keccak256)
const tree = new MerkleTree(leaves, keccak256)
const obj = tree.getLayersAsObject()
console.log(JSON.stringify(obj, null, 2))
