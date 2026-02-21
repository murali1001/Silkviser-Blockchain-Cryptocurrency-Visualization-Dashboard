import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './Modal.scss'; // Import the SCSS file for modal styling
import FilterDashboard from './FilterDashboard'; // Update the path as per your directory structure
import CloseButton from 'react-bootstrap/CloseButton';
import ToggleButton from './ToggleButton'
import CustomDateRangePicker from './DateRangeFilterDashboard'
import axios from 'axios';

interface DataItem {
    month: string;
    // blocks: number;
    // transactions: number;
    blocks: number;
    transactions: number;
}

interface DualAxisChartProps {
    data: DataItem[]; // Assuming ChartData is a type defined in shared/types
    defaultStartDate: Date;
    defaultEndDate: Date;
  }

const DualAxisChart: React.FC<DualAxisChartProps> = ({ data, defaultStartDate, defaultEndDate }) => {
    // const data: DataItem[] = [
    //     { month: 'January', blocks: Math.random() * 100, transactions: Math.random() * 100 },
    //     { month: 'February', blocks: Math.random() * 100, transactions: Math.random() * 100 },
    //     { month: 'March', blocks: Math.random() * 100, transactions: Math.random() * 100 },
    //     { month: 'April', blocks: Math.random() * 100, transactions: Math.random() * 100 },
    //     { month: 'May', blocks: Math.random() * 100, transactions: Math.random() * 100 },
    //     { month: 'June', blocks: Math.random() * 100, transactions: Math.random() * 100 },
    //     { month: 'July', blocks: Math.random() * 100, transactions: Math.random() * 100 },
    //     { month: 'August', blocks: Math.random() * 100, transactions: Math.random() * 100 },
    //     { month: 'September', blocks: Math.random() * 100, transactions: Math.random() * 100 },
    //     { month: 'October', blocks: Math.random() * 100, transactions: Math.random() * 100 },
    //     { month: 'November', blocks: Math.random() * 100, transactions: Math.random() * 100 },
    //     { month: 'December', blocks: Math.random() * 100, transactions: Math.random() * 100 }
    // ];

        const data1: DataItem[] = [
            { month: 'Jan 2022', blocks: 100, transactions: 800 },
            { month: 'Feb 2022', blocks: 200, transactions: 1190 },
            { month: 'Mar 2022', blocks: 130, transactions: 2000},
            { month: 'Apr 2022', blocks: 837, transactions: 2333 },
            { month: 'May 2022', blocks: 710, transactions: 1222 },
            { month: 'Jun 2022', blocks: 130, transactions: 589 },
            { month: 'Jul 2022', blocks: 1300, transactions: 2900 },
            { month: 'Aug 2022', blocks: 1310, transactions: 2233 },
            { month: 'Sep 2022', blocks: 1300, transactions: 1500 },
            { month: 'Oct 2022', blocks: 410, transactions: 800 },
            { month: 'Nov 2022', blocks: 1320, transactions: 2100 },
            { month: 'Dec 2022', blocks: 1400, transactions: 3200 },
            { month: 'Jan 2023', blocks: 110, transactions: 480 },
            { month: 'Feb 2023', blocks: 4100, transactions: 5000 },
            { month: 'Mar 2023', blocks: 140, transactions: 4980 },
            { month: 'Apr 2023', blocks: 560, transactions: 2500 },
            { month: 'May 2023', blocks: 580, transactions: 600 },
            { month: 'Jun 2023', blocks: 1000, transactions: 2000 },
            { month: 'Jul 2023', blocks: 1500, transactions: 3000 },
            { month: 'Aug 2023', blocks: 2000, transactions: 3000 },
            { month: 'Sep 2023', blocks: 2500, transactions: 4000 },
            { month: 'Oct 2023', blocks: 700, transactions: 3000 },
            { month: 'Nov 2023', blocks: 1800, transactions: 2700 },
            { month: 'Dec 2023', blocks: 1480, transactions: 1600 },
            { month: 'Jan 2024', blocks: 520, transactions: 590 }
            ];


            // const fetchData = async () => {
            //     try {
            //         const response = await axios.post('https://bitcoin-mainnet-archive.allthatnode.com/rCq1MntkCxY9ladFEmAm4Rardg4vWR83', {
            //             jsonrpc: '2.0',
            //             method: 'getblock',
            //             params: ['0000000000000000000090d7ab9e2915f46195fbd4dbec09a088d2e168d667dd', 1],
            //             id: 0,
            //         });
            
            //         return response.data.result; // Assuming the required data is in the "result" property
            //     } catch (error) {
            //         console.error('Error fetching data:', error);
            //         return null;
            //     }
            // };
            
            // // Usage
            // fetchData().then(blockData => {
            //     if (blockData) {
            //         console.log('Block data:', blockData);
            //         // Now you can extract the required details from blockData and use them in your chart
            //     }
            // });
        

            const filterData = (start: string, end: string) => {
        // Parse start and end dates
        const startDate = new Date(start);
        const endDate = new Date(end);
        console.log(startDate)
        console.log(endDate)
        
        // Extract day, month, and year components
        const startDay = startDate.getDate();
        const startMonth = startDate.getMonth();
        const startYear = startDate.getFullYear().toString().slice(-2);
      
        const endDay = endDate.getDate();
        const endMonth = endDate.getMonth();
        const endYear = endDate.getFullYear().toString().slice(-2);
        console.log(`${startDay} ${startMonth} ${startYear}`)
        console.log(`${endDay} ${endMonth} ${endYear}`)
      
        // Filter the data based on the date, month, and year
        const filteredData = data.filter(item => {
          const itemDate = new Date(item.month + ' ' + (startYear < endYear ? startYear : endYear)).getDate();
          const itemMonth = new Date(item.month + ' ' + (startYear < endYear ? startYear : endYear)).getMonth();
          const itemYear = new Date(item.month + ' ' + (startYear < endYear ? startYear : endYear)).getFullYear().toString().slice(-2);
      
          return (
            (itemYear > startYear || (itemYear === startYear && itemMonth > startMonth) || (itemYear === startYear && itemMonth === startMonth && itemDate >= startDay)) &&
            (itemYear < endYear || (itemYear === endYear && itemMonth < endMonth) || (itemYear === endYear && itemMonth === endMonth && itemDate <= endDay))
          );
        });
      
        console.log(filteredData);
        return filteredData;
      };
      
      
      const formatDate = (date: Date): string => {
        const month = date.getDate();
        const month1 = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        console.log(`${month} ${month1} ${year}`);
        return `${month} ${month1} ${year}`;
      };

      data = filterData(formatDate(defaultStartDate), formatDate(defaultEndDate));
      console.log(data);



  

    const svgRef = useRef<SVGSVGElement>(null);
    const scatterplotRef = useRef<SVGSVGElement>(null);
    const width = 1550;
    const height = 400;
    let newData;
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [currentData, setCurrentData] = useState<DataItem[]>(data);
    const [selectedMonths, setSelectedMonths] = useState<string[]>(data.map(item => item.month));


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
            .domain([0, d3.max(data.filter(d => selectedMonths.includes(d.month)), d => d.blocks)! * 1.2])
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
                    .attr('transform', 'rotate(-45)')
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
            .append("text") // Add label for y1 axis
            .attr("x", -margin.left + 10) // Adjust position
            .attr("y", 10)
            .attr("text-anchor", "start")
            .attr("fill", "black")
            .attr("font-size", "15px") // Set font size
            .attr("font-family", "Courier New, Courier, monospace") // Set font family
            .text("Blocks");
    
        svg.append('g')
            .attr('class', 'y-axis-2')
            .attr('transform', `translate(${width - margin.right}, 0)`)
            .call(yAxis2)
            .append("text") // Add label for y2 axis
            .attr("x", margin.right) // Adjust position
            .attr("y", 10) // Adjust position
            .attr("text-anchor", "end")
            .attr("fill", "black")
            .attr("font-size", "15px") // Set font size
            .attr("font-family", "Courier New, Courier, monospace") // Set font family
            .text("Transactions");
    
        svg.selectAll('.bar')
            .data(data.filter(d => selectedMonths.includes(d.month)))
            .join('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.month)! + xCenterOffset)
            .attr('y', d => yScale1(d.blocks))
            .attr('width', barWidth)
            .attr('height', d => height - margin.bottom - yScale1(d.blocks))
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
                let hasData = false; // Flag to track if data points are included in the brushing
            
                xScale.domain().forEach(category => {
                    const xPos = xScale(category)! + xScale.bandwidth() / 2;
                    const x0Value = Array.isArray(x0) ? x0[0] : x0;
                    const x1Value = Array.isArray(x1) ? x1[0] : x1;
                    if (xPos >= x0Value && xPos <= x1Value) {
                        selectedCategories.push(category);
                        hasData = true; // Set the flag to true if data points are included
                    }
                });
            
                if (hasData) {
                    const filteredData = data.filter(d => selectedCategories.includes(d.month));
                    setFilteredData(filteredData);
                    setIsModalOpen(true);
                } else {
                    // If no data points are included, do nothing
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
            .domain([d3.min(filteredData, d => d.transactions)! - 10000, d3.max(filteredData, d => d.transactions)! * 1.1])
            .range([margin.left, scatterWidth - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(filteredData, d => d.blocks)! - 10, d3.max(filteredData, d => d.blocks)! * 1.1])
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
            .y(d => yScale(d.blocks))
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
            .attr('cy', d => yScale(d.blocks))
            .attr('r', 4)
            .style('fill', '#d0b693');

        scatterplotSvg.selectAll('.dot-label')
            .data(filteredData)
            .enter().append('text')
            .attr('class', 'dot-label')
            .attr('x', d => xScale(d.transactions) + 5)
            .attr('y', d => yScale(d.blocks) - 5)
            .text(d => d.month)
            .style('fill', 'black')
            .style('font-size', '12px')
            .style('text-anchor', 'start'); // Ensure text is anchored to the start of the label

            // Append y-axis label
        scatterplotSvg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -(scatterHeight / 2))
            .attr('y', margin.left - 40)
            .style('fill', 'black')
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .text('Blocks');

            // Append x-axis label
        scatterplotSvg.append('text')
            .attr('x', scatterWidth / 2)
            .attr('y', scatterHeight - margin.bottom + 40)
            .style('fill', 'black')
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .text('Transactions');
    }, [filteredData]);

    useEffect(() => {
        // Load initial data
        setFilteredData(data);
    }, []);

    return (
        <>
        {/* style={{ position: 'absolute', left: '50%', bottom: '25%', transform: 'translateX(-50%)' }} */}
   
            {/* <div style={{paddingLeft: '700px', paddingBottom: '50px'}}>
            </div> */}
            <div style = {{paddingTop:'20px'}}>
            <svg ref={svgRef} width={width} height={height}  style={{ position: 'absolute', left: '51%', transform: 'translateX(-50%)',  width: '95%', height:'48%' }}>
                {/* Bar chart legend */}
            <rect x={width / 2 - 150} y={10} width={20} height={20} fill="#d0b693" />
            <text x={width / 2 - 120} y={25} fontSize="14px" fontFamily="Arial" fill="black">Transactions</text>

            {/* Line chart legend */}
            <line x1={width / 2 + 20} y1={20} x2={width / 2 + 50} y2={20} stroke="#e26a66" strokeWidth={2} />
            <circle cx={width / 2 + 35} cy={20} r={4} fill="#e26a66" />
            <text x={width / 2 + 60} y={25} fontSize="14px" fontFamily="Arial" fill="black">Blocks</text>

            </svg>
            </div>
            <div style={{paddingLeft: '80px',paddingTop:'450px', paddingBottom: '10px'}}>
            <FilterDashboard months={data.map(item => item.month)} onFilterChange={handleFilterChange} />
            </div>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                    <div className="modal-header">Number of Blocks vs Transactions (Connected Scatterplot)</div>
                        <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}><CloseButton/></button>
                        <div style={{ display: 'flex' }}>
                            <svg ref={scatterplotRef} width={800} height={400}>
                            </svg>
                            <div style={{paddingTop: 40}}>
                                <ul>
                                    {filteredData.map(item => (
                                        <li key={item.month}>{item.month}: blocks - {item.blocks}, transactions - {item.transactions}</li>
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