
// http://bl.ocks.org/mbostock/1138500
const makeGraph = function (target, graphData) {
  var target = d3.select(target)
  const bounds = target.node().getBoundingClientRect()
  const fill = d3.scale.category20()
  const radius = 25

  const svg = target.append('svg')
    .attr('width', bounds.width)
    .attr('height', bounds.height)

  // Arrow marker for end-of-line arrow
  svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('refX', 17.5)
    .attr('refY', 2)
    .attr('markerWidth', 8)
    .attr('markerHeight', 4)
    .attr('orient', 'auto')
    .attr('fill', '#999')
    .append('path')
    .attr('d', 'M 0,0 V 4 L6,2 Z')

  const link = svg.selectAll('line')
    .data(graphData.links)
    .enter()
    .append('line')
    .attr('class', 'link')
    .attr('marker-end', 'url(#arrowhead)')

  // Create a group for each node
  const node = svg.selectAll('g')
    .data(graphData.nodes)
    .enter()
    .append('g')

  // Color the node based on node's git-type (otherwise, hot pink!)
  node.append('circle')
    .attr('r', radius)
    .attr('class', 'node')
    .attr('fill', function (d) {
      const blue = '#1BA1E2'
      const red = 'tomato'
      const green = '#5BB75B'
      const pink = '#FE57A1'

      if (d.name.endsWith('.b')) { return red }
      if (d.name.endsWith('.t')) { return blue }
      if (d.name.endsWith('.c')) { return green }
      return pink
    })

  node.append('text')
    .attr('y', radius * 1.5)
    .attr('text-anchor', 'middle')
    .attr('fill', '#555')
    .text(function (d) {
      if (d.name.length > 10) {
        return d.name.substring(0, 8) + '...'
      }

      return d.name
    })

  // If the node has a type: tag it
  node.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', 4)
    .attr('fill', 'white')
    .attr('class', 'bold-text')
    .text(function (d) {
      if (d.name.endsWith('.b')) { return 'BLOB' }
      if (d.name.endsWith('.t')) { return 'TREE' }
      if (d.name.endsWith('.c')) { return 'COMMIT' }
      return ''
    })

  const charge = 700 * graphData.nodes.length

  const force = d3.layout.force()
    .size([bounds.width, bounds.height])
    .nodes(graphData.nodes)
    .links(graphData.links)
    .linkDistance(350)
    .charge(-(charge))
    .gravity(1)
    .on('tick', tick)

  // No fancy animation, tick amount varies based on number of nodes
  force.start()
  for (let i = 0; i < graphData.nodes.length * 100; ++i) force.tick()
  force.stop()

  function tick (e) {
    // Push sources up and targets down to form a weak tree.
    const k = 12 * e.alpha

    /*
        link
            .each(function(d) { d.source.y -= k, d.target.y += k; })
                .attr('x2', function(d) { return d.source.x; })
                .attr('y2', function(d) { return d.source.y; })
                .attr('x1', function(d) { return d.target.x; })
                .attr('y1', function(d) { return d.target.y; });
                */
    link
      .each(function (d) { d.source.y -= k, d.target.y += k })
      .attr('x1', function (d) { return d.source.x })
      .attr('y1', function (d) { return d.source.y })
      .attr('x2', function (d) { return d.target.x })
      .attr('y2', function (d) { return d.target.y })

    /*
    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
        */

    node
      .attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
  }
}

const forceFormat = function (dag) {
  const orderedNodes = []
  const nodes = []
  const links = []
  let usesPack = false

  // Basically a dumb Object.keys
  for (node in dag) {
    if (!dag.hasOwnProperty(node)) continue
    orderedNodes.push(node)
  }

  orderedNodes.forEach(function (node) {
    const sources = dag[node]

    if (!sources) return

    sources.forEach(function (source) {
      var source = orderedNodes.indexOf(source)

      // If the source isn't in the Git DAG, it's in a packfile
      if (source < 0) {
        if (usesPack) return
        source = orderedNodes.length
        usesPack = true
      }

      links.push({
        source: source,
        target: orderedNodes.indexOf(node)
      })
    })
    nodes.push({ name: node })
  })

  // Add pack file to end of list
  if (usesPack) nodes.push({ name: 'PACK' })

  return { nodes: nodes, links: links }
}

const gitDag = {
  // blob (add .b for blob)
  '1b9f426a8407ffee551ad2993c5d7d3780296353.b': [],
  // tree (.t == tree) is a hash that includes the hash from blob
  '098e6de29daf4e55f83406b49f5768df9bc7d624.t': ['1b9f426a8407ffee551ad2993c5d7d3780296353.b'],
  // commit (.c == commit) is a hash that includes the hash from tree
  '1a06ce381ac14f7a5baa1670691c2ff8a73aa6da.c': ['098e6de29daf4e55f83406b49f5768df9bc7d624.t']
}

makeGraph('.canvas', forceFormat(gitDag))
