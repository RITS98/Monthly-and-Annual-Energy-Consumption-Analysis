// Common dimensions
const margin = { top: 20, right: 30, bottom: 50, left: 80 };
const width = 750 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Chart 1: CO2 Emissions by Fuel Type
const svg1 = d3.select("div#chart1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("https://raw.githubusercontent.com/RITS98/Monthly-and-Annual-Energy-Consumption-Analysis/refs/heads/main/data_source/co2_emissions_by_fuel_type.csv").then(data => {
  data.forEach(d => {
    console.log(d)
    d.Year = +d.Year;
    d.emissions = +d.emissions;
  });

  const sources = Array.from(new Set(data.map(d => d.fuel_type)));
  const dropdown = d3.select("#sourceDropdown1");
  dropdown.selectAll("option")
    .data(sources)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);

  const slider = document.getElementById('slider1');
  slider.style.width = `${width}px`;
  slider.style.marginLeft = `${margin.left}px`;

  noUiSlider.create(slider, {
    start: [2000, 2023],
    connect: true,
    range: { 'min': 1973, 'max': 2023 },
    step: 1,
    tooltips: [true, true],
    format: { to: value => Math.round(value), from: value => Math.round(value) }
  });

  const x = d3.scaleBand().range([0, width]).padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "black")
    .style("color", "white")
    .style("padding", "5px")
    .style("border-radius", "3px");

  function updateChart(minYear, maxYear, selectedSource) {
    const filteredData = data.filter(d =>
      d.Year >= minYear && d.Year <= maxYear && d.fuel_type === selectedSource
    );

    x.domain(filteredData.map(d => d.Year));
    y.domain([0, d3.max(filteredData, d => d.emissions)]);

    const bars = svg1.selectAll(".bar").data(filteredData, d => d.Year);

    bars.exit().remove();

    bars.enter()
      .append("rect")
      .attr("class", "bar")
      .merge(bars)
      .transition()
      .duration(500)
      .attr("x", d => x(d.Year))
      .attr("y", d => y(d.emissions))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.emissions))
      .attr("fill", "steelblue");

    bars.on("mouseover", function(event, d) {
      tooltip.style("visibility", "visible")
        .text(`Year: ${d.Year}, Emission: ${d.emissions} MT`);
    })
      .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY + 5) + "px")
          .style("left", (event.pageX + 5) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
      });

    svg1.selectAll(".axis").remove();
    svg1.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d => d))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
      
      svg1.append("text")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .text("Year");

    svg1.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y));
      
    svg1.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -margin.left + 15)
  .text("CO2 Emissions (Million Metric Tons)");
  }

  const initialSource = sources[0];
  updateChart(2000, 2023, initialSource);

  dropdown.on("change", () => {
    const selectedSource = dropdown.property("value");
    const yearRange = slider.noUiSlider.get();
    updateChart(...yearRange.map(Number), selectedSource);
  });

  slider.noUiSlider.on('update', (values) => {
    const [minYear, maxYear] = values.map(Number);
    const selectedSource = dropdown.property("value");
    updateChart(minYear, maxYear, selectedSource);
  });
});

// Chart 2: Energy Production by Energy Type
const svg2 = d3.select("div#chart2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("https://raw.githubusercontent.com/RITS98/Monthly-and-Annual-Energy-Consumption-Analysis/refs/heads/main/data_source/pe_production.csv").then(data => {
  data.forEach(d => {
    d.Year = +d.Year;
    d.production = +d.production;
  });

  const sources = Array.from(new Set(data.map(d => d.energy_type)));
  const dropdown = d3.select("#sourceDropdown2");
  dropdown.selectAll("option")
    .data(sources)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);

  const slider = document.getElementById('slider2');
  slider.style.width = `${width}px`;
  slider.style.marginLeft = `${margin.left}px`;

  noUiSlider.create(slider, {
    start: [2000, 2023],
    connect: true,
    range: { 'min': 1949, 'max': 2023 },
    step: 1,
    tooltips: [true, true],
    format: { to: value => Math.round(value), from: value => Math.round(value) }
  });

  const x = d3.scaleBand().range([0, width]).padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "black")
    .style("color", "white")
    .style("padding", "5px")
    .style("border-radius", "3px");

  function updateChart(minYear, maxYear, selectedSource) {
    const filteredData = data.filter(d =>
      d.Year >= minYear && d.Year <= maxYear && d.energy_type === selectedSource
    );

    x.domain(filteredData.map(d => d.Year));
    y.domain([0, d3.max(filteredData, d => d.production)]);

    const bars = svg2.selectAll(".bar").data(filteredData, d => d.Year);

    bars.exit().remove();

    bars.enter()
      .append("rect")
      .attr("class", "bar")
      .merge(bars)
      .transition()
      .duration(500)
      .attr("x", d => x(d.Year))
      .attr("y", d => y(d.production))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.production))
      .attr("fill", "orange");

    bars.on("mouseover", function(event, d) {
      tooltip.style("visibility", "visible")
        .text(`Year: ${d.Year}, Production: ${d.production} (Quadrillion Btu)`);
    })
      .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY + 5) + "px")
          .style("left", (event.pageX + 5) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("visibility", "hidden");
      });

    svg2.selectAll(".axis").remove();
    svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d => d))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
    
    svg2.append("text")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom)
  .text("Year");

    svg2.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y));
      
    svg2.append("text")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -margin.left + 15)
  .text("Energy Production (Quadrillion Btu)");
  }

  const initialSource = sources[0];
  updateChart(2000, 2023, initialSource);

  dropdown.on("change", () => {
    const selectedSource = dropdown.property("value");
    const yearRange = slider.noUiSlider.get();
    updateChart(...yearRange.map(Number), selectedSource);
  });

  slider.noUiSlider.on('update', (values) => {
    const [minYear, maxYear] = values.map(Number);
    const selectedSource = dropdown.property("value");
    updateChart(minYear, maxYear, selectedSource);
  });
});