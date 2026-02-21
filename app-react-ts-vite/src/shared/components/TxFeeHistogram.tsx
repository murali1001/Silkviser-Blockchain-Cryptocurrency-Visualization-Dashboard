import * as d3 from 'd3';
import { useRef, useEffect } from 'react';

// interface transactionInfo {
//     txFee: number;
//     numOfTransactions: number;
// }

interface Transaction {
    id: number;
    txfee: number;
}

const TxFeeHistogram = ({ transactions, onSelectTransactions }: { transactions: Transaction[], onSelectTransactions: (selectedTransactions: Transaction[]) => void }) => {
    const data: number[] = transactions.map(transaction => transaction.txfee * 1000);
    console.log(data)
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        d3.select<SVGSVGElement, Transaction[]>(ref.current).selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 50, left: 50 },
            width = 500 - margin.left - margin.right,
            height = 180 - margin.bottom - margin.top;

        const svg = d3.select<SVGSVGElement, Transaction[]>(ref.current)
            .append("svg")
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const xScale = d3.scaleLinear()
            .domain([d3.min(data)!, d3.max(data)!]).nice()
            .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).ticks(5));

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("y", height + 20)
            .attr("x", width - margin.right)
            .attr("dy", ".75em")
            .text("TxFee/1000 (BTC)")
            .style("fill", "black")

        const histogram = d3.bin<number, number>()
            .domain(xScale.domain() as [number, number])
            .thresholds(xScale.ticks(25));

        const bins = histogram(data);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)!])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(yScale).ticks(3));

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 0 - margin.top)
            .attr("x", margin.left + 20)
            .attr("dy", ".75em")
            .text("Transactions")
            .style("fill", "black")

        svg.selectAll("rect")
            .data(bins)
            .enter().append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + xScale(d.x0!) + "," + yScale(d.length) + ")"; })
            .attr("width", function(d) { return Math.max(0, xScale(d.x1!) - xScale(d.x0!) - 1); })
            .attr("height", function(d) { return height - yScale(d.length); })
            .style("fill", "#d0b693");
            
        svg.call(d3.brushX<Transaction[]>()
            .extent([[0, 0], [width, height]])
            .on("end", ({selection}) => {
            if (!selection) return;
            console.log(selection);
            const [x0, x1] = selection.map(xScale.invert);
            // const selectedBars = data.filter(d => x0 <= d.txFee && d.txFee <= x1);
            const selectedTransactions = transactions.filter(transaction => {
                return transaction.txfee * 1000 >= x0 && transaction.txfee * 1000 <= x1;
            });
            console.log("Selected Bars:", selectedTransactions);
            onSelectTransactions(selectedTransactions); // Call onSelectTransactions with selected transactions
        }));
    }, [data]);

    return (<svg ref={ref} width={550} height={200} id="txFeeHistogram"></svg>);
};

export default TxFeeHistogram;