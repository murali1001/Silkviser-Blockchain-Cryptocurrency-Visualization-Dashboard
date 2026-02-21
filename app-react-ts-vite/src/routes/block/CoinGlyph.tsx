import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import { degToRad } from '../../shared/utils/utils';

type ICoinGlyph = {
  leftDeg: number;
  rightDeg: number;
  txSize: number;
  opacity: number;
  txHash: string;
};

function CoinGlyph({ leftDeg, rightDeg, txSize, opacity, txHash }: ICoinGlyph) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const width = 90;
    const height = 90;

    // outer ring
    svg
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', 40)
      .attr('fill', 'none')
      .attr('stroke', '#af7d47')
      .attr('stroke-width', 1);

    // inner circle
    svg
      .append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', 30)
      .attr('fill', 'tan')
      .attr('stroke', '#af7d47')
      .attr('stroke-width', 1)
      .style('opacity', opacity);

    svg
      .append('line')
      .attr('x1', width / 2)
      .attr('y1', 15)
      .attr('x2', width / 2)
      .attr('y2', height - 15)
      .style('stroke', '#af7d47');

    // Square
    svg
      .append('rect')
      .attr('x', (width - txSize) / 2)
      .attr('y', (height - txSize) / 2)
      .attr('width', txSize)
      .attr('height', txSize)
      .attr('fill', 'white');

    svg
      .append('text')
      .attr('x', width / 2 - 20)
      .attr('y', height / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10 + 'px')
      .attr('font-family', 'Times New Roman')
      .attr('fill', '#af7d47')
      .text('T');

    svg
      .append('text')
      .attr('x', width / 2 + 20)
      .attr('y', height / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10 + 'px')
      .attr('font-family', 'Times New Roman')
      .attr('fill', '#af7d47')
      .text('X');

    const arcData = [
      {
        startAngle: -Math.PI / 2 - degToRad(leftDeg) / 2,
        endAngle: -Math.PI / 2 + degToRad(leftDeg) / 2,
      }, // Left arc
      {
        startAngle: Math.PI / 2 - degToRad(rightDeg) / 2,
        endAngle: Math.PI / 2 + degToRad(rightDeg) / 2,
      }, // Right arc
    ];

    const arcGenerator = d3.arc().innerRadius(30).outerRadius(40); // Thickness

    // Create a group to hold the arcs
    const arcsGroup = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    arcsGroup
      .selectAll('path')
      .data(arcData)
      .enter()
      .append('path')
      // @ts-ignore This is required because types don't understand d3 data enter syntax for arcs
      .attr('d', arcGenerator)
      .attr('fill', '#B0D6E6');
  }, []);

  return (
    <>
      <Link to={`/transaction/${txHash}`}>
        <svg ref={svgRef} width={90} height={90}></svg>
      </Link>
    </>
  );
}

export default CoinGlyph;
