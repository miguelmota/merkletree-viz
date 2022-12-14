# merkletree-viz

> Merke tree visualization library for browser, works with [`merkletreejs`](https://github.com/miguelmota/merkletreejs).

## Example

[https://lab.miguelmota.com/merkletree-viz](https://lab.miguelmota.com/merkletree-viz)

### CDN

Available on [jsDelivr](https://www.jsdelivr.com/) CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/merkletree-viz@latest/merkletreeviz.js"></script>
```

## Usage

Import js libs for hash function, merkletreejs, and merkletree-viz

```html
<script src="https://cdn.jsdelivr.net/npm/keccak256@latest/keccak256.js"></script>
<script src="https://cdn.jsdelivr.net/npm/merkletreejs@latest/merkletree.js"></script>
<script src="https://cdn.jsdelivr.net/npm/merkletree-viz@latest/merkletreeviz.js"></script>
```

Generate merkle tree and render visualization

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
