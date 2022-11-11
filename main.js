const layers = {
  '2a3eb5e4fd7ca38eebd660d4b9879fd3e235cd240772bccdfadfa6c1529b4711': {
    '568ff5eb286f51b8a3e8de4e53aa8daed44594a246deebbde119ea2eb27acd6b': {
      '9e031569905bf7098e9e3b14d5c8e2ed05f6e8dc1acaaad6a221cd6603e01d3b': {
        '0b4aa17bff8fc189efb37609ac5ea9fca0df4c834a6fbac74b24c8119c40fef2': {
          '044852b2a670ade5407e78fb2863c51de9fcb96542a07186fe3aeda6bb8a116d': null,
          c89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6: null
        },
        '27c2feed9df4c4903bfc9f1bda886662bebc8ba175ccdb3d1da20ce3a32441ba': {
          ad7c5bef027816a800da1736444fb58a807ef4c9603b7848673f7e3a68eb14a5: null,
          '2a80e1ef1d7842f27f2e6be0972bb708b9a135c38860dbe73c27c3486c34f4de': null
        }
      },
      '519d76fbbd63a3ac72cdfee0c0e650d76e933ef34227d72ef272a397ee3ce5ba': {
        f72583988683f14adebd6eed8914c8b5a29217104a476f4b87d6e3716def3116: {
          '13600b294191fc92924bb3ce4b969c1e7e2bab8f4c93c3fc6d0a51733df3c060': null,
          ceebf77a833b30520287ddd9478ff51abbdffa30aa90a8d655dba0e8a79ce0c1: null
        },
        ecda27ba4c1455eea6585eefd811915fe9de3a6f7dc8f347be2a851794339f38: {
          e455bf8ea6e7463a1046a0b52804526e119b4bf5136279614e0b1e8e296a4e2d: null,
          '52f1a9b320cab38e5da8a8f97989383aab0a49165fc91c737310e4f7e9821021': null
        }
      }
    },
    '91a4447bed354cc655e39f47ac6668f26b8682db96d52a7f7b0f7d7682ba5a86': {
      '91a4447bed354cc655e39f47ac6668f26b8682db96d52a7f7b0f7d7682ba5a86': {
        '91a4447bed354cc655e39f47ac6668f26b8682db96d52a7f7b0f7d7682ba5a86': {
          e4b1702d9298fee62dfeccc57d322a463ad55ca201256d01f62b45b2e1c21c10: null,
          d2f8f61201b2b11a78d6e866abc9c3db2ae8631fa656bfe5cb53668255367afb: null
        }
      }
    }
  }
}

let treeData = {}
const color = d3.scaleOrdinal(d3.schemeCategory10)

function getKey (k) {
  return k.slice(0, 4) + '...' + k.slice(k.length - 4, k.length)
}

function check (key, layers, j) {
  const obj = {
    name: getKey(key),
    subname: '',
    fill: color(j)
  }
  j++
  if (layers[key]) {
    obj.children = []
    let i = 0
    for (const k in layers[key]) {
      obj.children.push({
        name: getKey(k),
        subname: '',
        fill: color()
      })
      if (layers[key][k]) {
        obj.children[i] = check(k, layers[key], j)
      }
      i++
    }
  }
  return obj
}

const j = 0
for (const key in layers) {
  obj = check(key, layers, j)
  treeData = obj
}

// Set the dimensions and margins of the diagram
const margin = { top: 40, right: 0, bottom: 0, left: 0 }
const width = 10000 - margin.left - margin.right
const height = 10000 - margin.top - margin.bottom

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg = d3.select('.canvas').append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' +
          margin.left + ',' + margin.top + ')')

let i = 0
const duration = 750
let root

// declares a tree layout and assigns the size
const treemap = d3.tree().size([height, width])

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function (d) { return d.children })
root.x0 = height / 2
root.y0 = 0

// Collapse after the second level
// root.children.forEach(collapse);

update(root)

// Collapse the node and all it's children
function collapse (d) {
  if (d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update (source) {
  // Assigns the x and y position for the nodes
  const treeData = treemap(root)

  // Compute the new tree layout.
  const nodes = treeData.descendants()
  const links = treeData.descendants().slice(1)

  // Normalize for fixed-depth.
  nodes.forEach(function (d) { d.y = d.depth * 180 })

  // ****************** Nodes section ***************************

  // Update the nodes...
  const node = svg.selectAll('g.node')
    .data(nodes, function (d) { return d.id || (d.id = ++i) })

  // Enter any new modes at the parent's previous position.
  const nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', function (d) {
      // BEFORE ....
      // return "translate(" + source.y0 + "," + source.x0 + ")";
      // AFTER ....
      return 'translate(' + source.x0 + ',' + source.y0 + ')'
    })
    .on('click', click)

  const rectHeight = 40; const rectWidth = 80

  nodeEnter.append('rect')
    .attr('class', 'node')
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .attr('x', 0)
    .attr('y', (rectHeight / 2) * -1)
    .attr('rx', '5')
    .style('fill', function (d) {
      return d.data.fill
    })

  // Add labels for the nodes
  nodeEnter.append('text')
    .attr('dy', '-.35em')
    .attr('x', function (d) {
      return 13
    })
    .attr('text-anchor', function (d) {
      return 'start'
    })
    .text(function (d) { return d.data.name })
    .append('tspan')
    .attr('dy', '1.75em')
    .attr('x', function (d) {
      return 13
    })
    .text(function (d) { return d.data.subname })

  // UPDATE
  const nodeUpdate = nodeEnter.merge(node)

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr('transform', function (d) {
      // BEFORE ....
      // return "translate(" + d.y + "," + d.x + ")";
      // AFTER ....
      return 'translate(' + d.x + ',' + d.y + ')'
    })

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 10)
    .style('fill', function (d) {
      return d._children ? 'lightsteelblue' : '#fff'
    })
    .attr('cursor', 'pointer')

  // Remove any exiting nodes
  const nodeExit = node.exit().transition()
    .duration(duration)
    .attr('transform', function (d) {
      // BEFORE ....
      // return "translate(" + source.y + "," + source.x + ")";
      // AFTER ....
      return 'translate(' + source.x + ',' + source.y + ')'
    })
    .remove()

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6)

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6)

  // ****************** links section ***************************

  // Update the links...
  const link = svg.selectAll('path.link')
    .data(links, function (d) { return d.id })

  // Enter any new links at the parent's previous position.
  const linkEnter = link.enter().insert('path', 'g')
    .attr('class', 'link')
    .attr('d', function (d) {
      const o = { x: source.x0, y: source.y0 }
      return diagonal(o, o)
    })

  // UPDATE
  const linkUpdate = linkEnter.merge(link)

  // Transition back to the parent element position
  linkUpdate.transition()
    .duration(duration)
    .attr('d', function (d) { return diagonal(d, d.parent) })

  // Remove any exiting links
  const linkExit = link.exit().transition()
    .duration(duration)
    .attr('d', function (d) {
      const o = { x: source.x, y: source.y }
      return diagonal(o, o)
    })
    .remove()

  // Store the old positions for transition.
  nodes.forEach(function (d) {
    d.x0 = d.x
    d.y0 = d.y
  })

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal (s, d) {
    // BEFORE ....
    // path = `M ${s.y} ${s.x}
    //        C ${(s.y + d.y) / 2} ${s.x},
    //          ${(s.y + d.y) / 2} ${d.x},
    //          ${d.y} ${d.x}`

    // AFTER ....
    path = `M ${s.x + (rectWidth / 2)} ${s.y}
            C ${(s.x + d.x) / 2 + (rectWidth / 2)} ${s.y},
              ${(s.x + d.x) / 2 + (rectWidth / 2)} ${d.y},
              ${d.x + (rectWidth / 2)} ${d.y}`

    return path
  }

  /*
var line = d3.svg.diagonal()
    .projection(function(d) {
      return [d.x + attrs.nodeWidth / 2, d.y + attrs.nodeHeight / 2];
    });
var diagonal = d => line(d).replace('C', 'L');
*/

  // Toggle children on click.
  function click (d) {
    if (d.children) {
      d._children = d.children
      d.children = null
    } else {
      d.children = d._children
      d._children = null
    }
    update(d)
  }
}
