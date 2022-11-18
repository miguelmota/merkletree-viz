require('./vendor/treant.js')

class MerkleTreeViz {
  constructor (htmlSelector) {
    this.htmlSelector = htmlSelector
  }

  getLabel (hash) {
    return hash.slice(0, 4) + '…' + hash.slice(hash.length - 4, hash.length)
  }

  construct (key, layers, idx, depth, proof) {
    let className = 'parent-node'
    let isProof = proof && proof.includes('0x' + key)
    const isRoot = idx === 0
    if (isProof) {
      if (isRoot) {
        className = 'proof-root-node'
      } else {
        className = 'proof-parent-node'
      }
    } else if (isRoot) {
      className = 'root-node'
    }
    const obj = {
      text: {
        name: this.getLabel(key)
      },
      HTMLclass: className
    }
    idx++
    const isLeaf = idx === depth
    if (layers[key]) {
      obj.children = []
      let i = 0
      for (const k in layers[key]) {
        isProof = proof && proof.includes('0x' + k)
        className = 'parent-node'
        if (isProof) {
          if (isLeaf) {
            className = 'proof-leaf-node'
          } else {
            className = 'proof-parent-node'
          }
        } else if (isLeaf) {
          className = 'leaf-node'
        }
        obj.children.push({
          text: {
            name: this.getLabel(k)
          },
          HTMLclass: className
        })
        if (layers[key][k]) {
          obj.children[i] = this.construct(k, layers[key], idx, depth, proof)
        }
        i++
      }
    }
    return obj
  }

  renderTree (merkleTree) {
    this._insertStyles()
    this.tree = merkleTree
    const layers = merkleTree.getLayersAsObject()
    const depth = merkleTree.getDepth()
    return this.renderLayersAsObject(layers, depth)
  }

  renderLayersAsObject (layers, depth, proof) {
    let nodeTreeStructure = {}
    const idx = 0
    for (const key in layers) {
      nodeTreeStructure = this.construct(key, layers, idx, depth, proof)
    }

    const chartConfig = {
      chart: {
        container: this.htmlSelector,
        connectors: {
          type: 'step',
          style: {
            'stroke-width': 2
          }
        }
      },
      nodeStructure: nodeTreeStructure
    }

    const viz = new window.Treant(chartConfig)
    this.instance = viz
    return viz
  }

  destroy () {
    if (this.instance) {
      this.instance.destroy()
    }
  }

  _insertStyles () {
    const styles = document.createElement('style')
    styles.id = 'merkletreeviz-css'
    styles.innerText = `
      /* required lib styles */
      .Treant { position: relative; overflow: hidden; padding: 0 !important; }
      .Treant > .node,
      .Treant > .pseudo { position: absolute; display: block; visibility: hidden; }
      .Treant.Treant-loaded .node,
      .Treant.Treant-loaded .pseudo { visibility: visible; }
      .Treant > .pseudo { width: 0; height: 0; border: none; padding: 0; }
      .Treant .collapse-switch { width: 3px; height: 3px; display: block; border: 1px solid black; position: absolute; top: 1px; right: 1px; cursor: pointer; }
      .Treant .collapsed .collapse-switch { background-color: #868DEE; }
      .Treant > .node img {  border: none; float: left; }

      .node {
        border: 1px solid #000;
        padding: 0 1rem;
        font-family: monospace;
      }
      .node.root-node {
        background-color: #d4e7d3;
      }
      .node.proof-root-node {
        background-color: #d4e7d3;
        outline: 5px solid #FFFF00;
      }
      .node.parent-node {
        background-color: #dae8fc;
      }
      .node.proof-parent-node {
        background-color: #dae8fc;
        outline: 5px solid #FFFF00;
      }
      .node.leaf-node {
        background-color: #fee7d0;
      }
      .node.proof-leaf-node {
        background-color: #fee7d0;
        outline: 5px solid #FFFF00;
      }
    `
    if (!document.querySelector('#merkletreeviz-css')) {
      document.body.appendChild(styles)
    }
  }

  renderProof (proof) {
    if (!this.tree) {
      return
    }

    this._insertStyles()
    this.destroy()
    const layers = this.tree.getLayersAsObject()
    const depth = this.tree.getDepth()
    return this.renderLayersAsObject(layers, depth, proof)
  }
}

window.MerkleTreeViz = MerkleTreeViz
