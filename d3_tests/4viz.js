const state = {
    data: [],
    passengerClass: "",
    selectedSex: null,
    selectedSurvived: null
  };
  
  
  
  function createHistogram(svgSelector) {
    const margin = {
      top: 40,
      bottom: 10,
      left: 120,
      right: 20
    };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    // Creates sources <svg> element
    const svg = d3.select(svgSelector)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);
  
    // Group used to enforce margin
    const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  
    // Scales setup
    const xscale = d3.scaleLinear().range([0, width]);
    const yscale = d3.scaleLinear().range([0, height]);
  
    // Axis setup
    const xaxis = d3.axisTop().scale(xscale);
    const g_xaxis = g.append('g').attr('class', 'x axis');
    const yaxis = d3.axisLeft().scale(yscale);
    const g_yaxis = g.append('g').attr('class', 'y axis');
  
  
    function update(new_data) { //: (IPerson[] & {x0: number, x1: number})[]
      //update the scales
      xscale.domain([0, d3.max(new_data, (d) => d.length)]);
      yscale.domain([new_data[0].x0, new_data[new_data.length - 1].x1]);
      //render the axis
      g_xaxis.transition().call(xaxis);
      g_yaxis.transition().call(yaxis);
  
      // Render the chart with new data
  
      // DATA JOIN
      const rect = g.selectAll('rect').data(new_data).join(
        (enter) => {
          // ENTER
          // new elements
          const rect_enter = enter.append('rect')
          .attr('x', 0) //set intelligent default values for animation
          .attr('y', 0)
          .attr('width', 0)
          .attr('height', 0);
          rect_enter.append('title');
          return rect_enter;
        },          
        // UPDATE
        // update existing elements
        (update) => update,
        // EXIT
        // elements that aren't associated with data
        (exit) => exit.remove()
      );      
  
      // ENTER + UPDATE
      // both old and new elements
      rect.transition()
        .attr('height', (d) => yscale(d.x1) - yscale(d.x0) - 2)
        .attr('width', (d) => xscale(d.length))
        .attr('y', (d) => yscale(d.x0) + 1);
  
      rect.select('title').text((d) => `${d.x0}: ${d.length}`);
    }
  
    return update;
  }
  
  function createPieChart(svgSelector, stateAttr, colorScheme) {
    const margin = 10;
    const radius = 100;
  
    // Creates sources <svg> element
    const svg = d3.select(svgSelector)
    .attr('width', radius * 2 + margin * 2)
    .attr('height', radius * 2 + margin * 2);
  
    // Group used to enforce margin
    const g = svg.append('g')
    .attr('transform', `translate(${radius + margin},${radius + margin})`);
  
    const pie = d3.pie().value((d) => d.values.length).sortValues(null).sort(null);
    const arc = d3.arc().outerRadius(radius).innerRadius(0);
  
    const cscale = d3.scaleOrdinal(colorScheme);
  
    function update(new_data) { //{key: string, values: IPerson[]}[]
      const pied = pie(new_data);
      // Render the chart with new data
  
      cscale.domain(new_data.map((d) => d.key));
  
      // DATA JOIN
      const path = g.selectAll('path').data(pied, (d) => d.data.key).join(
        // ENTER
        // new elements
        (enter) => {
          const path_enter = enter.append('path');
          // TODO register click handler to change selected sex in state and call updateApp()
          path_enter.append('title');
          path_enter.on('click', (d) => {
            if (state.selectedSex === d.data.key) {
              state.selectedSex = null;
            } else {
              state.selectedSex = d.data.key;
            }
            updateApp();
          });
          return path_enter;
        }
      );
  
      // ENTER + UPDATE
      // both old and new elements
      path
        .classed('selected', (d) => d.data.key === state.selectedSex)
        .attr('d', arc) // TODO set the CSS class `selected` if the current data item is the selected sex in the state
        .style('fill', (d) => cscale(d.data.key));
  
      path.select('title').text((d) => `${d.data.key}: ${d.data.values.length}`);
    }
  
    return update;
  }
  
  /////////////////////////
  
  const ageHistogram = createHistogram('#age');
  const sexPieChart = createPieChart('#sex', 'selectedSex', d3.schemeSet3);
  const fareHistogram = createHistogram('#fare');
  const survivedPieChart = createPieChart('#survived', 'selectedSurvived', d3.schemeSet3.slice(2));
  
  function filterData() {
    return state.data.filter((d) => {
      if (state.passengerClass && d.pclass !== state.passengerClass) {
        return false;
      }
      if (state.selectedSex && d.sex !== state.selectedSex) {
        return false;
      }
      if (state.selectedSurvived && d.survived !== state.selectedSurvived) {
        return false;
      }
      return true;
    });
  }
  
  function wrangleData(filtered) {
    const ageHistogram = d3.histogram()
    .domain([0, 100])
    .thresholds(10)
    .value((d) => d.age);
  
    const ageHistogramData = ageHistogram(filtered);
  
    // always the two categories
    const sexPieData = ['female', 'male'].map((key) => ({
      key,
      values: filtered.filter((d) => d.sex === key)
    }));
  
    const fareHistogram = d3.histogram()
    .domain([0, d3.max(filtered, (d) => d.fare)])
    .value((d) => d.fare);
  
    const fareHistogramData = fareHistogram(filtered);
  
    // always the two categories
    const survivedPieData = ['0', '1'].map((key) => ({
      key,
      values: filtered.filter((d) => d.survived === key)
    }));
  
    return {ageHistogramData, sexPieData, fareHistogramData, survivedPieData};
  }
  
  function updateApp() {
    const filtered = filterData();
  
    const {ageHistogramData, sexPieData, fareHistogramData, survivedPieData} = wrangleData(filtered);
    ageHistogram(ageHistogramData);
    sexPieChart(sexPieData);
    fareHistogram(fareHistogramData);
    survivedPieChart(survivedPieData);
  
    d3.select('#selectedSex').text(state.selectedSex || 'None');
    d3.select('#selectedSurvived').text(state.selectedSurvived || 'None');
  }
  
  
  d3.csv('https://rawgit.com/sgratzl/d3tutorial/master/examples/titanic3.csv').then((parsed) => {
    state.data = parsed.map((row) => {
      row.age = parseInt(row.age, 10);
      row.fare = parseFloat(row.fare);
      return row;
    });
  
    updateApp();
  });
  
  //interactivity
  d3.select('#passenger-class').on('change', function () {
    const selected = d3.select(this).property('value');
    state.passengerClass = selected;
    updateApp();
  });