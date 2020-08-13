import React, { useEffect, useRef, useState } from 'react'
import { select } from 'd3-selection'
import { max } from 'd3-array'
import { scaleLinear, scaleBand } from 'd3-scale'
import { axisLeft, axisBottom } from 'd3-axis'
import * as d3 from 'd3'
import { deflateRaw } from 'zlib'

function WireDiagram({ data }) {
  const d3svg = useRef(null)
  const [sizes, setSizes] = useState({ fullWidth: 100, fullHeight: 100 })

  useEffect(() => {
    if (data && d3svg.current) {
      const { margins, sizes } = data;
      sizes.fullWidth = sizes.width + margins.left + margins.right;
      sizes.fullHeight = sizes.height + margins.top + margins.bottom;
      setSizes(sizes)
    }
  }, [data])

  const drawDatum = (el, g) => {
    /*
    g.append("svg:circle")
      .attr("class", "node")
      .attr("r", 3.5)
      .attr("cx", el.position.x)
      .attr("cy", el.position.y)
    */
    
    g.append("svg:text")
      .attr("x", el.position.x + 10)
      .attr("y", el.position.y - 10)
      .attr("dy", ".35em")
      .text(el.label)
  }

  const drawMorph = (el, g) => {
    g.append("rect")
      .attr("class", "morph")
      .attr("x", el.box.left)
      .attr("y", el.box.top)
      .attr("width", el.size.width)
      .attr("height", el.size.height)
      .attr('fill', 'rgba(0,0,0,0)')
      .attr('stroke', '#555555')
      .attr('stroke-width', '1')
      .attr("rx", 8)
    
    g.append("svg:text")
      .attr("x", el.position.x - 5)
      .attr("y", el.position.y)
      .attr("dy", ".35em")
      .text(el.label)

    el.inputs.forEach(input => {
      /*
      g.append("svg:circle")
        .attr("class", "node")
        .attr("r", 2)
        .attr("cx", input.end.x)
        .attr("cy", input.end.y)
      */
    })
    el.outputs.forEach(output => {
      /*
      g.append("svg:circle")
        .attr("class", "node")
        .attr("r", 2)
        .attr("cx", output.start.x)
        .attr("cy", output.start.y)
      */
    })
    
  }

  useEffect(() => {
    if (data && d3svg.current) {
      const { paths, columns, margins, sizes, elements, links } = data;
      
      const svg = select(d3svg.current)

      const g = svg.append('g')
        .attr('transform', `translate(${margins.top}, ${margins.left})`);
      
      const elementKeys = Object.keys(elements)

      elementKeys.filter(v => elements[v].type === 'datum').forEach(v => {
        const el = elements[v]
        drawDatum(el, g)
      })

      elementKeys.filter(v => elements[v].type === 'morph').forEach(v => {
        const el = elements[v]
        drawMorph(el, g)
      })

      const linkGenerator = d3.linkHorizontal()
        .x(function(d) { return d[0] })
        .y(function(d) { return d[1] });

      links.forEach((v,i,a) => {
        const { start, end } = v
        const testLink = linkGenerator({
          source: [start.x, start.y],
          target: [end.x, end.y]
        });
        g.append('path')
          .attr("d", testLink)
          .attr("fill", "none")
          .attr("stroke", "black");
      })
        


      
      /*
      const xScale = scaleLinear()
        .domain([0, columns.length])
        .range([0, sizes.width])
      
      const yScale = scaleLinear()
        .domain([0, paths.length])
        .range([0, sizes.height])

      const link = d3.linkHorizontal()
        .x(function(d) { return xScale(d[0]); })
        .y(function(d) { return yScale(d[1]); });
      
      columns.forEach((c,i) => {
        console.log(c)
        c.forEach((label,j) => {
          console.log(label)
          g.append("svg:circle")
            .attr("class", "node")
            .attr("r", 3.5)
            .attr("cx", xScale(i))
            .attr("cy", yScale(j));
          g.append("svg:text")
            .attr("x", xScale(i) )
            .attr("y", xScale(j))
            .attr("dy", ".35em")
            .text(label);
        })
      });
      
      paths.forEach((p,i) => {
        const testLink = link({
          source: [1, 1],
          target: [2, 2]
        });
        g.append('path')
          .attr("d", testLink)
          .attr("fill", "none")
          .attr("stroke", "black");
      })
      */


    } else {
      console.log('WireDiagram waiting for data')
    }
  }, [data])

  return (
    <div>
      <svg
        className="wire-diagram-svg"
        width={sizes.fullWidth}
        height={sizes.fullHeight}
        role="img"
        ref={d3svg}
      ></svg>
      <style jsx>{`
        svg {
          border: 1px solid grey;
        }
      `}</style>
    </div>
  )
}

export default WireDiagram;