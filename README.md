# merkletree-viz

> Merke tree visualization library, works with [merkletreejs](https://github.com/miguelmota/merkletreejs).

## Example

[https://lab.miguelmota.com/merkletree-viz](https://lab.miguelmota.com/merkletree-viz)

## Usage

```js
const leaves = ['a', 'b', 'c', 'd'].map(keccak256)
const tree = new MerkleTree(leaves, keccak256)
const viz = new MerkleTreeViz('#viz')
viz.renderTree(tree)
// viz.destroy()
```

<img src="https://user-images.githubusercontent.com/168240/201514143-52cc3627-d606-445d-94f3-e8d515f57b9e.png" width="500px" alt="viz" />

## License

[MIT](LICENSE)
