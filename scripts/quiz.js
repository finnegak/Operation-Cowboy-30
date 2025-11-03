// Global variables
let questionNum = Number(sessionStorage.getItem('questionNum')) || 0;
let plane; // globally accessible plane element

const questions = {
    "Your mission begins before sunrise in Charlotte, North Carolina. But this first flight won't take you all the way to your final destination — just to your first stop on the trail. Where will your layover take you?": "TX",
    "You’re flying over a land of red rocks, slick canyons, and famous parks like Zion and Arches. But this isn’t quite cowboy country just yet…Which state are you crossing?": "UT",
    "Select the state where the layover is with the airport code of DFW": "TX",
    "Select the region of the US where your destination is located": "West"
};

// Helper
function getID(id) { return document.getElementById(id); }

// Start quiz
firstQuestion();

function firstQuestion() {
    getID('question').innerText = Object.keys(questions)[questionNum];
    insertUS_SVG();
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
            const path = document.getElementById("UT");
            path.classList.add("correct");
        } else {
            window.location.href = "wrong.html";
        }
    }
}

// Insert SVG and plane
function insertUS_SVG() {
    fetch("../images/svg/us.svg")
        .then(res => res.text())
        .then(svgContent => {
            document.getElementById("map-container").innerHTML = svgContent;
            const svg = document.querySelector("#map-container svg");

            // Create plane if it doesn't exist
            plane = document.createElementNS("http://www.w3.org/2000/svg","text");
            plane.setAttribute("id","plane");
            plane.setAttribute("font-size","24");
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
    const charlotteX = 850; // default Charlotte X
    const charlotteY = 315; // default Charlotte Y
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

    alert("Quiz has been reset!");
}