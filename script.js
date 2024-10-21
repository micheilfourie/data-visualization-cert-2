document.addEventListener("DOMContentLoaded", () => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
        .then(response => response.json())
        .then(data => {

            console.log(JSON.stringify(data, null, 2));
            console.log(data[1]);

            d3.select("body").append("h1").text("Doping in Professional Bicycle Racing").attr("id", "title");
            d3.select("body").append("h2").text("35 Fastest times up Alpe d'Huez");

            const width = 1000;
            const height = 500;
            const padding = 50;
            const xOffset = 80;

            function minToSeconds(time) {
                const parts = time.split(":");
                return parseInt(parts[0]) * 60 + parseInt(parts[1]);
            }

            function secondsToMin(seconds) {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
            }

            const xScale = d3.scaleLinear()
                .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1])
                .range([padding, width - padding]);

            const yScale = d3.scaleLinear()
                .domain([d3.min(data, d => minToSeconds(d.Time)) - 10, d3.max(data, d => minToSeconds(d.Time)) + 2])
                .range([height - padding, padding]);

            const svg = d3.select("body")
                .append("svg")
                .attr("width", width + xOffset)
                .attr("height", height)
                .style("margin-top", "50px")

            const xAxis = d3.axisBottom(xScale)
                .tickFormat(d => d);

            const yAxis = d3.axisLeft(yScale)
                .tickFormat(d => secondsToMin(d));

            svg.append("g")
                .attr("transform", `translate(${xOffset}, ${height - padding})`)
                .style("font-size", "15px")
                .attr("id", "x-axis")
                .call(xAxis)

            svg.append("g")
                .attr("transform", `translate(${padding + xOffset}, 0)`)
                .style("font-size", "15px")
                .attr("id", "y-axis")
                .call(yAxis);

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", padding - 20)
                .attr("x", -height / 2)
                .attr("dy", "1em")
                .style("font-size", "22px")
                .style("text-anchor", "middle")
                .text("Time in Minutes");

            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", d => xScale(d.Year) + xOffset)
                .attr("cy", d => yScale(minToSeconds(d.Time)))
                .attr("data-xvalue", d => d.Year)
                .attr("data-yvalue", d => minToSeconds(d.Time))
                .attr("r", 5)
                .attr("fill", d => d.Doping ? "blue" : "orange")
                .attr("opacity", "0.7")
                .on("mouseover", onMouseOver)
                .on("mouseout", onMouseOut)

            svg.append("text")
                .attr("x", width - 30)
                .attr("y", height / 2 + 50)
                .attr("text-anchor", "end")
                .style("font-size", "12px")
                .text("No doping allegations");

            svg.append("rect")
                .attr("x", width - 20)
                .attr("y", height / 2 + 39)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", "orange")
                .attr("opacity", "0.7")

            svg.append("text")
                .attr("x", width - 30)
                .attr("y", height / 2 + 75)
                .attr("text-anchor", "end")
                .style("font-size", "12px")
                .text("Riders with doping allegations");

            svg.append("rect")
                .attr("x", width - 20)
                .attr("y", height / 2 + 64)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", "blue")
                .attr("opacity", "0.7");

            const tooltip = d3.select("body")
                .append("div")
                .attr("id", "tooltip")

            function onMouseOver(event, d) {
                const name = d.Name;
                const nationality = d.Nationality;
                const year = d.Year;
                const time = secondsToMin(minToSeconds(d.Time));
                const doping = d.Doping;
                const x = event.clientX + 10;
                const y = event.clientY + 10;
                tooltip
                    .style("display", "block")
                    .style("left", `${x}px`)
                    .style("top", `${y}px`)
                    .html(`${name}: ${nationality}<br/>Year: ${year}, Time: ${time}${doping ? "<br/><br/>" + doping : ""}`)
            }

            function onMouseOut() {
                tooltip
                    .style("display", "none")
            }
        })

})
