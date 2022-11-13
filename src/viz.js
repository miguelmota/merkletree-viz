require('./vendor/treant.js')

class MerkleTreeViz {
  constructor (htmlSelector) {
    this.htmlSelector = htmlSelector
  }

  getLabel (hash) {
    return hash.slice(0, 4) + '…' + hash.slice(hash.length - 4, hash.length)
  }

  construct (key, layers, idx, depth) {
    const obj = {
      text: {
        name: this.getLabel(key)
      },
      HTMLclass: idx === 0 ? 'root-node' : 'parent-node'
    }
    idx++
    if (layers[key]) {
      obj.children = []
      let i = 0
      for (const k in layers[key]) {
        obj.children.push({
          text: {
            name: this.getLabel(k)
          },
          HTMLclass: idx === depth ? 'leaf-node' : 'parent-node'
        })
        if (layers[key][k]) {
          obj.children[i] = this.construct(k, layers[key], idx, depth)
        }
        i++
      }
    }
    return obj
  }

  renderTree (merkleTree) {
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
      .Treant > .node img {	border: none; float: left; }

      .node {
        border: 1px solid #000;
        padding: 0 1rem;
        font-family: monospace;
      }

      .node.root-node {
        background-color: #d4e7d3;
      }
      .node.parent-node {
        background-color: #dae8fc;
      }
      .node.leaf-node {
        background-color: #fee7d0;
      }
    `
    if (!document.querySelector('#merkletreeviz-css')) {
      document.body.appendChild(styles)
    }

    const layers = merkleTree.getLayersAsObject()
    const depth = merkleTree.getDepth()
    return this.renderLayersAsObject(layers, depth)
  }

  renderLayersAsObject (layers, depth) {
    let nodeTreeStructure = {}
    const idx = 0
    for (const key in layers) {
      nodeTreeStructure = this.construct(key, layers, idx, depth)
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
    return viz
  }
}

window.MerkleTreeViz = MerkleTreeViz
