let questionNum = Number(sessionStorage.getItem('questionNum')) || 0;
let plane;
let svg;
const questions = {
    "Your mission begins before sunrise in Charlotte, North Carolina. But this first flight won't take you all the way to your final destination — just to your first stop on the trail. Select the state where you layover will take you?": "TX",
    "You're flying over a land of red rocks, slick canyons, and famous parks like Zion and Arches. But this isn't quite cowboy country just yet…Which state are you crossing?": "UT",
    "As you cross the high plains, you spot roaming bison and snow-capped peaks on the horizon. This state's capital is Cheyenne.": "WY",
    "Your intel shows another rugged state just north of where you're headed — known for Glacier National Park and the nickname Big Sky Country.": "MT",
    "You've traced the trail deep into cowboy country. Towering above your final destination is one of the most famous peaks in the American West. Which mountain range are you closing in on?": "tetons",
    "You've followed the trail across the West and into the Tetons region. Select the area where your mission ends — this is your final destination.": "Jackson Hole, WY"
};

function getID(id) { return document.getElementById(id); }

main();

function main() {
    console.log("Quiz script loaded.");
    insertUS_SVG().then(() => {
        console.log("SVG and plane ready — restoring map state...");
        restoreMapState();
    });
}

function insertUS_SVG() {
    console.log("Inserting US SVG...");
    return fetch("../images/svg/us.svg")
        .then(res => res.text())
        .then(svgContent => {
            document.getElementById("map-container").innerHTML = svgContent;
            svg = document.querySelector("#map-container svg");

            addStateTooltips();

            // Create plane
            plane = document.createElementNS("http://www.w3.org/2000/svg", "text");
            plane.setAttribute("id", "plane");
            plane.setAttribute("font-size", "48");
            plane.textContent = "✈️";
            plane.setAttribute("text-anchor", "middle");
            plane.setAttribute("alignment-baseline", "middle");
            svg.appendChild(plane);

            // Add click listeners for states
            document.querySelectorAll('.regular').forEach(path => {
                path.addEventListener('click', handleStateClick);
            });

            console.log("SVG inserted and plane added.");
        });
}


function restoreMapState() {
    console.log("Restoring map state...");
    questionNum = Number(sessionStorage.getItem("questionNum")) || 0;
    console.log("Restored questionNum:", questionNum);
    getID("question").innerText = Object.keys(questions)[questionNum] || "";

    const svg = document.querySelector("#map-container svg");

    // Then adjust based on the current question
    switch (questionNum) {
        case 0:
            // Charlotte position
            const planeX = 850;
            const planeY = 315;
            plane.setAttribute("x", planeX);
            plane.setAttribute("y", planeY);
            plane.setAttribute("transform", `rotate(220 ${planeX} ${planeY})`);
            insertMapEmojis(svg)
            fadeInEmojis()
            break;

        case 1:
            // Texas position
            questionOne();
            insertMapEmojis(svg)
            break;

        case 2:
            insertMapEmojis(svg)
            questionTwo();
            break;

        case 3:
            insertMapEmojis(svg)
            questionThree();
            break;

        case 4:
            insertMapEmojis(svg)
            questionFour();
            break;

        case 5:
            questionFive();
            break;
    }
}


function markStateCorrect(stateId) {
    const path = document.getElementById(stateId);
    if (path) path.classList.add("correct");
}

function unmarkStates(stateIds) {
    stateIds.forEach(stateId => {
        // Remove the 'correct' class from the SVG path
        const path = document.getElementById(stateId);
        if (path) path.classList.remove("correct");

    });
}

function nextQuestion() {
    questionNum++;
    sessionStorage.setItem('questionNum', questionNum);
    getID('question').innerText = Object.keys(questions)[questionNum];
}

function questionOne() {
    // Move plane to TX
    const newX = 600;
    const newY = 400;
    plane.setAttribute("x", newX);
    plane.setAttribute("y", newY);
    plane.setAttribute("transform", `rotate(250 ${newX} ${newY})`);
}

function questionTwo() {
    questionOne(); // Ensure plane is in TX
    markStateCorrect("UT");
}

function questionThree() {
    questionTwo();
    markStateCorrect("WY");
}

function questionFour() {
    console.log("Executing questionFour zoom...");
    questionThree();
    markStateCorrect("MT");

    const svg = document.getElementById("svg");
    if (!svg) return console.error("SVG not found");

    const viewBox = "200 25 300 300"; // x y width height
    svg.setAttribute("viewBox", viewBox);


    updateStatesForZoomedView(["WY", "MT", "UT"]);
}

function questionFive() {
    const svg = document.querySelector("#map-container svg");
    if (!svg) return console.error("SVG not found");

    // 🔹 Instantly set Wyoming viewBox (no animation)
    const viewBox = "325 115 150 150";
    svg.setAttribute("viewBox", viewBox);

    showJacksonHoleHotspot();
    onlyWyoming(["UT", "MT"])
    unmarkStates(["UT", "MT"]);
    markStateCorrect("WY");
    updateStatesForZoomedView(["WY"]);
    fadeOutEmojis()
}

function handleStateClick(event) {
    const clickedPath = event.target;
    const stateId = clickedPath.id;

    if (questionNum === 0) {
        const correctAnswer = questions[Object.keys(questions)[questionNum]];
        if (stateId === correctAnswer) {
            alert("That's right, partner — you'll touch down in Dallas, Texas for a quick pit stop before heading deeper into cowboy country.");
            nextQuestion(); // Increments questionNum, updates storage, and question text
            questionOne(); // Moves plane to TX
        } else {
            window.location.href = "wrong.html";
        }
    } else if (questionNum === 1) {
        const correctAnswer = questions[Object.keys(questions)[questionNum]];
        
        if (stateId === correctAnswer) {
            alert("You've got sharp eyes, agent — that's Utah down below. Keep heading north toward wilder lands…");
            nextQuestion();
            questionTwo();
        } else {
            window.location.href = "wrong.html";
        }
    } else if (questionNum === 2) {
        const correctAnswer = questions[Object.keys(questions)[questionNum]];
        
        if (stateId === correctAnswer) {
            alert("That's right — you've entered the wild heart of the West: Wyoming. Your final target is close…");
            nextQuestion();
            questionThree();
        } else {
            window.location.href = "wrong.html";
        }
    } else if (questionNum === 3) {
        const correctAnswer = questions[Object.keys(questions)[questionNum]];
        
        if (stateId === correctAnswer) {
            alert("You're good, Cowboy — that's Montana up north. But your mission lies just below those peaks…");
            nextQuestion();
            markStateCorrect("MT");
            const svg = document.getElementById("svg");
            const startViewBox = { x: 0, y: 0, width: 1000, height: 600 };
            const endViewBox = { x: 200, y: 25, width: 300, height: 300 };
            animateZoom(svg, startViewBox, endViewBox, 2000); // 2 second zoom
            updateStatesForZoomedView(["WY", "MT", "UT"]);
        } else {
            window.location.href = "wrong.html";
        }
    } else if (questionNum === 4) {
        const correctAnswer = questions[Object.keys(questions)[questionNum]];
        if (stateId.toLowerCase() === correctAnswer.toLowerCase()) {
            alert("You've successfully navigated the cowboy trail to the Tetons. Time to gear up for the next adventure.");
            nextQuestion();
            // Zoom into Wyoming
            zoomToWyoming()
            questionFive();
        } else {
            window.location.href = "wrong.html";
        }
    } else if (questionNum === 5) {
        const correctAnswer = questions[Object.keys(questions)[questionNum]];
        if (stateId === correctAnswer) {
            alert("Mission accomplished, agent! You've reached your final destination in Jackson Hole, Wyoming. Your mission is complete.");
            questionNum++;
            sessionStorage.setItem('questionNum', questionNum);
            window.location.href = "gameover.html";
        } else {
            window.location.href = "wrong.html";
        }
    }
}

function animateZoom(svg, startViewBox, endViewBox, duration = 2000, callback) {
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = (timestamp - startTime) / duration;
        if (progress > 1) progress = 1;

        // Linear interpolation for smooth zoom
        let currentX = startViewBox.x + (endViewBox.x - startViewBox.x) * progress;
        let currentY = startViewBox.y + (endViewBox.y - startViewBox.y) * progress;
        let currentWidth = startViewBox.width + (endViewBox.width - startViewBox.width) * progress;
        let currentHeight = startViewBox.height + (endViewBox.height - startViewBox.height) * progress;

        svg.setAttribute("viewBox", `${currentX} ${currentY} ${currentWidth} ${currentHeight}`);

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            svg.setAttribute("viewBox", `${endViewBox.x} ${endViewBox.y} ${endViewBox.width} ${endViewBox.height}`);
            if (callback) callback(); // Optional callback for post-zoom logic
        }
    }
    requestAnimationFrame(step);
}

function zoomToWyoming(duration = 2000) {
    const svg = document.querySelector("#map-container svg");
    if (!svg) return;

    let viewBox = svg.getAttribute("viewBox");
    let startViewBox;
    if (viewBox) {
        const parts = viewBox.split(" ").map(Number);
        startViewBox = { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
    } else {
        startViewBox = { x: 0, y: 0, width: 1000, height: 600 };
    }

    const endViewBox = { x: 325, y: 115, width: 150, height: 150 };

    // ✅ Pass a callback to confirm saving finished before navigation
    animateZoom(svg, startViewBox, endViewBox, duration, () => {
        console.log("Zoom to Wyoming complete — map state saved.");
    });
}

function resetQuiz() {
    // Reset question number
    questionNum = 0;
    sessionStorage.setItem('questionNum', questionNum);

    // Reset plane location to Charlotte
    const charlotteX = 850;
    const charlotteY = 315;

    getID('question').innerText = Object.keys(questions)[questionNum];

    // Update plane position if it exists on the map
    if (plane) {
        plane.setAttribute("x", charlotteX);
        plane.setAttribute("y", charlotteY);
        plane.setAttribute("transform", `rotate(220 ${charlotteX} ${charlotteY})`);
    }

    // Remove 'correct' class from all states on the map
    document.querySelectorAll('.regular').forEach(path => {
        path.classList.remove("correct");
    });

    // Reset SVG zoom/viewBox to full map
    const svg = document.querySelector("#map-container svg");
    if (svg) {
        svg.setAttribute("viewBox", "0 0 1000 600"); // adjust to your full map dimensions
    }
    insertMapEmojis(svg);
    fadeInEmojis()
    removeJacksonHoleHotspot()
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
        point.setAttribute("class", "emoji");
        point.textContent = m.emoji;

        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = m.label;
        point.appendChild(title);

        svg.appendChild(point);
    });

    document.querySelectorAll('.regular, .emoji').forEach(el => {
        el.addEventListener('click', handleStateClick);
    });

}

function showJacksonHoleHotspot() {
    console.log("Showing Jackson Hole hotspot...");
    const svg = document.querySelector("#map-container svg");
    if (!svg) return;

    // Create invisible Jackson Hole hotspot
    const jacksonHole = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    jacksonHole.setAttribute("id", "jacksonhole");
    jacksonHole.setAttribute("cx", 375);
    jacksonHole.setAttribute("cy", 175);
    jacksonHole.setAttribute("r", 15);
    jacksonHole.setAttribute("fill", "transparent");
    // jacksonHole.setAttribute("stroke", "transparent");
    jacksonHole.setAttribute("stroke", "pink");
    jacksonHole.setAttribute("cursor", "pointer");

    jacksonHole.addEventListener("click", () => {
        if (questionNum === 5) {
            alert("Mission accomplished, agent! You've reached your final destination in Jackson Hole, Wyoming. Your mission is complete.");
            questionNum++;
            sessionStorage.setItem('questionNum', questionNum);
            window.location.href = "gameover.html";
        }
    });

    svg.appendChild(jacksonHole);
}

function removeJacksonHoleHotspot() {
    const jacksonHole = document.getElementById("jacksonhole");
    if (jacksonHole) {
        jacksonHole.remove();
        console.log("Jackson Hole hotspot removed.");
    } else {
        console.log("No Jackson Hole hotspot found to remove.");
    }
}



// Add tooltips to all states dynamically
function addStateTooltips() {
    const states = document.querySelectorAll('#map-container svg path');

    states.forEach(state => {
        const name = state.getAttribute('data-name') || state.id;

        // Only add title if it doesn't already exist
        if (!state.querySelector('title')) {
            const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
            title.textContent = name;
            state.appendChild(title);
        }
    });
}

function updateStatesForZoomedView(statesToHighlight) {
    // Remove 'regular' class from all states
    document.querySelectorAll('#map-container svg path.regular').forEach(state => {
        state.classList.remove('regular-hover');
    });

    // Add 'zoomed-in-state' class only to selected states
    statesToHighlight.forEach(stateId => {
        const state = document.getElementById(stateId);
        if (state) {
            state.classList.add('zoomed-in-state');
        }
    });
}

function fadeOutEmojis() {
  const emojis = document.querySelectorAll(".emoji");
  emojis.forEach(emoji => {
    emoji.classList.add("hidden");
  });
}

function fadeInEmojis() {
  const emojis = document.querySelectorAll(".emoji");
  emojis.forEach(emoji => {
    emoji.classList.remove("hidden");
  });
}

function onlyWyoming(stateIds) {
    stateIds.forEach(stateId => {
        console.log("Removing zoomed-in-state from:", stateId);
        const path = document.getElementById(stateId);
        if (path && path.classList.contains("zoomed-in-state")) {
            path.classList.remove("zoomed-in-state");
        }
    });
}





