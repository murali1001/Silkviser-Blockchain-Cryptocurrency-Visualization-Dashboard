import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './Modal.scss'; // Import the SCSS file for modal styling
import FilterDashboard from './FilterDashboard'; // Update the path as per your directory structure
import CloseButton from 'react-bootstrap/CloseButton';
import CustomDateRangePicker from './DateRangeFilterDashboard'; // Update the path as per your directory structure

interface DataItem {
    month: string;
    // blocks: number;
    // addressbalance: number;
    transactions: number;
    addressbalance: number;
}

const DualAxisChart: React.FC = () => {
    const data: DataItem[] = [
        { month: 'January 2022', transactions: 250, addressbalance: 1000 },
        { month: 'February 2022', transactions: 300, addressbalance: 1250 },
        { month: 'March 2022', transactions: 1000, addressbalance: 4800},
        { month: 'April 2022', transactions: 867, addressbalance: 3500 },
        { month: 'May 2022', transactions: 750, addressbalance: 800 },
        { month: 'June 2022', transactions: 900, addressbalance: 3995 },
        { month: 'July 2022', transactions: 2500, addressbalance: 5000 },
        { month: 'August 2022', transactions: 2100, addressbalance: 4300 },
        { month: 'September 2022', transactions: 1400, addressbalance: 4265 },
        { month: 'October 2022', transactions: 100, addressbalance: 800 },
        { month: 'November 2022', transactions: 1320, addressbalance: 3000 },
        { month: 'December 2022', transactions: 2000, addressbalance: 5000 },
        { month: 'January 2023', transactions: 750, addressbalance: 3789 },
        { month: 'February 2023', transactions: 800, addressbalance: 1250 },
        { month: 'March 2023', transactions: 890, addressbalance: 4300 },
        { month: 'April 2023', transactions: 760, addressbalance: 3200 },
        { month: 'May 2023', transactions: 500, addressbalance: 1000 },
        { month: 'June 2023', transactions: 1000, addressbalance: 2000 },
        { month: 'July 2023', transactions: 1500, addressbalance: 3000 },
        { month: 'August 2023', transactions: 2000, addressbalance: 4000 },
        { month: 'September 2023', transactions: 2500, addressbalance: 5000 },
        { month: 'October 2023', transactions: 700, addressbalance: 4250 },
        { month: 'November 2023', transactions: 1800, addressbalance: 3200 },
        { month: 'December 2023', transactions: 1480, addressbalance: 4300 },
        { month: 'January 2024', transactions: 520, addressbalance: 800 }
        ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [selectedMonths, setSelectedMonths] = useState<string[]>(data.map(item => item.month));

    const svgRef = useRef<SVGSVGElement>(null);
    const scatterplotRef = useRef<SVGSVGElement>(null);
    const width = 1550;
    const height = 400;

    useEffect(() => {
        if (!svgRef.current) return;
    
        const svg = d3.select<SVGSVGElement, DataItem[]>(svgRef.current);
    
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
        svg.selectAll('.x-axis, .y-axis-1, .y-axis-2').remove();
        svg.selectAll('.bar, .circle, .line').remove();
    
        const xScale = d3.scaleBand()
            .domain(selectedMonths)
            .range([margin.left, width - margin.right])
            .padding(0.1);
    
        const barWidth = 20;
        const xCenterOffset = (xScale.bandwidth() - barWidth) / 2;
    
        const yScale1 = d3.scaleLinear()
            .domain([0, d3.max(data.filter(d => selectedMonths.includes(d.month)), d => d.addressbalance)! * 1.2])
            .range([height - margin.bottom, margin.top]);
    
        const yScale2 = d3.scaleLinear()
            .domain([0, d3.max(data.filter(d => selectedMonths.includes(d.month)), d => d.transactions)! * 1.2])
            .range([height - margin.bottom, margin.top]);
    
        const xAxis = (g: any) => {
                g.call(
                    d3.axisBottom(xScale)
                        .tickSizeOuter(0)
                        .tickFormat((d: string) => d) // Keep the entire word
                );
            
                // Rotate the text labels and adjust text-anchor
                g.selectAll('.tick text')
                    .attr('transform', 'rotate(-30)')
                    .style('text-anchor', 'end')
                    .style('fill', 'black');
            };
        const yAxis1 = (g: any) => g.call(d3.axisLeft(yScale1)).style('color', 'black');
        const yAxis2 = (g: any) => g.call(d3.axisRight(yScale2)).style('color', 'black');
    
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(xAxis);
    
        svg.append('g')
            .attr('class', 'y-axis-1')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxis1)
            .append("text") 
            .attr("x", -margin.left + 10) 
            .attr("y", 10)
            .attr("text-anchor", "start")
            .attr("fill", "black")
            .attr("font-size", "15px") 
            .attr("font-family", "Courier New, Courier, monospace") 
            .text("Address Balance");
    
    
        svg.append('g')
            .attr('class', 'y-axis-2')
            .attr('transform', `translate(${width - margin.right}, 0)`)
            .call(yAxis2)
            .append("text") 
            .attr("x", margin.right) 
            .attr("y", 10) 
            .attr("text-anchor", "end")
            .attr("fill", "black")
            .attr("font-size", "15px")
            .attr("font-family", "Courier New, Courier, monospace")
            .text("Transactions");
    
        svg.selectAll('.bar')
            .data(data.filter(d => selectedMonths.includes(d.month)))
            .join('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.month)! + xCenterOffset)
            .attr('y', d => yScale1(d.addressbalance))
            .attr('width', barWidth)
            .attr('height', d => height - margin.bottom - yScale1(d.addressbalance))
            .attr('fill', '#d0b693');
    
        const line = d3.line<DataItem>()
            .x(d => xScale(d.month)! + xScale.bandwidth() / 2)
            .y(d => yScale2(d.transactions)!);
    
        svg.append('path')
            .datum(data.filter(d => selectedMonths.includes(d.month)))
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', '#e26a66')
            .attr('stroke-width', 2)
            .attr('d', line);
    
        svg.selectAll('.circle')
            .data(data.filter(d => selectedMonths.includes(d.month)))
            .join('circle')
            .attr('class', 'circle')
            .attr('cx', d => xScale(d.month)! + xScale.bandwidth() / 2)
            .attr('cy', d => yScale2(d.transactions)!)
            .attr('r', 4)
            .attr('fill', '#e26a66');
    
        const brush = d3.brushX()
            .extent([[0, 0], [width, height]])
            .on("end", brushed);
    
        svg.append('g')
            .attr('class', 'brush')
            .call(brush as any);
    
            function brushed(event: d3.D3BrushEvent<SVGRectElement>) {
                const selection = event.selection;
                if (!selection) return;
            
                const [x0, x1] = selection;
                const selectedCategories: string[] = [];
                let hasData = false; 
            
                xScale.domain().forEach(category => {
                    const xPos = xScale(category)! + xScale.bandwidth() / 2;
                    const x0Value = Array.isArray(x0) ? x0[0] : x0;
                    const x1Value = Array.isArray(x1) ? x1[0] : x1;
                    if (xPos >= x0Value && xPos <= x1Value) {
                        selectedCategories.push(category);
                        hasData = true; 
                    }
                });
            
                if (hasData) {
                    const filteredData = data.filter(d => selectedCategories.includes(d.month));
                    setFilteredData(filteredData);
                    setIsModalOpen(true);
                } else {
                    
                    setIsModalOpen(false);
                }
            }
            
    }, [selectedMonths]);

    const handleFilterChange = (selectedMonths: string[]) => {
        setSelectedMonths(selectedMonths);
    };

    useEffect(() => {
        if (!scatterplotRef.current) return;

        const scatterplotSvg = d3.select<SVGSVGElement, DataItem[]>(scatterplotRef.current);

        scatterplotSvg.selectAll('*').remove();

        const margin = { top: 20, right: 100, bottom: 60, left: 70 };
        const scatterWidth = 800;
        const scatterHeight = 400;

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.transactions)! * 1.3])
            .range([margin.left, scatterWidth - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.addressbalance)! * 1.3])
            .range([scatterHeight - margin.bottom, margin.top]);

        const xAxis = (g: any) => g.call(d3.axisBottom(xScale).tickSizeOuter(0)).style('color', 'black');
        const yAxis = (g: any) => g.call(d3.axisLeft(yScale)).style('color', 'black');

        scatterplotSvg.append('g')
            .attr('transform', `translate(0, ${scatterHeight - margin.bottom})`)
            .call(xAxis);

        scatterplotSvg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxis);

        const lineGenerator = d3.line<DataItem>()
            .x(d => xScale(d.transactions))
            .y(d => yScale(d.addressbalance))
            .curve(d3.curveCardinal);

        scatterplotSvg.append('defs')
            .append('marker')
            .attr('id', 'arrow')
            .attr('markerWidth', 10)
            .attr('markerHeight', 10)
            .attr('refX', 9)
            .attr('refY', 3)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,0 L0,6 L9,3 Z')
            .attr('fill', '#e26a66');

        const path = scatterplotSvg.append('path')
            .datum(filteredData)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', '#e26a66')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrow)')
            .attr('d', lineGenerator(filteredData.slice(0, 1)));

        path.transition()
            .duration(3000)
            .ease(d3.easeQuadIn)
            .attrTween('d', function() {
                return function(t) {
                    const intermediateData = filteredData.slice(0, Math.floor(t * (filteredData.length - 1)) + 1);
                    return lineGenerator(intermediateData) || "";
                };
            });

        scatterplotSvg.selectAll('.dot')
            .data(filteredData)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.transactions))
            .attr('cy', d => yScale(d.addressbalance))
            .attr('r', 4)
            .style('fill', '#d0b693');

        scatterplotSvg.selectAll('.dot-label')
            .data(filteredData)
            .enter().append('text')
            .attr('class', 'dot-label')
            .attr('x', d => xScale(d.transactions) + 5)
            .attr('y', d => yScale(d.addressbalance) - 5)
            .text(d => d.month)
            .style('fill', 'black')
            .style('font-size', '12px')
            .style('text-anchor', 'start'); 

        scatterplotSvg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(scatterHeight / 2))
        .attr('y', margin.left - 40)
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Blocks');

    scatterplotSvg.append('text')
        .attr('x', scatterWidth / 2)
        .attr('y', scatterHeight - margin.bottom + 40)
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Address Balance');
    }, [filteredData]);

    useEffect(() => {
        // Load initial data
        setFilteredData(data);
    }, []);

    return (
        <>
        {/* style={{ position: 'absolute', left: '50%', bottom: '25%', transform: 'translateX(-50%)' }} */}
  
            <div style={{paddingTop: '30px'}}>
            <svg ref={svgRef} width={width} height={height}  style={{ position: 'absolute', left: '54%', bottom: '25%', transform: 'translateX(-50%)', top: '40%', width: '100%', height:'100%'}}>
                            {/* Line chart legend */}
            <line x1={width / 2 + 20} y1={20} x2={width / 2 + 50} y2={20} stroke="#e26a66" strokeWidth={2} />
            <circle cx={width / 2 + 35} cy={20} r={4} fill="#e26a66" />
            <text x={width / 2 + 60} y={25} fontSize="14px" fontFamily="Arial" fill="black">Address Balance</text>
                
                {/* Bar chart legend */}
            <rect x={width / 2 - 150} y={10} width={20} height={20} fill="#d0b693" />
            <text x={width / 2 - 120} y={25} fontSize="14px" fontFamily="Arial" fill="black">Transactions</text>


            </svg>
            </div>
            {/* <FilterDashboard months={data.map(item => item.month)} onFilterChange={handleFilterChange} /> */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                    <div className="modal-header">Number of Blocks vs Balance of the Address (Connected Scatterplot)</div>
                    <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}><CloseButton/></button>
                    <div style={{ display: 'flex' }}>
                        <svg ref={scatterplotRef} width={800} height={400}></svg>
                        <div style={{ paddingTop: 40 }}>
                        <ul>
                            {filteredData.map(item => (
                            <li key={item.month}>{item.month}: Address Balance - {item.addressbalance}, Transactions - {item.transactions}</li>
                            ))}
                        </ul>
                        </div>
                    </div>
                    </div>
                </div>
                )}

        </>
    );
};



export default DualAxisChart;