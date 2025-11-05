let questionNum = Number(sessionStorage.getItem('questionNum')) || 0;
let plane;

const questions = {
    "Your mission begins before sunrise in Charlotte, North Carolina. But this first flight won't take you all the way to your final destination — just to your first stop on the trail. Where will your layover take you?": "TX",
    "You're flying over a land of red rocks, slick canyons, and famous parks like Zion and Arches. But this isn't quite cowboy country just yet…Which state are you crossing?": "UT",
    "As you cross the high plains, you spot roaming bison and snow-capped peaks on the horizon. This state's capital is Cheyenne.": "WY",
    "Your intel shows another rugged state just north of where you're headed — known for Glacier National Park and the nickname Big Sky Country.": "MT"
};

function getID(id) { return document.getElementById(id); }

firstQuestion();

function firstQuestion() {
    getID('question').innerText = Object.keys(questions)[questionNum];
    insertUS_SVG();
}

function markStateCorrect(stateId) {
    // Get saved green states from sessionStorage (or empty array)
    let greenStates = JSON.parse(sessionStorage.getItem("greenStates")) || [];

    // Add the state if not already in array
    if (!greenStates.includes(stateId)) {
        greenStates.push(stateId);
    }

    // Save back to sessionStorage
    sessionStorage.setItem("greenStates", JSON.stringify(greenStates));

    // Add the 'correct' class to visually highlight
    const path = document.getElementById(stateId);
    if (path) path.classList.add("correct");
}

function restoreGreenStates() {
    const greenStates = JSON.parse(sessionStorage.getItem("greenStates")) || [];
    greenStates.forEach(stateId => {
        const path = document.getElementById(stateId);
        if (path) path.classList.add("correct");
    });
}

// Handle state clicks
function handleStateClick(event) {
    const clickedPath = event.target;
    const stateId = clickedPath.id;

    if (questionNum === 0) {
        const correctAnswer = questions[Object.keys(questions)[questionNum]];

        if (stateId === correctAnswer) {
            alert("That's right, partner — you’ll touch down in Dallas for a quick pit stop before heading deeper into cowboy country.");

            questionNum++;
            sessionStorage.setItem('questionNum', questionNum);
            getID('question').innerText = Object.keys(questions)[questionNum];

            // Move plane to TX
            const newX = 600;
            const newY = 400;
            plane.setAttribute("x", newX);
            plane.setAttribute("y", newY);
            plane.setAttribute("transform", `rotate(250 ${newX} ${newY})`);
            sessionStorage.setItem("planeX", newX);
            sessionStorage.setItem("planeY", newY);

        } else {
            window.location.href = "wrong.html";
        }
    } else if (questionNum === 1) {
        const correctAnswer = questions[Object.keys(questions)[questionNum]];
        
        if (stateId === correctAnswer) {
            alert("You've got sharp eyes, agent — that's Utah down below. Keep heading north toward wilder lands…");
            questionNum++;
            sessionStorage.setItem('questionNum', questionNum);
            getID('question').innerText = Object.keys(questions)[questionNum];
            markStateCorrect("UT");
        } else {
            window.location.href = "wrong.html";
        }
    } else if (questionNum === 2) {
        const correctAnswer = questions[Object.keys(questions)[questionNum]];
        
        if (stateId === correctAnswer) {
            alert("That's right — you've entered the wild heart of the West: Wyoming. Your final target is close…");
            questionNum++;
            sessionStorage.setItem('questionNum', questionNum);
            getID('question').innerText = Object.keys(questions)[questionNum];
            markStateCorrect("WY");

        } else {
            window.location.href = "wrong.html";
        }
    } else if (questionNum === 3) {
        const correctAnswer = questions[Object.keys(questions)[questionNum]];
        
        if (stateId === correctAnswer) {
            alert("You’re good, Cowboy — that's Montana up north. But your mission lies just below those peaks…");
            questionNum++;
            sessionStorage.setItem('questionNum', questionNum);
            getID('question').innerText = Object.keys(questions)[questionNum];
            markStateCorrect("MT");

            // zoom into UT, MT, WY area for final reveal
            const svg = document.getElementById("svg");
            // viewBox format: min-x, min-y, width, height
            // svg.setAttribute("viewBox", "200 25 300 300"); // tweak values to frame WY, MT, UT

                // Full US viewBox (current) - tweak if needed
            const startViewBox = { x: 0, y: 0, width: 1000, height: 600 };
            // Zoomed-in viewBox around WY, MT, UT - tweak to fit your map
            const endViewBox = { x: 200, y: 25, width: 300, height: 300 };

            animateZoom(svg, startViewBox, endViewBox, 2000); // 2 second zoom

        } else {
            window.location.href = "wrong.html";
        }
    }
}

function animateZoom(svg, startViewBox, endViewBox, duration = 2000) {
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = (timestamp - startTime) / duration;
        if (progress > 1) progress = 1;

        // Linear interpolation
        let currentX = startViewBox.x + (endViewBox.x - startViewBox.x) * progress;
        let currentY = startViewBox.y + (endViewBox.y - startViewBox.y) * progress;
        let currentWidth = startViewBox.width + (endViewBox.width - startViewBox.width) * progress;
        let currentHeight = startViewBox.height + (endViewBox.height - startViewBox.height) * progress;

        svg.setAttribute("viewBox", `${currentX} ${currentY} ${currentWidth} ${currentHeight}`);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}


// Insert SVG and plane
function insertUS_SVG() {
    fetch("../images/svg/us.svg")
        .then(res => res.text())
        .then(svgContent => {
            document.getElementById("map-container").innerHTML = svgContent;
            const svg = document.querySelector("#map-container svg");

            // Restore green states
            restoreGreenStates();

            addStateTooltips();

            // Create plane if it doesn't exist
            plane = document.createElementNS("http://www.w3.org/2000/svg","text");
            plane.setAttribute("id","plane");
            plane.setAttribute("font-size", "48");
            plane.textContent = "✈️";
            plane.setAttribute("text-anchor", "middle");
            plane.setAttribute("alignment-baseline", "middle");

            // Restore plane position from sessionStorage or default
            const planeX = Number(sessionStorage.getItem("planeX")) || 850;
            const planeY = Number(sessionStorage.getItem("planeY")) || 315;
            plane.setAttribute("x", planeX);
            plane.setAttribute("y", planeY);
            plane.setAttribute("transform", `rotate(220 ${planeX} ${planeY})`);

            svg.appendChild(plane);

            insertMapEmojis(svg)

            // Add click listeners for states
            document.querySelectorAll('.regular').forEach(path => {
                path.addEventListener('click', handleStateClick);
            });
        });
}

function resetQuiz() {
    // Reset question number
    questionNum = 0;
    sessionStorage.setItem('questionNum', questionNum);

    // Reset plane location to Charlotte
    const charlotteX = 850;
    const charlotteY = 315;
    sessionStorage.setItem('planeX', charlotteX);
    sessionStorage.setItem('planeY', charlotteY);

    // Update question text
    getID('question').innerText = Object.keys(questions)[questionNum];

    // Update plane position if it exists on the map
    if (plane) {
        plane.setAttribute("x", charlotteX);
        plane.setAttribute("y", charlotteY);
        plane.setAttribute("transform", `rotate(220 ${charlotteX} ${charlotteY})`);
    }

    // Clear green states from sessionStorage
    sessionStorage.removeItem("greenStates");

    // Remove 'correct' class from all states on the map
    document.querySelectorAll('.regular').forEach(path => {
        path.classList.remove("correct");
    });

    // Reset SVG zoom/viewBox to full map
    const svg = document.querySelector("#map-container svg");
    if (svg) {
        svg.setAttribute("viewBox", "0 0 1000 600"); // adjust to your full map dimensions
    }

    alert("Quiz has been reset!");
}

function insertMapEmojis(svg) {
    const landmarks = [
        // West Coast
        { id: "goldenGate", emoji: "🌉", x: 160, y: 250, label: "Golden Gate Bridge (San Francisco, CA)" },
        { id: "hollywood", emoji: "🎬", x: 180, y: 320, label: "Hollywood (Los Angeles, CA)" },
        
        // Southwest
        { id: "grandCanyon", emoji: "🏜️", x: 325, y: 350, label: "Grand Canyon (Arizona)" },
        { id: "alamo", emoji: "🤠", x: 550, y: 450, label: "The Alamo (San Antonio, TX)" },

        // Mountain West
        { id: "rockies", emoji: "🏔️", x: 425, y: 275, label: "The Rockies (Colorado)" },
        { id: "tetons", emoji: "🗻", x: 365, y: 185, label: "The Tetons (Wyoming)" },
        { id: "yellowstone", emoji: "🦬", x: 365, y: 155, label: "Yellowstone National Park (Wyoming/Montana)" },
        
        // Midwest
        { id: "chicago", emoji: "🏙️", x: 685, y: 210, label: "Chicago, Illinois" },

        // South / Southeast
        { id: "nashville", emoji: "🎸", x: 730, y: 330, label: "Nashville, Tennessee" },
        { id: "orlando", emoji: "🎢", x: 845, y: 480, label: "Orlando, Florida" },

        // Northeast
        { id: "statueLiberty", emoji: "🗽", x: 890, y: 165, label: "Statue of Liberty (New York City)" },
        { id: "dc", emoji: "🏛️", x: 870, y: 230, label: "Washington, D.C." },
    ];

    landmarks.forEach(m => {
        const point = document.createElementNS("http://www.w3.org/2000/svg", "text");
        point.setAttribute("id", m.id);
        point.setAttribute("x", m.x);
        point.setAttribute("y", m.y);
        point.setAttribute("font-size", "24");
        point.setAttribute("cursor", "pointer");
        point.setAttribute("class", "emoji"); // 👈 Added class here
        point.textContent = m.emoji;

        // Tooltip (hover label)
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = m.label;
        point.appendChild(title);

        // Click event
        point.addEventListener("click", () => {
            alert(`You clicked on ${m.label}!`);
        });

        svg.appendChild(point);
    });
}

// Add tooltips to all states dynamically
function addStateTooltips() {
    const states = document.querySelectorAll('#map-container svg path');

    states.forEach(state => {
        // Use data-name if available, otherwise fallback to id
        const name = state.getAttribute('data-name') || state.id;

        // Only add title if it doesn't already exist
        if (!state.querySelector('title')) {
            const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = name;
            state.appendChild(title);
        }
    });
}



