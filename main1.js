
// https://bl.ocks.org/mbostock/1138500

const width = 960
const height = 500
const radius = 6

const fill = d3.scale.category20()

const force = d3.layout.force()
  .charge(-120)
  .linkDistance(30)
  .size([width, height])

const svg = d3.select('.canvas').append('svg')
  .attr('width', width)
  .attr('height', height)

const json = {
  nodes: [
    { name: 'd3' },
    { name: 'd3.svg' },
    { name: 'd3.svg.area' },
    { name: 'd3.svg.line' },
    { name: 'd3.scale' },
    { name: 'd3.scale.linear' },
    { name: 'd3.scale.ordinal' }
  ],
  links: [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 1, target: 3 },
    { source: 0, target: 4 },
    { source: 4, target: 5 },
    { source: 4, target: 6 }
  ]
}

// d3.json("graph.json", function(error, json) {
// if (error) throw error;

const link = svg.selectAll('line')
  .data(json.links)
  .enter().append('line')

const node = svg.selectAll('circle')
  .data(json.nodes)
  .enter().append('circle')
  .attr('r', radius - 0.75)
  .style('fill', function (d) { return fill(d.group) })
  .style('stroke', function (d) { return d3.rgb(fill(d.group)).darker() })
  .call(force.drag)

force
  .nodes(json.nodes)
  .links(json.links)
  .on('tick', tick)
  .start()

function tick (e) {
  const k = 6 * e.alpha

  // Push sources up and targets down to form a weak tree.
  link
    .each(function (d) { d.source.y -= k, d.target.y += k })
    .attr('x1', function (d) { return d.source.x })
    .attr('y1', function (d) { return d.source.y })
    .attr('x2', function (d) { return d.target.x })
    .attr('y2', function (d) { return d.target.y })

  node
    .attr('cx', function (d) { return d.x })
    .attr('cy', function (d) { return d.y })
}
// });
