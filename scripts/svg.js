insertUS_SVG();

function insertUS_SVG() {
    fetch("../images/svg/us.svg")
    .then(res => res.text())
    .then(svgContent => {
        document.getElementById("map-container").innerHTML = svgContent;

        // Once inserted, you can query the SVG just like inline elements
        const svg = document.querySelector("#map-container svg");

        // plane emoji
        const plane = document.createElementNS("http://www.w3.org/2000/svg","text");
        plane.setAttribute("id","plane");
        plane.setAttribute("font-size","24");
        plane.textContent = "✈️";
        svg.appendChild(plane);

        // route path
        const route = document.createElementNS("http://www.w3.org/2000/svg","path");
        route.setAttribute("id","route");
        route.setAttribute("stroke","red");
        route.setAttribute("fill","none");
        svg.appendChild(route);

        // cities
        const cities = [
        { id: "nyc", name: "NYC", cx: 300, cy: 220, labelX: 315, labelY: 215 },
        { id: "la", name: "LA", cx: 150, cy: 450, labelX: 165, labelY: 445 },
        { id: "chi", name: "Chicago", cx: 550, cy: 200, labelX: 565, labelY: 195 }
        ];

        cities.forEach(city => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("id", city.id);
        circle.setAttribute("class", "city");
        circle.setAttribute("cx", city.cx);
        circle.setAttribute("cy", city.cy);
        circle.setAttribute("r", 8);
        svg.appendChild(circle);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", city.labelX);
        label.setAttribute("y", city.labelY);
        label.setAttribute("font-size", "14");
        label.setAttribute("fill", "#333");
        label.textContent = city.name;
        svg.appendChild(label);
        });

        // Define the SVG path strings between city pairs
        const routes = {
        nyc_la: "M300,220 C200,300 120,400 150,450",
        la_chi: "M150,450 C300,350 500,300 550,200",
        chi_nyc: "M550,200 C480,120 350,150 300,220"
        };

        function flyAlong(pathStr) {
        // Set the route path
        route.setAttribute("d", pathStr);

        // Apply offset-path to the plane
        plane.style.offsetPath = `path("${pathStr}")`;

        // Trigger the animation
        plane.classList.remove("flying");
        // Force reflow to restart animation
        void plane.offsetWidth;
        plane.classList.add("flying");
        }

        // Event listeners
        document.getElementById("nyc").addEventListener("click", () => {
        flyAlong(routes.nyc_la);
        });
        document.getElementById("la").addEventListener("click", () => {
        flyAlong(routes.la_chi);
        });
        document.getElementById("chi").addEventListener("click", () => {
        flyAlong(routes.chi_nyc);
        });
    });
}