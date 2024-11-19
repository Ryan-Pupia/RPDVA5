import React, { Component } from "react";
import * as d3 from "d3";
import './Child1.css'

class Child1 extends Component {
  state = { 
    company: "Apple", // Default Company
    selectedMonth: 'November' //Default Month
  };

  componentDidMount() {
    //console.log(this.props.csv_data) // Use this data as default. When the user will upload data this props will provide you the updated data
    this.render_chart()
  }

  componentDidUpdate() {
    //console.log(this.props.csv_data)
    this.render_chart()
  }

  render_chart() {
    // Setting up margins and container
    const margin = {left: 80, top: 30, right: 10, bottom: 70}
    const h = 300
    const w = 500
    const container = d3.select(".plot")
      .attr('width', margin.left + w + margin.right)
      .attr('height', margin.top + h + margin.bottom)
      .selectAll('.container')
      .data([0])
      .join('g')
      .attr('class', 'container')
      .attr('height', h)
      .attr('width', w)
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
    
    // Generate Scales
    const filtered_data = this.props.csv_data.filter(d => d.Company === this.state.company && d.Date.toLocaleString('default', {month:'long'}) === this.state.selectedMonth)
    //console.log(filtered_data)
    const xScale = d3.scaleTime().domain(d3.extent(filtered_data, d=> d.Date)).range([0, w])
    const yScale = d3.scaleLinear().domain([d3.min([d3.min(filtered_data, d=> d.Open), d3.min(filtered_data, d=> d.Close)]), d3.max([d3.max(filtered_data, d=> d.Open), d3.max(filtered_data, d=> d.Close)])]).range([h, 0])

    // Add Axis
    // Add the X axis
    container.selectAll(".x-axis").data([null]).join("g").attr("class", "x-axis").attr("transform", `translate(0,${h + margin.bottom/4})`).call(d3.axisBottom(xScale));

    // Add the Y axis
    container.selectAll(".y-axis").data([null]).join("g").attr("class", "y-axis").attr("transform", `translate(${-margin.left/2},0)`).call(d3.axisLeft(yScale).tickFormat(d => isNaN(d) ? "" : `${d.toFixed(0)}`));
    // Rotate Y axis labels
    container.selectAll(".x-axis").selectAll("text").attr('text-anchor', 'start').attr("transform", "rotate(45)")
    container.selectAll("text").attr("font-size", 14).attr('font-weight', 'bold')

    // Generate paths
    const OpenGenerator = d3.line()
      .x(d => xScale(d.Date))
      .y(d => yScale(d.Open))
      .curve(d3.curveCardinal)
    const CloseGenerator = d3.line()
      .x(d => xScale(d.Date))
      .y(d => yScale(d.Close))
      .curve(d3.curveCardinal)

    // Generate path data
    const openData = OpenGenerator(filtered_data)
    const closeData = CloseGenerator(filtered_data)

    // Plot the lines
    container.selectAll(".openPath")
      .data([openData])
      .join('path')
      .attr('class', 'openPath')
      .attr('d', d => d)
      .attr('stroke', '#b2df8a')
      .attr('fill', 'none')
      .attr('stroke-width', 3)

    container.selectAll(".closePath")
      .data([closeData])
      .join('path')
      .attr('class', 'closePath')
      .attr('d', d => d)
      .attr('stroke', "#e41a1c")
      .attr('fill', 'none')
      .attr('stroke-width', 3)
    // Plot the dots too

    container.selectAll(".openPoint")
      .data(filtered_data)
      .join('circle')
      .attr('class', 'openPoint')
      .attr('cx', d => xScale(d.Date))
      .attr('cy', d => yScale(d.Open))
      .attr('r', 5)
      .attr('fill', '#b2df8a')
    
    container.selectAll(".closePoint")
      .data(filtered_data)
      .join('circle')
      .attr('class', 'closePoint')
      .attr('cx', d => xScale(d.Date))
      .attr('cy', d => yScale(d.Close))
      .attr('r', 5)
      .attr('fill', '#e41a1c')
  }

  handleCompanyChange = (e) => {
    this.setState({
      company: e.target.value
    });
  };

  handleMonthChange = (e) => {
    this.setState({
      selectedMonth: e.target.value
    })
  };

  render() {
    const options = ['Apple', 'Microsoft', 'Amazon', 'Google', 'Meta']; // Use this data to create radio button
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // Use this data to create dropdown

    return (
      <div className="child1">
        <div className="CompanyRadio">
          <label>Company :</label>{options.map((Company, index) =>
            <label key={index}>
              <input
                type="radio"
                name="company"
                value={Company}
                checked={this.state.company === Company}
                onChange={this.handleCompanyChange}
              />
              {Company}
            </label>
          )}
        </div>
        <div className="MonthDrop">
          <label>Month: </label>
          <select id="dropdown" onChange={this.handleMonthChange}>
            {
              months.map((month, index) =>
                <option key={index} value={month}selected={month==="November"}>{month}</option>
              )
            }
          </select>
        </div>
        <svg className="plot"></svg>
      </div>
    );
  }
}

export default Child1;
