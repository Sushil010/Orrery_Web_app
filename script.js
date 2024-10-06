import * as THREE from 'three';
import { OrbitControls } from "jsm/controls/OrbitControls.js";

// Setup basic scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

const moonData = {
    radius: 0.4,
    distance: 2, 
    texture: loader.load("moon.jpg"),
    rotationSpeed: 0.01, 
    revolutionSpeed: 0.02, 
    angle: 0 
};


const backgroundTexture = new THREE.TextureLoader().load('stars.jpg');
scene.background = backgroundTexture;

const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: loader.load("sunmap.jpg") });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);


const planetsData = [
    { name: 'Mercury', radius: 0.8, distance: 10, texture: loader.load("mercurymap.jpg"), rotationSpeed: 0.004, revolutionSpeed: 0.01, inclination: 7.0 },
    { name: 'Venus', radius: 1, distance: 16, texture: loader.load("venusmap.jpg"), rotationSpeed: 0.002, revolutionSpeed: 0.007, inclination: 3.39 },
    { name: 'Earth', radius: 1.1, distance: 22, texture: loader.load("earthmap1k.jpg"), rotationSpeed: 0.001, revolutionSpeed: 0.005, inclination: 0.0 },
    { name: 'Mars', radius: 1, distance: 30, texture: loader.load("mars_1k_color.jpg"), rotationSpeed: 0.003, revolutionSpeed: 0.009, inclination: 1.85 },
    { name: 'Jupiter', radius: 7, distance: 55, texture: loader.load("jupiter2_1k.jpg"), rotationSpeed: 0.008, revolutionSpeed: 0.002, inclination: 1.3 },
    { name: 'Saturn', radius: 6, distance: 85, texture: loader.load("saturnmap.jpg"), rotationSpeed: 0.005, revolutionSpeed: 0.004, inclination: 2.49 },
    { name: 'Uranus', radius: 5, distance: 104, texture: loader.load("uranusmap.jpg"), rotationSpeed: 0.003, revolutionSpeed: 0.001, inclination: 0.77 },
    { name: 'Neptune', radius: 5, distance: 120, texture: loader.load("neptunemap.jpg"), rotationSpeed: 0.004, revolutionSpeed: 0.002, inclination: 1.77 }
];
const planets = [];
planetsData.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: planet.texture, roughness: 0.8 });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance; 

    
    const orbit = new THREE.Object3D();
    orbit.rotation.x = THREE.MathUtils.degToRad(planet.inclination); 
    scene.add(orbit);

    // Add the planet to the orbit
    orbit.add(mesh);

    planets.push({ mesh, orbit, distance: planet.distance, rotationSpeed: planet.rotationSpeed, revolutionSpeed: planet.revolutionSpeed, angle: 0 });
});

camera.position.z=50

const Orbit = new OrbitControls(camera, renderer.domElement);
Orbit.dampingFactor = 0.03;


const sunLight = new THREE.PointLight(0xffffff, 20, 300);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);


planetsData.forEach((planet) => {
    const orbitRadius = planet.distance;

   
    const points = [];
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2; 
        const x = Math.cos(angle) * orbitRadius;
        const z = Math.sin(angle) * orbitRadius;
        points.push(new THREE.Vector3(x, 0, z)); 
    }

    
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); 

    // Create the line and add it to the scene
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitLine.rotation.x = THREE.MathUtils.degToRad(planet.inclination); 
    scene.add(orbitLine);
});

const moonGeometry = new THREE.SphereGeometry(moonData.radius, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonData.texture, roughness: 0.8 });
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.set(moonData.distance, 0, 0);

planets[2].mesh.add(moonMesh); 


const ringGeometry = new THREE.RingGeometry(2, 13, 64); 
const saturnRingTexture = loader.load('saturn_ring.png');
const ringMaterial = new THREE.MeshBasicMaterial({
    map: saturnRingTexture,
    side: THREE.DoubleSide, 
    transparent: true 
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);

ring.rotation.x = THREE.MathUtils.degToRad(26.7); 
planets[5].mesh.add(ring); 

// Create Uranus' ring
const uranusRingGeometry = new THREE.RingGeometry(5.5, 7, 64);
const uranusRingTexture = loader.load('uranus ring.png');
const uranusRingMaterial = new THREE.MeshBasicMaterial({
    map: uranusRingTexture,
    side: THREE.DoubleSide,
    transparent: true
});
const uranusRing = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);

uranusRing.rotation.x = THREE.MathUtils.degToRad(98); 
planets[6].mesh.add(uranusRing); 







const cometsData = [
    { name: "P/2004 R1 (McNaught)", e: 0.6825,  q: 25, inclination: 4.894, revolutionSpeed: 0.002 },
    { name: "P/2008 S1 (Catalina-McNaught)", e: 0.6663,  q: 35, inclination: 15.1, revolutionSpeed: 0.0015 },
    { name: "C/1995 O1 (Hale-Bopp)", e: 0.996,  q: 50, inclination: 89.4, revolutionSpeed: 0.0018 },
    { name: "C/2013 R1 (Lovejoy)", e: 0.999,  q: 55, inclination: 49.5, revolutionSpeed: 0.0025 },
    { name: "C/2020 F3 (NEOWISE)", e: 0.999,  q: 65, inclination: 78.3, revolutionSpeed: 0.0030 },
    { name: "P/2016 BA14 (PANSTARRS)", e: 0.999,  q: 70, inclination: 25.0, revolutionSpeed: 0.0021 }
];




const comets = [];
cometsData.forEach(comet => {
    const geometry = new THREE.IcosahedronGeometry(3, 1); 
    const material = new THREE.MeshStandardMaterial({ color: 0xaf2222, roughness: 0.9 });

    const cometMesh = new THREE.Mesh(geometry, material);

    
    const distanceFromEarth = comet.q * 7; 
    cometMesh.position.x = distanceFromEarth;

    // Create an orbit object for the comet
    const orbit = new THREE.Object3D();
    orbit.rotation.x = THREE.MathUtils.degToRad(comet.inclination); 
    scene.add(orbit);
    orbit.add(cometMesh);

    comets.push({ mesh: cometMesh, orbit, revolutionSpeed: comet.revolutionSpeed, angle: 0, distance: distanceFromEarth });

    
    const cometOrbitRadius = distanceFromEarth;
    const cometPoints = [];
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const x = Math.cos(angle) * cometOrbitRadius;
        const z = Math.sin(angle) * cometOrbitRadius;
        cometPoints.push(new THREE.Vector3(x, 0, z));
    }

    const cometOrbitGeometry = new THREE.BufferGeometry().setFromPoints(cometPoints);
    const cometOrbitMaterial = new THREE.LineBasicMaterial({ color: 0xffd700 }); 
    const cometOrbitLine = new THREE.Line(cometOrbitGeometry, cometOrbitMaterial);
    cometOrbitLine.rotation.x = THREE.MathUtils.degToRad(comet.inclination); 
    scene.add(cometOrbitLine);

   
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '100px Arial';
    context.fillStyle = 'white';
    context.fillText(comet.name, 50, 50); 

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(5, 2.5, 1); 
    sprite.position.set(0, 2, 0); 

    cometMesh.add(sprite);
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); 
scene.add(ambientLight);




const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);



const asteroidBelt = new THREE.Group();
scene.add(asteroidBelt);

for (let i = 0; i < 300; i++) {
    const geometry = new THREE.IcosahedronGeometry(Math.random() * 0.5 + 0.2, 1); 
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
    const mesh = new THREE.Mesh(geometry, material);

   
    const radius = Math.random() * 5 + 35; 
    const angle = Math.random() * Math.PI * 2;
    mesh.position.x = radius * Math.cos(angle);
    mesh.position.z = radius * Math.sin(angle);

    
    asteroidBelt.add(mesh);
}


function animate() {
    requestAnimationFrame(animate);

    planets.forEach(planet => {

        sun.rotation.y -= 0.001;
       
        planet.mesh.rotation.y += planet.rotationSpeed;

        
        planet.angle += planet.revolutionSpeed;
        planet.mesh.position.x = planet.distance * Math.cos(planet.angle);
        planet.mesh.position.z = planet.distance * Math.sin(planet.angle);
    });

   
    moonData.angle += moonData.revolutionSpeed;
    moonMesh.position.x = moonData.distance * Math.cos(moonData.angle);
    moonMesh.position.z = moonData.distance * Math.sin(moonData.angle);

    
    comets.forEach(comet => {
        comet.angle += comet.revolutionSpeed;
        comet.mesh.position.x = comet.distance * Math.cos(comet.angle);
        comet.mesh.position.z = comet.distance * Math.sin(comet.angle);
    });

    
    asteroidBelt.rotation.y -= 0.001; 

    
    asteroidBelt.children.forEach((asteroid, index) => {
        asteroid.rotation.y -= Math.random() * 0.01 - 0.005;
        // asteroid.position.x += Math.random() * 0.1 - 0.05;
        // asteroid.position.z += Math.random() * 0.1 - 0.05; 
    });

    Orbit.update(); 
    renderer.render(scene, camera);
}

animate();


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});