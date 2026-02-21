import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyCenter } from 'd3-sankey';
import './Sankey.scss'; // Import the stylesheet
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Define TypeScript interfaces for the Sankey nodes and links
interface SankeyNode {
  name: string;
  rname?: string;
  radius?: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  // Add other node properties as needed
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;

  // Add other link properties as needed
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}
var svg;
var sourcelinkcount = 0;
const SankeyDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [sankeyData, setSankeyData] = useState<SankeyData>({
    nodes: [],
    links: [],
  });
  const { txHash } = useParams();

  const [vin, setVin] = useState<any[]>();
  const [vout, setVout] = useState<any[]>();

  useEffect(() => {
    if (!svgRef.current) return;
    const fetchData = async () => {
      try {
        // var txHash = "c9c188cf7ff8cf35b1e55baff9b0cee755f8b2d3316b3c43df96f71bc786aaaa"
        //14b9d48c2b63ad67ac2b1a74d6ff397e83be47f48f52c438c67b35cb45cc3ca8 1 to 1
        //34e429c3c3126541f1633a31ff6fcb2e258a14e259ecec487ef948cd7ed924cc 6 to 1
        //c9c188cf7ff8cf35b1e55baff9b0cee755f8b2d3316b3c43df96f71bc786aaaa 3 to 2
        //6db3d774db14d6b42409651707065fd7e7f2f42f2453acaecb458df2ca765dc3 1 to 2
        //874f69d9d459a437921fbbf013586d4569291d2e8cbaec0c95af16f68999efd5 2 to 2
        const dataToSend = {
          txHash: txHash,
        };
        const response = await axios.post(
          'http://127.0.0.1:5000/api/getrawtransaction',
          dataToSend
        ); // API call to Flask server
        const data = response.data.result;
        console.log(data);
        // return data;
        setVin(data.vin);
        setVout(data.vout);
      } catch (error) {
        console.error('Error fetching data:', error);
        return null;
      }
    };
    fetchData();
  }, [txHash]);

  useEffect(() => {
    if (!vin || !vout || !vin.length || !vout.length) {
      return;
    }
    // Use a temporary array to hold new nodes
    const newNodes: SankeyNode[] = vin.map((item, index) => ({
      name: `Source ${index + 1}`,
      radius: 0.2,
      rname: '0.2 SLU', // assuming you want to keep this static
    }));

    const newoutNodes: SankeyNode[] = vout.map((item, index) => ({
      name: `Output ${index + 1}`,
      radius: item.value,
      rname: '0.2 SLU', // assuming you want to keep this static
    }));

    const newLinks: SankeyLink[] = vin.map((item, index) => ({
      source: `Source ${index + 1}`,
      target: 'Coin',
      value: 0.2, // assuming you want to keep this static
    }));

    const newoutputLinks: SankeyLink[] = vout.map((item, index) => ({
      source: 'Coin',
      target: `Output ${index + 1}`,
      value: item.value, // assuming you want to keep this static
    }));

    var newData: SankeyData;
    // sankeyData.nodes=newNodes.concat(newoutNodes)
    // sankeyData.links=newLinks.concat(newoutputLinks)
    // Update sankeyData state by adding new nodes
    //  setSankeyData(d => {
    //   console.log('Previous data:', d); // Check the previous state
    //   newData = {
    //     ...d,
    //     nodes: [...d.nodes,{ name: 'Coin',rname:'' }]
    //   };
    //   console.log('New data:', newData); // See the new state
    //   //sankeyData.nodes = newData.nodes
    //   return newData;
    // });
    sourcelinkcount = newLinks.length;
    console.log(sourcelinkcount);
    setSankeyData({
      nodes: newNodes.concat(newoutNodes),
      links: newLinks.concat(newoutputLinks),
    });

    setSankeyData((d) => {
      console.log('Previous data:', d); // Check the previous state
      newData = {
        ...d,
        nodes: [...d.nodes, { name: 'Coin', rname: '', radius: '' }],
      };
      console.log('New data:', newData); // See the new state
      //sankeyData.nodes = newData.nodes
      return newData;
    });
  }, [vin, vout]);

  if (sankeyData.links.length > 0) {
    console.log(sankeyData);

    // Function to perform an action after a delay
    const doSomethingAfterDelay = () => {
      const timer = setTimeout(() => {
        console.log('This runs after a 2-second delay');
        // ... do something here after the delay
      }, 5000); // Delay in milliseconds

      return () => clearTimeout(timer); // Cleanup function to clear the timeout
    };

    console.log(sankeyData);

    console.log(sankeyData);
    //console.log(sankeyData1)

    const margin = { top: 20, right: 400, bottom: 20, left: 35 };
    const svgWidth = 1700;
    const svgHeight = 653;
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
    // const width = +svg.attr('width');
    // const height = +svg.attr('height');

    svg = d3
      .select(svgRef.current)
      .attr('viewBox', [0, 0, width + 100, 2 * height])
      .attr('width', svgWidth)
      .attr('height', svgHeight);
    // Constructs a new Sankey generator with the default settings
    const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
      .nodeWidth(36)
      .nodePadding(20)
      .extent([
        [margin.left, margin.top],
        [width, height],
      ])
      .nodeId((d) => d.name)
      .nodes(sankeyData.nodes)
      .nodeAlign(sankeyCenter)
      .links(sankeyData.links)
      .size([width, height]);

    sankeyGenerator(sankeyData);
    //sankeyGenerator(sankeyData1);

    const coinNode = sankeyData.nodes.find((d) => d.name === 'Coin');
    const scaleFactor = 1.1;

    const curvature = 0.5;

    // Custom path for source nodes to 'Coin' node
    const sourceToCoinPath = (link: SankeyLink) => {
      var x0 = link.source.x1 - 10,
        y0 = 2 * link.source.y0 - link.width / 2 + 3 * margin.top;
      var x1 = link.target.x0,
        y1 = (link.target.y0 + link.target.y1) / 2 - 17;
      if (sourcelinkcount == 1 || sourcelinkcount == 2) {
        (x0 = link.source.x1 - 10),
          (y0 =
            (link.source.y0 + link.target.y1) / 2 - height / 2 + margin.top);
        (x1 = link.target.x0),
          (y1 = (link.target.y0 + link.target.y1) / 2 - 17);
      }

      if (link.source.name === 'AllSource') {
        y0 = y0 - 20;
      }

      const xi = d3.interpolateNumber(x0, x1);
      const x2 = xi(curvature),
        x3 = xi(1 - curvature);
      return `M${x0},${y0}C${x2},${y0} ${x3},${y1} ${x1},${y1}`;
    };

    function createSourceToTargetPath(link: SankeyLink) {
      // Start with the narrow part at the 'Coin' node
      // Control points for the curve
      const curvature = 0.5;
      var x0 = link.source.x1,
        y0 = 2 * link.source.y0 - link.width / 2 + 3 * margin.top;
      var x1 = link.target.x0,
        y1 = (link.target.y0 + link.target.y1) / 2 - 17;
      if (sourcelinkcount == 1 || sourcelinkcount == 2) {
        (x0 = link.source.x1 - 10),
          (y0 =
            (link.source.y0 + link.target.y1) / 2 - height / 2 + margin.top);
        (x1 = link.target.x0),
          (y1 = (link.target.y0 + link.target.y1) / 2 - 17);
      }
      const xi = d3.interpolateNumber(x0, x1);
      const xControl = xi(curvature);
      const yControlSource = y0,
        yControlTarget = y1;

      // Width of the link at the source and target
      var widthSource = 5; // half-width at source for a tapering effect
      var widthTarget = 2; // full width at the target

      if (link.source.name === 'AllSource') {
        widthSource = 30;
        widthTarget = 2; // full width at the target
        y0 = y0 - 20;
      }

      // Constructing the path
      const path = d3.path();
      path.moveTo(x0, y0 - widthSource); // Start at the top edge of the source node
      path.bezierCurveTo(
        xControl,
        yControlSource - widthSource,
        xControl,
        yControlTarget - widthTarget,
        x1,
        y1 - widthTarget
      ); // Curve to the top edge of the target node
      path.lineTo(x1, y1 + widthTarget); // Draw line to the bottom edge of the target node
      path.bezierCurveTo(
        xControl,
        yControlTarget + widthTarget,
        xControl,
        yControlSource + widthSource,
        x0,
        y0 + widthSource
      ); // Curve back to the bottom edge of the source node
      path.closePath(); // Close the path

      return path.toString();
    }

    // Function to create a path for links going from 'Coin' to target nodes
    const createCoinToTargetPath = (link: SankeyLink) => {
      // Start with the narrow part at the 'Coin' node
      const curvature = 0.5;
      const x0 = link.source.x1;
      const y0 = (link.source.y0 + link.source.y1) / 2 - 17;
      const x1 = link.target.x0 - 60;
      const y1 = (link.target.y0 + link.target.y1) / 2 + 2 * margin.top;
      const xi = d3.interpolateNumber(x0, x1);
      const xControl = xi(curvature);
      const yControlSource = y0;
      const yControlTarget = y1;
      const widthSource = 1; // half-width at source for a tapering effect
      const widthTarget = 20; // full width at the target

      // Constructing the path
      const path = d3.path();
      path.moveTo(x0, y0 - widthSource); // Start at the top edge of the source node
      path.bezierCurveTo(
        xControl,
        yControlSource - widthSource,
        xControl,
        yControlTarget - widthTarget,
        x1,
        y1 - widthTarget
      ); // Curve to the top edge of the target node
      path.lineTo(x1, y1 + widthTarget); // Draw line to the bottom edge of the target node
      path.bezierCurveTo(
        xControl,
        yControlTarget + widthTarget,
        xControl,
        yControlSource + widthSource,
        x0,
        y0 + widthSource
      ); // Curve back to the bottom edge of the source node
      path.closePath(); // Close the path

      // Calculate the angle of the line
      const angle = Math.atan2(y1 - y0, x1 - x0);

      // // Calculate the position of the arrowhead
      // const arrowX = x1 - 10 * Math.cos(angle) + 60;
      // const arrowY = y1 - 10 * Math.sin(angle) + 60;

      // // Create the arrowhead path
      // const arrowhead = d3.path();
      // arrowhead.moveTo(arrowX, arrowY);
      // arrowhead.lineTo(arrowX - 6 * Math.cos(angle - Math.PI / 6), arrowY - 6 * Math.sin(angle - Math.PI / 6));
      // arrowhead.lineTo(arrowX - 6 * Math.cos(angle + Math.PI / 6), arrowY - 6 * Math.sin(angle + Math.PI / 6));
      // arrowhead.closePath();

      return path.toString();
    };
    const defs = svg.append('defs');

    // Create a gradient for each link
    sankeyData.links.forEach((link, index) => {
      if (link.source.name === 'Coin') {
        // const gradient = defs.append('linearGradient')
        // .attr('id', `gradient-${index}`)
        //   .attr('gradientUnits', 'userSpaceOnUse')
        //   .attr('x1', link.source.x1-10) // x1 of the source ('Coin' node)
        //   .attr('y1', (link.source.y0 + link.source.y1) / 2 - 17) // Middle y of the source ('Coin' node)
        //   .attr('x2', link.target.x0 -40) // x0 of the target node
        //   .attr('y2', (link.target.y0 + link.target.y1) / 2 - 100); // Middle y of the target node
        // gradient.append('stop')
        //   .attr('offset', '5%') // Start of the gradient (narrow part)
        //   .attr('stop-color', 'white') // Assuming the background color matches the 'Coin' node
        //   .attr('stop-opacity', 0); // Transparent at the start
        // gradient.append('stop')
        //   .attr('offset', '100%') // End of the gradient (thick part)
        //   .attr('stop-color', '#B0D6E6') // Color of the link at the target node
        //   .attr('stop-opacity', 1); // Fully opaque
      } else {
        const gradient = defs
          .append('linearGradient')
          .attr('id', `gradient-${index}`)
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', link.source.x1)
          .attr('y1', (link.source.y0 + link.source.y1) / 2)
          .attr('x2', link.target.x0)
          .attr('y2', (link.target.y0 + link.target.y1) / 2);

        gradient
          .append('stop')
          .attr('offset', '0%')
          .attr('stop-color', '#B0D6E6') // Replace with your link color
          .attr('stop-opacity', 1);

        gradient
          .append('stop')
          .attr('offset', '100%')
          .attr('stop-color', 'white') // Replace with the color of the 'Coin' node or background
          .attr('stop-opacity', 0); // Fade out to transparent (or background color)
      }
    });

    svg
      .append('g')
      .selectAll('path')
      .data(sankeyData.links)
      .enter()
      .append('path')
      .attr('d', (d) => {
        return d.source.name === 'Coin'
          ? createCoinToTargetPath(d)
          : sourceToCoinPath(d);
      })
      .style('stroke-width', (d) =>
        d.source.name === 'AllSource' ? 45 : d.source.name === 'Coin' ? 80 : 30
      )
      .attr('stroke', (d, i) =>
        d.source.name === 'AllSource' ? '#B0D6E6' : `url(#gradient-${i})`
      )
      .style('fill', 'none');

    svg
      .append('g')
      .selectAll('path')
      .data(sankeyData.links)
      .enter()
      .append('path')
      .attr('d', (d) => {
        return d.source.name === 'Coin'
          ? createCoinToTargetPath(d)
          : createSourceToTargetPath(d);
      })
      .style('stroke-width', (d) =>
        d.source.name === 'AllSource' ? 25 : d.source.name === 'Coin' ? 40 : 18
      )
      .attr('stroke', '#B0D6E6')
      .style('fill', 'none');

    // Draw the nodes
    const nodes = svg
      .append('g')
      .selectAll('circle')
      .data(sankeyData.nodes.filter((d) => d.name !== 'Coin'))
      .join('circle')
      .attr('cx', (d) => margin.left + d.x0)
      .attr('cy', (d) =>
        d.name.includes('Output')
          ? +d.y0 + 2 * d.radius * scaleFactor * 15 + 125
          : +(d.y0 + margin.top)
      )
      .attr('r', (d) =>
        d.radius < 1 ? 15 * scaleFactor : 15 * scaleFactor * d.radius
      )
      .attr('fill', (d) =>
        d.name.includes('AllSource')
          ? 'white'
          : d.name.includes('Output')
          ? '#bf0000'
          : 'tan'
      )
      // .attr('height', d => d.y1 - d.y0)
      // .attr('width', sankeyGenerator.nodeWidth())
      // .attr('fill', 'navy')
      .attr('stroke', 'black')
      .attr('transform', (d) =>
        d.name === 'AllSource'
          ? `translate(${d.x0},${d.y0})`
          : d.name === 'Output 1' || d.name === 'Output 2'
          ? ``
          : `translate(${d.x0},${d.y0 + 20})`
      );

    // nodes.each(function(d, i) {
    //   const nodeElement = d3.select(this);
    //   const transform = nodeElement.attr('transform');
    //   const translate = transform.match(/translate\(([^,]+),([^)]+)\)/);
    //   if (translate) {
    //     const newX0 = parseFloat(translate[1]);
    //     const newY0 = parseFloat(translate[2]);

    //     // Updating the original data object
    //     d.x0 = newX0;
    //     d.y0 = newY0;
    //     d.x1 = newX0 +36; // Assuming nodeWidth is constant
    //     d.y1 = newY0 + (d.y1 - d.y0);  // Maintaining the same height difference
    //   }
    // });

    // After updating, if you need to use the updated data elsewhere:
    sankeyData.nodes.forEach((d) => {
      console.log(d);
      console.log(`Updated x0: ${d.x0}, Updated y0: ${d.y0}`);
    });

    // Optionally, re-render or further process the sankeyData as needed
    sankeyGenerator.nodes(sankeyData.nodes);

    //   const coinNode = sankeyData.nodes.find(d => d.name === 'Coin');
    if (coinNode) {
      svg
        .append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', 60 * scaleFactor)
        .attr('fill', 'none')
        .attr('stroke', '#af7d47')
        .attr('stroke-width', 1);

      // inner circle
      svg
        .append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', 50 * scaleFactor)
        .attr('fill', 'tan')
        .attr('stroke', '#af7d47')
        .attr('stroke-width', 1);

      // Square
      svg
        .append('rect')
        .attr('x', (width - 25 * scaleFactor) / 2)
        .attr('y', (height - 25 * scaleFactor) / 2)
        .attr('width', 25 * scaleFactor)
        .attr('height', 25 * scaleFactor)
        .attr('fill', 'white');

      // svg
      //   .append('line')
      //   .attr('x1', width / 2)
      //   .attr('y1', 18)
      //   .attr('x2', width / 2)
      //   .attr('y2', (height - 25 * scaleFactor) / 2)
      //   .style('stroke', '#af7d47');
      svg
        .append('line')
        .attr('x1', width / 2)
        .attr('y1', (height - 25 * scaleFactor) / 2 + 25 * scaleFactor)
        .attr('x2', width / 2)
        .attr('y2', (height - 25 * scaleFactor) / 2 + 25 * scaleFactor + 18)
        .style('stroke', '#af7d47');

      const arcData = [
        { startAngle: -Math.PI / 2, endAngle: -Math.PI / 2 }, // Left arc
        { startAngle: Math.PI / 2 + 1, endAngle: Math.PI / 2 - 1 }, // Right arc
      ];

      const arcGenerator = d3
        .arc()
        .innerRadius(30 * scaleFactor)
        .outerRadius(40 * scaleFactor); // Thickness

      // Create a group to hold the arcs
      const arcsGroup = svg
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      // arcsGroup
      //   .selectAll('path')
      //   .data(arcData)
      //   .enter()
      //   .append('path')
      //   // @ts-ignore This is required because types don't understand d3 data enter syntax for arcs
      //   .attr('d', arcGenerator)
      //   .attr('fill', '#B0D6E6');
    }

    // Add in the text for the nodes
    // svg.append('g')
    //   .style('font', '20px sans-serif')
    //   .selectAll('text')
    //   .data(sankeyData.nodes)
    //   .join('text')
    //   .attr('x', d => d.name === 'AllSource' ? (d.x0 < width / 2 ? d.x1 - 260 : d.x0 - 6) : (d.x0 < width / 2 ? d.x1 - 130 : d.x0 - 6))
    //   .attr('y', d => (d.y1 + d.y0) / 2)
    //   .attr('dy', '0.35em')
    //   .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
    //   .text(d => d.rname)
    //   .attr("transform", function(d) {
    //     return "translate(" + d.x0 + "," + d.y0 + ")";
    //   });

    //   svg.append('g')
    //   .style('font', '40px sans-serif')
    //   .selectAll('text')
    //   .data(sankeyData.nodes)
    //   .join('text')
    //   .attr('x', d => 0)
    //   .attr('y', d => (d.y1 + d.y0) / 2-20)
    //   .attr('dy', '0.35em')
    //   .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
    //   .text(d=>d.name === 'AllSource' ? '...' : '')
    //   .attr("transform", function(d) {
    //     return "translate(" + d.x0 + "," + d.y0 + ")";
    //   });

    //   svg.append('g')
    //   .style('font', '20px sans-serif')
    //   .selectAll('text')
    //   .data(sankeyData.nodes)
    //   .join('text')
    //   .attr('x', 150)
    //   .attr('y',  d => (height/2 + d.y0 - margin.top-100) )
    //   .attr('dy', '0.35em')
    //   .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
    //   .text(d => (d.name.includes('Output')) ? (d.rname) : '')
    //   .attr("transform", function(d) {
    //     return "translate(" + d.x0 + "," + d.y0 + ")";
    //   });

    //Adding circular labels
    svg
      .append('g')
      .selectAll('circle')
      .join('circle')
      .attr('cx', 300)
      .attr('cy', 300)
      .attr('r', 15 * scaleFactor)
      .attr('fill', '#bf0000')
      // .attr('height', d => d.y1 - d.y0)
      // .attr('width', sankeyGenerator.nodeWidth())
      // .attr('fill', 'navy')
      .attr('stroke', 'black');
    // .attr('transform', d => (d.name==='AllSource' ? `translate(${d.x0},${(d.y0)})` : ((d.name === 'Output 1' || d.name==='Output 2') ? ``: `translate(${d.x0},${(d.y0+20)})`)));
  }

  return (
    <div className="svg-container">
      {' '}
      <svg ref={svgRef} />{' '}
    </div>
  );
};

export default SankeyDiagram;
