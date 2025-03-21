console.clear();

// Helper functions
const select = e => document.querySelector(e);
const selectAll = e => document.querySelectorAll(e);

const stage = select('.stage');
const tubeInner = select(".tube__inner");
const clone = document.getElementsByClassName("line");
const numLines = 10;
const fontSize = parseFloat(gsap.getProperty(':root', '--fontSize')); // Ensure it's a number
const angle = 360 / numLines;
let radius = 0;
let origin = 0;

// Set 3D properties
function set3D() {
    let width = window.innerWidth;
    let fontSizePx = (width / 100) * fontSize;
    radius = (fontSizePx / 2) / Math.sin((180 / numLines) * (Math.PI / 180));
    origin = `50% 50% -${radius}px`;
}

// Clone Nodes
function cloneNodeProperly() {
    for (let i = 0; i < (numLines - 1); i++) {
        let newClone = clone[0].cloneNode(true);
        newClone.classList.add(`line--${i + 2}`);
        tubeInner.appendChild(newClone);
    }
    clone[0].classList.add("line--1");
}

// Position Text in 3D
function positionTxt() {
    gsap.set('.line', {
        rotationX: (index) => -angle * index,
        z: radius,
        transformOrigin: origin
    });
}

// Set Properties dynamically
function setProps(targets) {
    targets.forEach(target => {
        let paramSet = gsap.quickSetter(target, "css");
        let degrees = gsap.getProperty(target, "rotateX");
        let radians = degrees * (Math.PI / 180);
        let conversion = Math.abs(Math.cos(radians) / 2 + 0.5);
        let fontW = 200 + 700 * conversion;
        let fontS = `${100 + 700 * conversion}%`;

        paramSet({
            opacity: conversion + 0.1,
            fontWeight: fontW,
            fontStretch: fontS
        });
    });
}

// Scroll-based rotation
function scrollRotate() {
    gsap.to('.line', {
        scrollTrigger: {
            trigger: '.stage',
            scrub: 1,
            start: "top top"
        },
        rotateX: "+=1080",
        onUpdate: function () {
            setProps(this.targets());
        }
    });

    gsap.to('.tube', {
        scrollTrigger: {
            trigger: '.stage',
            scrub: 1,
            start: "top top"
        },
        perspective: '1vw',
        ease: 'expo.out'
    });
}

// Initialize the animation
function init() {
    cloneNodeProperly();
    set3D();
    window.onresize = () => {
        set3D();
        positionTxt();
    };
    positionTxt();
    setProps(gsap.utils.toArray(".line"));
    scrollRotate();
    gsap.to(stage, { autoAlpha: 1, duration: 2, delay: 2 });
}

// Run on page load
window.onload = () => {
    init();
};

// 🟢 Responsive Menu Toggle
const subMenu = document.querySelector(".sub-menu");
const toggleButton = document.querySelector(".toggle");

window.addEventListener("click", (e) => {
    if (e.target.closest(".toggle")) {
        subMenu.style.display = (subMenu.style.display === "flex") ? "none" : "flex";
    } else if (!e.target.closest(".sub-menu")) {
        subMenu.style.display = "none";
    }
});
document.addEventListener("scroll", () => {
    let glass = document.querySelector(".glass");
    let scrollPosition = window.scrollY;
    let triggerPoint = 400;  // When glass starts appearing
    let maxPosition = -200;   // Maximum rise position

    if (scrollPosition > triggerPoint) {
        let newPosition = Math.min(scrollPosition - triggerPoint, maxPosition);
        glass.style.bottom = `${newPosition}px`;
        glass.style.opacity = "1"; // Make visible
        glass.style.pointerEvents = "auto"; // Allow interaction
    } else {
        glass.style.bottom = "-100vh"; // Move back down when scrolling up
        glass.style.opacity = "0";
        glass.style.pointerEvents = "none";
    }
});



