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

  // Esto filtra los datos para que no sea tannn largo... igual lo hice de 50 barras
const filteredData = cleanedData.filter(d => 
    d.YearPublished >= 2000 &&
    d.ID != null &&
    d.ID >= 200 &&
    d.ID <= 100000)

 const margin = { top: 40, right: 40, bottom: 150, left: 80 }
  const barWidth = 40 // ancho de cada barra
  const width = filteredData.length * (barWidth + 10) // ancho dinámico segun cantidad de barras
  const height = 580 - margin.top - margin.bottom // Margenes para que no se topen

  const svg = d3.select(".chart") // Bendita sea en svg que no hay manera de hacer algo decente sin que lo mencionen en las referencias >:(
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

  const xScale = d3.scaleBand()
    .domain(filteredData.map(d => d.Name))
    .range([0, width])
    .padding(0.3)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.UsersRated)])
    .nice()
    .range([height, 0])

  const colorScale = d3.scaleSequential()
    .domain(d3.extent(filteredData, d => d.YearPublished))
    .interpolator(d3.interpolatePlasma) // Asi no tienen el mismo color

  const tooltip = d3.select('body').append('div')
    .classed('etiqueta', true)

  svg.selectAll("rect")
    .data(filteredData)
    .join("rect")
    .attr("x", d => xScale(d.Name))
    .attr("y", d => yScale(d.UsersRated))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.UsersRated))
    .attr("fill", d => colorScale(d.YearPublished))
    .attr("opacity", 0.8)
    .on("mouseenter", (e, d) => {
      tooltip
        .style('top', e.pageY + 5 + 'px')
        .style('left', e.pageX + 5 + 'px')
        .style('opacity', 1)
        .html(`
          <p><strong>${d.Name}</strong></p>
          <p>ID: ${d.ID}</p>
          <p>Año: ${d.YearPublished}</p>
          <p>Usuarios: ${d.UsersRated}</p>
        `)
    })
    .on("mouseout", () => tooltip.style('opacity', 0))

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .attr("text-anchor", "end")

  svg.append("g")
    .call(d3.axisLeft(yScale))

  // Etiquetas de ejes para no morir en el intento
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 120)
    .attr("text-anchor", "middle")
    .text("Nombre del Juego")

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("Usuarios Valorados")
})
