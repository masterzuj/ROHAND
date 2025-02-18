//MIT LICENCE

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const container = document.createElement( 'div' );
document.body.appendChild( container );



// Instantiate a loader
const loader = new GLTFLoader();


///scene
const scene = new THREE.Scene({ alpha: true });

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 3000 );

camera.position.set( 0, 0, 500 );



const renderer = new THREE.WebGLRenderer();



renderer.setSize( window.innerWidth, window.innerHeight );

renderer.setClearColor(0xffffff, 0);



container.appendChild( renderer.domElement );

///end secene



//object


/*
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
*/


//end object







var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
hemiLight.position.set( 0, 200, 200 );
scene.add( hemiLight );

var dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( 0, 200, 200 );
scene.add( dirLight );



//const loader = new GLTFLoader();

let myBone;

let BoneZ0;
let BoneZ1;
let BoneZ2;

let BoneM0;
let BoneM1;
let BoneM2;

let BoneR0;
let BoneR1;
let BoneR2;

let BoneK0;
let BoneK1;
let BoneK2;

let BoneD0;
let BoneD1;




loader.load( 'HAND_THREE_2.glb', function ( gltf ) {

	const model = gltf.scene;
	scene.add( gltf.scene );
	
	
	// Beispiel: Zugriff auf einen Bone namens "myBone"
	const bone = model.getObjectByName('BoneZ1');
	myBone = model.getObjectByName('BoneZ2');
	
	
	
	
	BoneZ0 = model.getObjectByName('BoneZ');
	BoneZ1 = model.getObjectByName('BoneZ1');
	BoneZ2 = model.getObjectByName('BoneZ2');
	
	
	BoneM0 = model.getObjectByName('BoneM');
	BoneM1 = model.getObjectByName('BoneM1');
	BoneM2 = model.getObjectByName('BoneM2');
	
	
	BoneR0 = model.getObjectByName('BoneR');
	BoneR1 = model.getObjectByName('BoneR1');
	BoneR2 = model.getObjectByName('BoneR2');
	
	BoneK0 = model.getObjectByName('BoneK');
	BoneK1 = model.getObjectByName('BoneK1');
	BoneK2 = model.getObjectByName('BoneK2');
	

	BoneD0 = model.getObjectByName('BoneD');
	BoneD1 = model.getObjectByName('BoneD1');
	
	

	if (bone) {
	  // Weiter zum nächsten Schritt
		//bone.rotation.x = Math.PI / 4; // 45 Grad um die X-Achse
		//bone.rotation.y = Math.PI / 2; // 90 Grad um die Y-Achse
		bone.rotation.x = Math.PI / 4; // Keine Rotation um die Z-Achse


	} else {
	  console.error('Bone nicht gefunden!');
	}
	
	
/*
	if (BoneM0) {
		BoneM0.rotation.x = Math.PI / 4;
	}
*/
	
}, undefined, function ( error ) {

	console.error( error );

} );



//rotation auserhalb des scopes () global 
setTimeout(() => {
  rotateBone(myBone, Math.PI / 2, 0, 0); // Rotation nach 1 Sekunden
}, 1000);



function rotateBone(bone, angleX, angleY, angleZ) {
  bone.rotation.set(angleX, angleY, angleZ); // Euler-Winkel verwenden
}







				const controls = new OrbitControls( camera, renderer.domElement );
				controls.addEventListener( 'change', render ); // use if there is no animation loop
				controls.minDistance = 100;
				controls.maxDistance = 500;
				controls.target.set( 0, 0, 0 );
				controls.update();

				window.addEventListener( 'resize', onWindowResize );







function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

function render() {

				renderer.render( scene, camera );

			}



///render

function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

//end render























function gradToRadiant(grad) {
  return grad * Math.PI / 180;
}




        document.addEventListener('DOMContentLoaded', async (event) => {
            console.log("DOM ist vollständig geladen.");

            const videoElement = document.getElementById('video');
            const canvasElement = document.getElementById('canvas');
            const canvasCtx = canvasElement.getContext('2d');

            if (!videoElement || !canvasElement || !canvasCtx) {
                console.error("Video- oder Canvas-Element nicht gefunden!");
                return;
            }

            try {
                const hands = new Hands({locateFile: (file) => {
                    return `https://zujkov.com/hand_three/hands11/assets/${file}`;
                }});

                hands.setOptions({
                    maxNumHands: 1,
                    modelComplexity: 1,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });

                hands.onResults(onResults);

                const camera = new Camera(videoElement, {
                    onFrame: async () => {
                        await hands.send({image: videoElement});
                    },
                    width: 640,
                    height: 480,
                });

                await camera.start();
                console.log("Kamera gestartet.");

            } catch (error) {
                console.error("Fehler beim Starten der Kamera oder Initialisieren von MediaPipe:", error);
            }

            function onResults(results) {
                canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

                if (results.multiHandLandmarks) {
                    for (const landmarks of results.multiHandLandmarks) {
                        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS);
                        drawLandmarks(canvasCtx, landmarks, {color: '#00FF00', lineWidth: 2});

                        // Winkelberechnung für den Daumen
                        const daumenMCPWinkel = berechneGelenkwinkel(landmarks, 2, 3, 4);
                        const daumenPIPWinkel = berechneGelenkwinkel(landmarks, 2, 3, 4); // Angepasst für den Daumen

                        // Ausgabe der Winkel in der Konsole (oder Anzeige im Canvas)
                        //console.log("Daumen MCP Winkel:", daumenMCPWinkel);
                        
						
						// Z ZEIGE; M MITTEL; R RING; K KLEIN ; D DAUMEN
						
						
						const ZMCPWinkel = berechneGelenkwinkel(landmarks, 5, 6, 7);
						const ZPIPWinkel = berechneGelenkwinkel(landmarks, 6, 7, 8);
						const ZDIPWinkel = berechneGelenkwinkel(landmarks, 7, 8, 9);
						
						
							const	MMCPWinkel = berechneGelenkwinkel(landmarks, 9, 10, 11); 
                            const	MPIPWinkel = berechneGelenkwinkel(landmarks, 10, 11, 12); 
                            const	MDIPWinkel = berechneGelenkwinkel(landmarks, 11, 12, 13); 
						
						
						const	RMCPWinkel = berechneGelenkwinkel(landmarks, 13, 14, 16); 
                        const	RPIPWinkel = berechneGelenkwinkel(landmarks, 14, 15, 16); 
                        const	RDIPWinkel = berechneGelenkwinkel(landmarks, 15, 16, 17);
						
						
							const	KMCPWinkel = berechneGelenkwinkel(landmarks, 17, 18, 19); 
							const	KPIPWinkel = berechneGelenkwinkel(landmarks, 18, 19, 20); 
							const	KDIPWinkel = berechneGelenkwinkel(landmarks, 19, 20, 21); // ? is null
						
					//console.log("KPIP Winkel:", KDIPWinkel);
						
						/*
						
								let BoneM0;
								let BoneM1;
								let BoneM2;

								let BoneR0;
								let BoneR1;
								let BoneR2;

								let BoneK0;
								let BoneK1;
								let BoneK2;
						*/
						
						rotateBone(BoneZ0, (Math.PI) - gradToRadiant(ZMCPWinkel), 0, 0); //ok
						rotateBone(BoneZ1, (Math.PI) - gradToRadiant(ZPIPWinkel), 0, 0); //ok
						rotateBone(BoneZ2, gradToRadiant(ZDIPWinkel), 0, 0); //ok
						
						
						
						rotateBone(BoneM0, (Math.PI) - gradToRadiant(MMCPWinkel), -(Math.PI)/2, 0); //ok
						rotateBone(BoneM1, 0, 0, (Math.PI) + gradToRadiant(MPIPWinkel)); //ok
						rotateBone(BoneM2, 0, 0, - gradToRadiant(MDIPWinkel)); //ok
						
						rotateBone(BoneR0, (Math.PI) - gradToRadiant(RMCPWinkel), 0, 0); //ok
						rotateBone(BoneR1, (Math.PI) - gradToRadiant(RPIPWinkel), 0, 0);//ok
						rotateBone(BoneR2, gradToRadiant(RDIPWinkel), 0, 0);//ok
						
						rotateBone(BoneK0, (Math.PI) - gradToRadiant(KMCPWinkel), 0, 0);//ok
						rotateBone(BoneK1, (Math.PI) - gradToRadiant(KPIPWinkel), 0, 0);//ok
						//rotateBone(BoneK2, gradToRadiant(KDIPWinkel), 0, 0); // ? is null
						rotateBone(BoneK2, (Math.PI) -  gradToRadiant(KPIPWinkel), 0, 0); // brücke
						
						rotateBone(BoneD0, (Math.PI) - gradToRadiant(daumenMCPWinkel), 0, 0);//ok
						rotateBone(BoneD1, (Math.PI) - gradToRadiant(daumenPIPWinkel), 0, 0);//ok
						
						
						
						
						
                        const fingerGelenke = [
                            { name: "Zeigefinger MCP", indices: [5, 6, 7] },
                            { name: "Zeigefinger PIP", indices: [6, 7, 8] },
                            { name: "Zeigefinger DIP", indices: [7, 8, 9] },
                            { name: "Mittelfinger MCP", indices: [9, 10, 11] },
                            { name: "Mittelfinger PIP", indices: [10, 11, 12] },
                            { name: "Mittelfinger DIP", indices: [11, 12, 13] },
                            { name: "Ringfinger MCP", indices: [13, 14, 15] },
                            { name: "Ringfinger PIP", indices: [14, 15, 16] },
                            { name: "Ringfinger DIP", indices: [15, 16, 17] },
                            { name: "Kleiner Finger MCP", indices: [17, 18, 19] },
                            { name: "Kleiner Finger PIP", indices: [18, 19, 20] },
                            { name: "Kleiner Finger DIP", indices: [19, 20, 21] }
                        ];
							
						/*
                        fingerGelenke.forEach(gelenk => {
                            const winkel = berechneGelenkwinkel(landmarks, gelenk.indices[0], gelenk.indices[1], gelenk.indices[2]);
                            console.log(gelenk.name + ":", winkel);
							
                        });*/

                    }
                }
            }

            function berechneGelenkwinkel(landmarks, landmarkIndex1, landmarkIndex2, landmarkIndex3) {
                if (!landmarks || landmarks.length <= landmarkIndex1 || landmarks.length <= landmarkIndex2 || landmarks.length <= landmarkIndex3) {
                    return null;
                }

                const punkt1 = landmarks[landmarkIndex1];
                const punkt2 = landmarks[landmarkIndex2];
                const punkt3 = landmarks[landmarkIndex3];

                const vektor1 = {
                    x: punkt1.x - punkt2.x,
                    y: punkt1.y - punkt2.y,
                    z: punkt1.z - punkt2.z
                };
                const vektor2 = {
                    x: punkt3.x - punkt2.x,
                    y: punkt3.y - punkt2.y,
                    z: punkt3.z - punkt2.z
                };

                const dotProdukt = vektor1.x * vektor2.x + vektor1.y * vektor2.y + vektor1.z * vektor2.z;
                const laengeVektor1 = Math.sqrt(vektor1.x * vektor1.x + vektor1.y * vektor1.y + vektor1.z * vektor1.z);
                const laengeVektor2 = Math.sqrt(vektor2.x * vektor2.x + vektor2.y * vektor2.y + vektor2.z * vektor2.z);
                const winkelBogenmass = Math.acos(dotProdukt / (laengeVektor1 * laengeVektor2));

                const winkelGrad = winkelBogenmass * 180 / Math.PI;

                return winkelGrad;
            }

        });