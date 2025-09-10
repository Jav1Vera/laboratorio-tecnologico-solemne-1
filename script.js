import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Con esto solo se pone el codigo limpio y no el original quee tiene espacios y talin talin
d3.json("data.json").then(function(data) {
  // Saca los espacios >:(
  const cleanedData = data.map(d => {
    const newObj = {}
    for (let key in d) {
      const newKey = key.replace(/\s+/g, "")
      newObj[newKey] = d[key]
    }
    return newObj
  })

const filteredData = cleanedData.filter(d => d.YearPublished >= 2000 && d.ID <= 100000)

const etiqueta = d3.select('body').append('div')
    .classed('etiqueta', true)

// Todo para que no choquen los mendigos circulos >:(
const radius = 10
const idScale = d3.scaleLinear()
  .domain(d3.extent(filteredData, d => d.ID)) // Se autoescala
  .range([80 + radius, 1000 - radius])

const yearScale = d3.scaleLinear()
  .domain([2000, 2025])
  .range([520 - radius, 20 + radius])
const colorScale = d3.scaleSequential()
  .domain(d3.extent(filteredData, d => d.YearPublished))
  .interpolator(d3.interpolatePlasma)

const ratedScale = d3.scaleSqrt()
    .domain(d3.extent(filteredData, d => d.UsersRated))
    .range([radius, radius])

d3.select('.chart')
  .selectAll('circle')
  .data(filteredData)  //Alegria alegria que si funciona ahhhhhh
  .join('circle')
  .attr('r', d => ratedScale(d.UsersRated))
  .attr('cx', d => idScale(d.ID))
  .attr('cy', d => yearScale(d.YearPublished) + (Math.random() * 5 -2.5))
  .attr('fill', d => colorScale(d.YearPublished))
  .attr('opacity', 0.5)

    .on('mouseenter', (e, d) => {
      etiqueta
        .style('top', e.pageY + 5 + 'px')
        .style('left', e.pageX + 5 + 'px')
        .style('opacity', 1)
        .html(`<p><strong>${d.Name}</strong><br>ID: ${d.ID}<br>Año: ${d.YearPublished}<br>Usuarios: ${d.UsersRated}</p>`)
    })
    .on('mouseout', () => {
      etiqueta.style('opacity', 0)
    })
})

const idScale = d3.scaleLinear().domain([0, 100000]).range([80, 1000])
const yearScale = d3.scaleLinear().domain([2000, 2025]).range([520, 20])

const xAxis = d3.axisBottom(idScale)
    .tickValues([0, 20000, 40000, 60000, 80000, 100000])
    .tickFormat(d3.format("d"))
d3.select('.x-axis')
    .attr('transform', 'translate(-20, 520)')
    .call(xAxis)

const yAxis = d3.axisLeft(yearScale)
    .tickValues([2000, 2005, 2010, 2015, 2020, 2025])
    .tickFormat(d3.format("d"))
d3.select('.y-axis')
    .attr('transform', 'translate(60, 0)')
    .call(yAxis)

d3.select('.chart')
    .append('text')
    .attr('x', 550)
    .attr('y', 550)
    .attr('text-anchor', 'middle')
    .text('ID de Juego') 

d3.select('.chart')
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -250)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .text('Año de Publicación')  // Con tilde y todo :D
