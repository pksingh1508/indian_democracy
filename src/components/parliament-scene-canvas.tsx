"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { OrbitControls as OrbitControlsImpl } from "three/examples/jsm/controls/OrbitControls.js";
import { partyColor } from "@/src/lib/parties";
import {
  FOCUS_X,
  FOCUS_Z,
  GAP_HALF,
  PAD,
  PHI_MAX,
  ROW_RADII,
  type FloorPerson,
  type ParliamentFloor,
} from "@/src/lib/parliament-floor";

/**
 * Full Three.js rendering of the Lok Sabha chamber: a horseshoe of tiered
 * green desks carrying every seat coloured by party, named members rendered
 * as interactive figures, the Speaker's dais with portrait, flags and emblem,
 * the Table of the House with officials, and the surrounding teak shell.
 *
 * Follows the site's canvas contract: renders on demand, pauses while hidden,
 * disposes GPU resources on unmount, reports WebGL failure upward.
 */

const STEP_H = 0.085;
const SEAT_Y = 0.3;
const BODY_Y = 0.66;
const HEAD_Y = 0.98;
const HIT_Y = 0.6;

export interface HoverInfo {
  person: FloorPerson;
  px: number;
  py: number;
}

interface SceneRefs {
  onHoverRef: React.RefObject<(info: HoverInfo | null) => void>;
  onSelectRef: React.RefObject<(id: string) => void>;
}

interface Visual {
  person: FloorPerson;
  body: THREE.Mesh;
  marker: THREE.Mesh;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function makeCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Annular-sector shape in chamber angle space (x=r·sinφ, z=r·cosφ). */
function sectorShape(
  rInner: number,
  rOuter: number,
  phi0: number,
  phi1: number,
): THREE.Shape {
  const a0 = phi0 - Math.PI / 2;
  const a1 = phi1 - Math.PI / 2;
  const shape = new THREE.Shape();
  shape.absarc(0, 0, rOuter, Math.min(a0, a1), Math.max(a0, a1), false);
  shape.absarc(0, 0, rInner, Math.max(a0, a1), Math.min(a0, a1), true);
  shape.closePath();
  return shape;
}

function flatSector(
  rInner: number,
  rOuter: number,
  phi0: number,
  phi1: number,
  depth: number,
  material: THREE.Material,
): THREE.Mesh {
  const geometry = new THREE.ExtrudeGeometry(
    sectorShape(rInner, rOuter, phi0, phi1),
    { depth, bevelEnabled: false, curveSegments: 48 },
  );
  geometry.rotateX(-Math.PI / 2);
  return new THREE.Mesh(geometry, material);
}

function rowOfRadius(x: number, z: number): number {
  const r = Math.hypot(x - FOCUS_X, z - FOCUS_Z);
  let best = 0;
  let bestDiff = Infinity;
  ROW_RADII.forEach((rr, i) => {
    const diff = Math.abs(rr - r);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  });
  return best;
}

const SKIN_TONES = ["#c68a5e", "#bd7f52", "#aa6f45", "#96603c"];

function skinTone(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return SKIN_TONES[hash % SKIN_TONES.length];
}

function carpetTexture(): THREE.CanvasTexture {
  return makeCanvasTexture(1024, 1024, (ctx) => {
    const grad = ctx.createRadialGradient(512, 512, 60, 512, 512, 512);
    grad.addColorStop(0, "#1a4f41");
    grad.addColorStop(0.7, "#143d33");
    grad.addColorStop(1, "#0d2b25");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    for (let r = 80; r < 520; r += 56) {
      ctx.beginPath();
      ctx.arc(512, 512, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

function wallTexture(repeatX: number): THREE.CanvasTexture {
  const tex = makeCanvasTexture(256, 256, (ctx) => {
    ctx.fillStyle = "#cfc6b2";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#c2b8a1";
    for (let x = 0; x < 256; x += 32) ctx.fillRect(x, 0, 15, 256);
    ctx.fillStyle = "rgba(70,55,35,0.10)";
    for (let x = 0; x < 256; x += 32) ctx.fillRect(x + 15, 0, 3, 256);
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    for (let x = 0; x < 256; x += 32) ctx.fillRect(x + 27, 0, 2, 256);
  });
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, 1);
  return tex;
}

function flagTexture(): THREE.CanvasTexture {
  return makeCanvasTexture(256, 172, (ctx) => {
    ctx.fillStyle = "#ff9933";
    ctx.fillRect(0, 0, 256, 58);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 58, 256, 56);
    ctx.fillStyle = "#138808";
    ctx.fillRect(0, 114, 256, 58);
    ctx.strokeStyle = "#000080";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(128, 86, 21, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(128, 86);
      ctx.lineTo(128 + Math.cos(a) * 21, 86 + Math.sin(a) * 21);
      ctx.stroke();
    }
  });
}

function emblemTexture(): THREE.CanvasTexture {
  return makeCanvasTexture(256, 256, (ctx) => {
    ctx.fillStyle = "#12306b";
    ctx.beginPath();
    ctx.arc(128, 118, 108, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d8a93c";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(128, 118, 100, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(128, 118, 56, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(128 + Math.cos(a) * 56, 118 + Math.sin(a) * 56);
      ctx.lineTo(128 + Math.cos(a) * 96, 118 + Math.sin(a) * 96);
      ctx.stroke();
    }
    ctx.fillStyle = "#d8a93c";
    ctx.font = "600 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("सत्यमेव जयते", 128, 248);
  });
}

function portraitTexture(): THREE.CanvasTexture {
  return makeCanvasTexture(360, 480, (ctx) => {
    const grad = ctx.createLinearGradient(0, 0, 0, 480);
    grad.addColorStop(0, "#d9c9a4");
    grad.addColorStop(1, "#bfa87e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 360, 480);

    ctx.fillStyle = "#caa27e";
    ctx.beginPath();
    ctx.ellipse(180, 210, 76, 90, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(102, 214, 15, 25, 0, 0, Math.PI * 2);
    ctx.ellipse(258, 214, 15, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#4a3a2c";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(146, 206, 29, 0, Math.PI * 2);
    ctx.arc(214, 206, 29, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(175, 202);
    ctx.lineTo(185, 202);
    ctx.stroke();

    ctx.fillStyle = "#5d4a38";
    ctx.fillRect(156, 248, 48, 8);
    ctx.strokeStyle = "#5d4a38";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(158, 274);
    ctx.quadraticCurveTo(180, 288, 202, 274);
    ctx.stroke();

    ctx.fillStyle = "#f2ede2";
    ctx.beginPath();
    ctx.moveTo(52, 480);
    ctx.quadraticCurveTo(180, 310, 308, 480);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(90,70,50,0.25)";
    ctx.lineWidth = 3;
    ctx.stroke();
  });
}

function screenTexture(title: string, subtitle: string): THREE.CanvasTexture {
  return makeCanvasTexture(512, 320, (ctx) => {
    ctx.fillStyle = "#0d1526";
    ctx.fillRect(0, 0, 512, 320);
    ctx.fillStyle = "#ff9933";
    ctx.fillRect(40, 52, 96, 6);
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 58px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(title, 40, 140);
    ctx.fillStyle = "#9fb0cc";
    ctx.font = "400 30px sans-serif";
    ctx.fillText(subtitle, 40, 190);
    ctx.fillStyle = "#138808";
    ctx.fillRect(40, 230, 432, 3);
    ctx.fillStyle = "#5c6b88";
    ctx.font = "400 20px sans-serif";
    ctx.fillText("सत्यमेव जयते", 40, 280);
  });
}

/**
 * Builds the whole scene imperatively and returns a cleanup function.
 * Module-scope so the imperative Three.js work stays out of the component's
 * reactive scope entirely.
 */
function buildChamberScene(
  mount: HTMLElement,
  floor: ParliamentFloor,
  refs: SceneRefs,
  onFailure: () => void,
): () => void {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  } catch {
    onFailure();
    return () => {};
  }

  const textures: THREE.Texture[] = [];
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const tex = (t: THREE.Texture): THREE.Texture => (textures.push(t), t);
  const mat = (m: THREE.Material): THREE.Material => (materials.push(m), m);
  const geo = <T extends THREE.BufferGeometry>(g: T): T => (geometries.push(g), g);

  const width = Math.max(1, mount.clientWidth);
  const height = Math.max(420, Math.min(560, Math.round(width * 0.52)));
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 640 ? 1.5 : 2));
  renderer.setSize(width, height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.display = "block";
  renderer.domElement.style.touchAction = "pan-y";
  renderer.domElement.style.cursor = "grab";
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#11141c");
  scene.fog = new THREE.Fog("#11141c", 30, 52);

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
  const camHome = new THREE.Vector3(0, 7.0, 13.2);
  const camFar = new THREE.Vector3(-3.4, 11.8, 17.6);
  const camTarget = new THREE.Vector3(0, 0.55, 1.15);
  camera.position.copy(camFar);
  camera.lookAt(camTarget);

  scene.add(new THREE.HemisphereLight(0xfff4e0, 0x2c2f38, 0.95));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
  keyLight.position.set(7, 12, 9);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xbcd0ff, 0.35);
  fillLight.position.set(-6, 8, -4);
  scene.add(fillLight);
  const daisSpot = new THREE.PointLight(0xffe2b0, 30, 10, 1.6);
  daisSpot.position.set(0, 3.4, 0);
  scene.add(daisSpot);

  const woodMat = mat(new THREE.MeshStandardMaterial({ color: "#6d4b2f", roughness: 0.72 }));
  const darkWoodMat = mat(new THREE.MeshStandardMaterial({ color: "#452e1c", roughness: 0.78 }));
  const deskTopMat = mat(new THREE.MeshStandardMaterial({ color: "#1d5c47", roughness: 0.88 }));
  const brassMat = mat(
    new THREE.MeshStandardMaterial({ color: "#d8a93c", roughness: 0.32, metalness: 0.75 }),
  );
  const leatherMat = mat(new THREE.MeshStandardMaterial({ color: "#5d1f1f", roughness: 0.5 }));

  const carpetGeo = geo(new THREE.CircleGeometry(9.7, 72));
  carpetGeo.rotateX(-Math.PI / 2);
  const carpet = new THREE.Mesh(
    carpetGeo,
    mat(new THREE.MeshStandardMaterial({ map: tex(carpetTexture()), roughness: 0.95 })),
  );
  carpet.position.y = 0.001;
  scene.add(carpet);

  for (let i = 0; i < ROW_RADII.length; i++) {
    const r = ROW_RADII[i];
    const tier = flatSector(r - 0.42, r + 0.44, -(PHI_MAX + 0.09), PHI_MAX + 0.09, (i + 1) * STEP_H, woodMat);
    geometries.push(tier.geometry);
    scene.add(tier);
  }

  const deskGeos: THREE.ExtrudeGeometry[] = [];
  for (let row = 0; row < ROW_RADII.length; row++) {
    const r = ROW_RADII[row];
    for (const sign of [-1, 1]) {
      const g = new THREE.ExtrudeGeometry(
        sectorShape(r - 0.36, r - 0.07, GAP_HALF + 0.02, PHI_MAX - PAD + 0.03),
        { depth: 0.06, bevelEnabled: false, curveSegments: 40 },
      );
      g.rotateX(-Math.PI / 2);
      if (sign > 0) g.scale(-1, 1, 1);
      deskGeos.push(g);
    }
  }
  const mergedDesks = geo(mergeGeometries(deskGeos));
  deskGeos.forEach((g) => g.dispose());
  scene.add(new THREE.Mesh(mergedDesks, deskTopMat));

  const seatCount = floor.seats.length;
  const seatGeo = geo(new THREE.CylinderGeometry(0.155, 0.135, 0.09, 14));
  seatGeo.translate(0, SEAT_Y, 0);
  const backGeo = geo(new THREE.BoxGeometry(0.3, 0.36, 0.05));
  backGeo.translate(0, SEAT_Y + 0.24, -0.165);
  const seatMat = mat(new THREE.MeshStandardMaterial({ roughness: 0.62 }));
  const backMat = mat(new THREE.MeshStandardMaterial({ roughness: 0.62 }));

  const seatInstances = new THREE.InstancedMesh(seatGeo, seatMat, seatCount);
  const backInstances = new THREE.InstancedMesh(backGeo, backMat, seatCount);

  const shadowGeo = geo(new THREE.CircleGeometry(0.2, 12));
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowInstances = new THREE.InstancedMesh(
    shadowGeo,
    mat(new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.16 })),
    seatCount,
  );

  const m4 = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const v3 = new THREE.Vector3();
  const one = new THREE.Vector3(1, 1, 1);
  const yAxis = new THREE.Vector3(0, 1, 0);
  const col = new THREE.Color();

  floor.seats.forEach((seat, i) => {
    const y = (rowOfRadius(seat.x, seat.z) + 1) * STEP_H;
    quat.setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(seat.yawDeg));
    v3.set(seat.x, y, seat.z);
    m4.compose(v3, quat, one);
    seatInstances.setMatrixAt(i, m4);
    backInstances.setMatrixAt(i, m4);
    col.set(seat.color);
    seatInstances.setColorAt(i, col);
    backInstances.setColorAt(i, col);
    v3.set(seat.x, y + 0.012, seat.z);
    m4.compose(v3, new THREE.Quaternion(), one);
    shadowInstances.setMatrixAt(i, m4);
  });
  scene.add(seatInstances, backInstances, shadowInstances);

  function makeFigure(
    x: number,
    y: number,
    z: number,
    yawDeg: number,
    jacketHex: string,
    opts: { hitRadius?: number; scale?: number } = {},
  ): { group: THREE.Group; body: THREE.Mesh; head: THREE.Mesh; marker: THREE.Mesh; hit?: THREE.Mesh } {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = THREE.MathUtils.degToRad(yawDeg);
    group.scale.setScalar(opts.scale ?? 1);

    const body = new THREE.Mesh(
      geo(new THREE.CapsuleGeometry(0.115, 0.2, 4, 12)),
      mat(new THREE.MeshStandardMaterial({ color: jacketHex, roughness: 0.55 })),
    );
    body.position.y = BODY_Y;
    group.add(body);

    const head = new THREE.Mesh(
      geo(new THREE.SphereGeometry(0.088, 16, 12)),
      mat(new THREE.MeshStandardMaterial({ color: skinTone(`${x}:${z}`), roughness: 0.5 })),
    );
    head.position.y = HEAD_Y;
    group.add(head);

    const marker = new THREE.Mesh(
      geo(new THREE.OctahedronGeometry(0.055)),
      mat(new THREE.MeshStandardMaterial({
        color: jacketHex,
        emissive: new THREE.Color(jacketHex),
        emissiveIntensity: 0.55,
        roughness: 0.3,
      })),
    );
    marker.position.y = 1.34;
    group.add(marker);

    let hit: THREE.Mesh | undefined;
    if (opts.hitRadius) {
      hit = new THREE.Mesh(
        geo(new THREE.SphereGeometry(opts.hitRadius, 8, 8)),
        mat(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })),
      );
      hit.position.y = HIT_Y;
      group.add(hit);
    }
    scene.add(group);
    return { group, body, head, marker, hit };
  }

  const visuals: Visual[] = [];
  const hitTargets: THREE.Object3D[] = [];

  for (const person of floor.persons) {
    const y = (rowOfRadius(person.x, person.z) + 1) * STEP_H;
    const jacket = partyColor(person.partyAbbr);
    const fig = makeFigure(person.x, y, person.z, person.yawDeg, jacket, { hitRadius: 0.34 });
    const visual: Visual = { person, body: fig.body, marker: fig.marker };
    fig.hit!.userData.visual = visual;
    hitTargets.push(fig.hit!);
    visuals.push(visual);
  }

  const speakerFig = makeFigure(floor.speaker.x, 0.53, floor.speaker.z, floor.speaker.yawDeg, "#39415c", {
    hitRadius: 0.42,
    scale: 1.12,
  });
  const speakerVisual: Visual = {
    person: floor.speaker,
    body: speakerFig.body,
    marker: speakerFig.marker,
  };
  speakerFig.hit!.userData.visual = speakerVisual;
  hitTargets.push(speakerFig.hit!);

  for (const dx of [-0.5, 0.5]) {
    const clerk = makeFigure(dx, 0, 1.04, 0, "#23262e", { scale: 0.92 });
    clerk.head.material = mat(new THREE.MeshStandardMaterial({ color: "#b97f54", roughness: 0.5 }));
    clerk.marker.visible = false;
  }

  const dais = new THREE.Mesh(geo(new THREE.BoxGeometry(2.6, 0.53, 1.5)), woodMat);
  dais.position.set(0, 0.265, -0.72);
  scene.add(dais);
  const daisStep = new THREE.Mesh(geo(new THREE.BoxGeometry(3.1, 0.24, 0.55)), woodMat);
  daisStep.position.set(0, 0.12, 0.16);
  scene.add(daisStep);

  const chairSeat = new THREE.Mesh(geo(new THREE.BoxGeometry(0.52, 0.09, 0.46)), leatherMat);
  chairSeat.position.set(0, 1.0, -0.62);
  scene.add(chairSeat);
  const chairBack = new THREE.Mesh(geo(new THREE.BoxGeometry(0.58, 1.35, 0.1)), leatherMat);
  chairBack.position.set(0, 1.68, -0.9);
  scene.add(chairBack);
  const chairCrest = new THREE.Mesh(geo(new THREE.TorusGeometry(0.12, 0.022, 8, 24)), brassMat);
  chairCrest.position.set(0, 2.28, -0.88);
  scene.add(chairCrest);
  for (const ax of [-0.31, 0.31]) {
    const arm = new THREE.Mesh(geo(new THREE.BoxGeometry(0.07, 0.07, 0.42)), darkWoodMat);
    arm.position.set(ax, 1.16, -0.64);
    scene.add(arm);
    const post = new THREE.Mesh(geo(new THREE.BoxGeometry(0.07, 0.24, 0.07)), darkWoodMat);
    post.position.set(ax, 1.0, -0.82);
    scene.add(post);
  }

  const emblemDisc = new THREE.Mesh(
    geo(new THREE.CircleGeometry(0.3, 36)),
    mat(new THREE.MeshBasicMaterial({ map: tex(emblemTexture()) })),
  );
  emblemDisc.position.set(0, 3.02, -1.79);
  scene.add(emblemDisc);
  const emblemRing = new THREE.Mesh(geo(new THREE.TorusGeometry(0.33, 0.028, 10, 40)), brassMat);
  emblemRing.position.copy(emblemDisc.position);
  scene.add(emblemRing);

  const frame = new THREE.Mesh(geo(new THREE.BoxGeometry(0.74, 0.94, 0.05)), darkWoodMat);
  frame.position.set(0, 1.98, -1.845);
  scene.add(frame);
  const portrait = new THREE.Mesh(
    geo(new THREE.PlaneGeometry(0.62, 0.82)),
    mat(new THREE.MeshStandardMaterial({ map: tex(portraitTexture()), roughness: 0.9 })),
  );
  portrait.position.set(0, 1.98, -1.815);
  scene.add(portrait);

  for (const fx of [-1.06, 1.06]) {
    const pole = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.02, 0.026, 2.55, 10)), brassMat);
    pole.position.set(fx, 1.3, -0.3);
    scene.add(pole);
    const finial = new THREE.Mesh(geo(new THREE.SphereGeometry(0.04, 10, 10)), brassMat);
    finial.position.set(fx, 2.6, -0.3);
    scene.add(finial);
    const flag = new THREE.Mesh(
      geo(new THREE.PlaneGeometry(0.56, 0.37)),
      mat(new THREE.MeshBasicMaterial({ map: tex(flagTexture()), side: THREE.DoubleSide })),
    );
    flag.position.set(fx + (fx < 0 ? 0.3 : -0.3), 2.36, -0.3);
    scene.add(flag);
  }

  const backWallArc = new THREE.Mesh(
    geo(new THREE.CylinderGeometry(1.9, 1.9, 3.7, 48, 1, true, Math.PI - PHI_MAX, 2 * PHI_MAX)),
    mat(new THREE.MeshStandardMaterial({ map: tex(wallTexture(10)), roughness: 0.9, side: THREE.BackSide })),
  );
  backWallArc.position.y = 1.85;
  scene.add(backWallArc);

  const tableTop = new THREE.Mesh(geo(new THREE.BoxGeometry(3.3, 0.07, 1.05)), deskTopMat);
  tableTop.position.set(0, 0.73, 1.52);
  scene.add(tableTop);
  const tableBody = new THREE.Mesh(geo(new THREE.BoxGeometry(3.18, 0.66, 0.93)), darkWoodMat);
  tableBody.position.set(0, 0.37, 1.52);
  scene.add(tableBody);
  const micMat = mat(new THREE.MeshStandardMaterial({ color: "#222222", roughness: 0.4 }));
  for (const mx of [-1.3, -0.65, 0, 0.65, 1.3]) {
    const stem = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 8)), micMat);
    stem.position.set(mx, 0.91, 1.44);
    stem.rotation.x = -0.35;
    scene.add(stem);
    const micHead = new THREE.Mesh(geo(new THREE.SphereGeometry(0.028, 8, 8)), micMat);
    micHead.position.set(mx + 0.05, 1.04, 1.41);
    scene.add(micHead);
  }
  const paperMat = mat(new THREE.MeshStandardMaterial({ color: "#f5f2ea", roughness: 1 }));
  for (let p = 0; p < 8; p++) {
    const paper = new THREE.Mesh(geo(new THREE.BoxGeometry(0.17, 0.004, 0.24)), paperMat);
    paper.position.set(
      -1.3 + (p % 4) * 0.62 + (p > 3 ? 0.18 : 0),
      0.772,
      1.3 + Math.floor(p / 4) * 0.34,
    );
    paper.rotation.y = ((p * 37) % 20) / 60;
    scene.add(paper);
  }

  const officerTable = new THREE.Mesh(geo(new THREE.BoxGeometry(1.4, 0.06, 0.66)), deskTopMat);
  officerTable.position.set(0, 0.66, 2.38);
  scene.add(officerTable);
  const officerBodyBlock = new THREE.Mesh(geo(new THREE.BoxGeometry(1.3, 0.6, 0.58)), darkWoodMat);
  officerBodyBlock.position.set(0, 0.33, 2.38);
  scene.add(officerBodyBlock);

  const roomWall = new THREE.Mesh(
    geo(new THREE.CylinderGeometry(10.4, 10.4, 5.4, 64, 1, true, 0.62, Math.PI * 2 - 1.24)),
    mat(new THREE.MeshStandardMaterial({ map: tex(wallTexture(64)), roughness: 0.92, side: THREE.BackSide })),
  );
  roomWall.position.y = 2.7;
  scene.add(roomWall);

  const parapet = flatSector(9.15, 9.45, -(PHI_MAX + 0.5), PHI_MAX + 0.5, 0.55, woodMat);
  parapet.position.y = 2.1;
  geometries.push(parapet.geometry);
  scene.add(parapet);

  const ceilingGeo = geo(new THREE.CircleGeometry(10.8, 64));
  ceilingGeo.rotateX(Math.PI / 2);
  const ceiling = new THREE.Mesh(ceilingGeo, mat(new THREE.MeshStandardMaterial({ color: "#241f19", roughness: 1 })));
  ceiling.position.y = 5.42;
  scene.add(ceiling);
  const lightRing = new THREE.Mesh(
    geo(new THREE.TorusGeometry(5.6, 0.09, 10, 72)),
    mat(new THREE.MeshStandardMaterial({ color: "#fff3d8", emissive: new THREE.Color("#ffe9bd"), emissiveIntensity: 1.5 })),
  );
  lightRing.rotation.x = Math.PI / 2;
  lightRing.position.y = 5.18;
  scene.add(lightRing);
  const skylightGeo = geo(new THREE.CircleGeometry(2.1, 40));
  skylightGeo.rotateX(Math.PI / 2);
  const skylight = new THREE.Mesh(skylightGeo, mat(new THREE.MeshBasicMaterial({ color: "#eef3fa" })));
  skylight.position.y = 5.41;
  scene.add(skylight);

  for (const sx of [-1, 1]) {
    const screen = new THREE.Mesh(
      geo(new THREE.PlaneGeometry(2.5, 1.55)),
      mat(new THREE.MeshBasicMaterial({ map: tex(screenTexture("Lok Sabha", "House of the People")) })),
    );
    const ang = sx * 0.85;
    screen.position.set(Math.sin(ang) * 10.0, 2.65, Math.cos(ang) * 10.0);
    screen.lookAt(0, 2.2, 1.2);
    scene.add(screen);
  }

  let controls: OrbitControlsImpl | undefined;
  let disposed = false;
  let renderQueued = false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let introActive = !reduceMotion;
  const introStart = performance.now();

  function renderOnce() {
    if (!disposed && !document.hidden) renderer.render(scene, camera);
  }
  function requestRender() {
    if (renderQueued || disposed) return;
    renderQueued = true;
    requestAnimationFrame(() => {
      renderQueued = false;
      renderOnce();
    });
  }

  import("three/examples/jsm/controls/OrbitControls.js").then(({ OrbitControls }) => {
    if (disposed) return;
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(camTarget);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.minDistance = 5.5;
    controls.maxDistance = 26;
    controls.minPolarAngle = 0.3;
    controls.maxPolarAngle = Math.PI / 2.04;
    controls.minAzimuthAngle = -1.05;
    controls.maxAzimuthAngle = 1.05;
    controls.addEventListener("change", requestRender);
    if (!introActive) requestRender();
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered: Visual | null = null;
  let downAt: { x: number; y: number; t: number } | null = null;

  function pickVisual(clientX: number, clientY: number): Visual | null {
    const rect = renderer.domElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(hitTargets, false);
    return hits.length > 0 ? ((hits[0].object.userData.visual as Visual) ?? null) : null;
  }

  function applyHoverStyle(visual: Visual, on: boolean) {
    const bodyMat = visual.body.material as THREE.MeshStandardMaterial;
    if (on) {
      bodyMat.emissive.setHex(0xffffff);
      bodyMat.emissiveIntensity = 0.22;
      visual.marker.scale.setScalar(1.55);
    } else {
      bodyMat.emissive.setHex(0x000000);
      bodyMat.emissiveIntensity = 0;
      visual.marker.scale.setScalar(1);
    }
  }

  function setHovered(next: Visual | null, clientX = 0, clientY = 0) {
    if (hovered === next) return;
    if (hovered) applyHoverStyle(hovered, false);
    hovered = next;
    if (hovered) {
      applyHoverStyle(hovered, true);
      const rect = renderer.domElement.getBoundingClientRect();
      refs.onHoverRef.current?.({
        person: hovered.person,
        px: clientX - rect.left,
        py: clientY - rect.top,
      });
      renderer.domElement.style.cursor = "pointer";
    } else {
      refs.onHoverRef.current?.(null);
      renderer.domElement.style.cursor = "grab";
    }
    requestRender();
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerType === "touch") return;
    setHovered(pickVisual(event.clientX, event.clientY), event.clientX, event.clientY);
  }
  function onPointerDown(event: PointerEvent) {
    downAt = { x: event.clientX, y: event.clientY, t: performance.now() };
  }
  function onPointerUp(event: PointerEvent) {
    if (!downAt) return;
    const dx = event.clientX - downAt.x;
    const dy = event.clientY - downAt.y;
    const dt = performance.now() - downAt.t;
    downAt = null;
    if (dx * dx + dy * dy > 36 || dt > 600) return;
    const visual = pickVisual(event.clientX, event.clientY);
    if (visual) refs.onSelectRef.current?.(visual.person.id);
  }
  function onPointerLeave() {
    setHovered(null);
  }

  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  renderer.domElement.addEventListener("pointerleave", onPointerLeave);

  function onContextLost(event: Event) {
    event.preventDefault();
    onFailure();
  }
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);

  function onVisibility() {
    if (!document.hidden) requestRender();
  }
  document.addEventListener("visibilitychange", onVisibility);

  function onResize() {
    const w = mount.clientWidth || width;
    camera.aspect = w / height;
    camera.updateProjectionMatrix();
    renderer.setSize(w, height);
    requestRender();
  }
  const observer = new ResizeObserver(onResize);
  observer.observe(mount);

  let raf = 0;
  function tick(now: number) {
    if (disposed || !introActive) return;
    const t = Math.min(1, (now - introStart) / 1400);
    camera.position.lerpVectors(camFar, camHome, easeOutCubic(t));
    camera.lookAt(camTarget);
    renderOnce();
    if (t >= 1) {
      introActive = false;
      if (controls) requestRender();
      return;
    }
    raf = requestAnimationFrame(tick);
  }
  if (introActive) {
    raf = requestAnimationFrame(tick);
  }
  renderOnce();

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    renderer.domElement.removeEventListener("pointermove", onPointerMove);
    renderer.domElement.removeEventListener("pointerdown", onPointerDown);
    renderer.domElement.removeEventListener("pointerup", onPointerUp);
    renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
    renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
    controls?.dispose();
    for (const t of textures) t.dispose();
    for (const m of materials) m.dispose();
    for (const g of geometries) g.dispose();
    renderer.dispose();
    if (renderer.domElement.parentElement === mount) {
      mount.removeChild(renderer.domElement);
    }
  };
}

export function ParliamentSceneCanvas({
  floor,
  onHover,
  onSelectPerson,
  onFailure,
}: {
  floor: ParliamentFloor;
  onHover: (info: HoverInfo | null) => void;
  onSelectPerson: (id: string) => void;
  onFailure: () => void;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const hoverRef = useRef(onHover);
  const selectRef = useRef(onSelectPerson);

  useEffect(() => {
    hoverRef.current = onHover;
  }, [onHover]);
  useEffect(() => {
    selectRef.current = onSelectPerson;
  }, [onSelectPerson]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || floor.seats.length === 0) return;
    return buildChamberScene(mount, floor, { onHoverRef: hoverRef, onSelectRef: selectRef }, onFailure);
  }, [floor, onFailure]);

  return (
    <div
      ref={mountRef}
      className="overflow-hidden rounded-lg border border-rule-strong bg-[#11141c]"
      role="application"
      aria-label={`Interactive model of the Lok Sabha chamber with ${floor.seats.length} seats and ${floor.persons.length + 1} named members. Drag to orbit; click a member to open their profile.`}
    />
  );
}
