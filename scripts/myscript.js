// Initialize variables
const margin = { top: 20, right: 30, bottom: 50, left: 40 };
const width = 1000 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;

const svg = d3.select("div#chart")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("./co2_emissions_by_fuel_type.csv").then(function(data) {
  console.log(data);
}).catch(function(error) {
  console.error("Error loading CSV:", error);
});

d3.csv("co2_emissions_by_fuel_type.csv").then(data => {
    data.forEach(d => {
d.Year = +d.Year; // Converts Year to a number
d.emissions = +d.emissions;   // Converts CO2 emissions to a number
});

const sources = Array.from(new Set(data.map(d => d.fuel_type)));
const dropdown = d3.select("#sourceDropdown");
dropdown.selectAll("option")
.data(sources)
.enter()
.append("option")
.text(d => d)
.attr("value", d => d);

const slider = document.getElementById('slider');
slider.style.width = `${width}px`; // Remove margin additions
slider.style.marginLeft = `${margin.left}px`; // Align with chart left edge

noUiSlider.create(slider, {
start: [2000, 2023],
connect: true,
range: { 'min': 1973, 'max': 2023 },
step: 1,
tooltips: [true, true],
format: { to: value => Math.round(value), from: value => Math.round(value) }
});

const x = d3.scaleBand()
.range([0, width])    // Maps the x-axis to the chart width
.padding(0.1);        // Adds space between bars

const y = d3.scaleLinear()
.range([height, 0]);  // Inverts the y-axis: 0 at the bottom, max at the top

const tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.attr("style", "opacity: 0;");

function updateChart(minYear, maxYear, selectedSource) {
  const filteredData = data.filter(d => 
    d.Year >= minYear && d.Year <= maxYear && d.fuel_type === selectedSource
  );

  x.domain(filteredData.map(d => d.Year));
  y.domain([0, d3.max(filteredData, d => d.emissions)]);

  // Bind data to bars
  const bars = svg.selectAll(".bar")
    .data(filteredData, d => d.Year);

  // Remove old bars
  bars.exit().remove();

  // Add new bars
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
  
  const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden")
  .style("background-color", "black")
  .style("padding", "5px")
  .style("border-radius", "3px")
  .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)");
  
  bars.on("mouseover", function(event, d) {
    tooltip.style("visibility", "visible")
      .text(`Year: ${d.Year}, Emission: ${d.emissions} Million Metric Tons`);
  })
  .on("mousemove", function(event) {
    tooltip.style("top", (event.pageY + 5) + "px")
      .style("left", (event.pageX + 5) + "px");
  })
  .on("mouseout", function() {
    tooltip.style("visibility", "hidden");
  });
  // Update axes
  svg.selectAll(".axis").remove();
  
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text") // Select all text elements (y-axis ticks)
    .attr("transform", "rotate(-45)") // Apply 45 degree rotation
    .style("text-anchor", "end");;

  svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));
}

// Initialize chart with first source
const initialSource = sources[0];
updateChart(2000, 2023, initialSource);

// Dropdown interaction
dropdown.on("change", () => {
  const selectedSource = dropdown.property("value");
  const yearRange = slider.noUiSlider.get();
  const [minYear, maxYear] = yearRange.map(Number);
  updateChart(minYear, maxYear, selectedSource);
});

// Slider interaction
slider.noUiSlider.on('update', (values) => {
  const [minYear, maxYear] = values.map(Number);
  const selectedSource = dropdown.property("value");
  document.getElementById("yearRange").textContent = `${minYear} - ${maxYear}`;
  updateChart(minYear, maxYear, selectedSource);
});
});