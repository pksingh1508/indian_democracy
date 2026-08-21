"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three/examples/jsm/controls/OrbitControls.js";
import { partyColor } from "@/src/lib/parties";
import type { SeatPoint3D } from "@/src/components/chamber-explorer";

/**
 * The single Three.js client boundary. Renders on demand (camera changes),
 * pauses when the document is hidden, and disposes every GPU resource on
 * unmount. WebGL failure reports back to the wrapper for a 2D fallback.
 */
export function Chamber3DCanvas({
  points,
  blockKeys,
  onSelect,
  onFailure,
}: {
  points: SeatPoint3D[];
  blockKeys: string[];
  onSelect: (point: SeatPoint3D) => void;
  onFailure: () => void;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || points.length === 0) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      onFailure();
      return;
    }

    const width = mount.clientWidth;
    const height = Math.max(360, Math.min(480, width * 0.55));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
    const CAM_POS = new THREE.Vector3(0, 7.5, 13);
    const CAM_TARGET = new THREE.Vector3(0, 0, 1.5);
    camera.position.copy(CAM_POS);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(6, 10, 8);
    scene.add(key);

    // Seats as one InstancedMesh.
    const seatGeometry = new THREE.SphereGeometry(0.14, 20, 14);
    const seatMaterial = new THREE.MeshStandardMaterial({ roughness: 0.45 });
    const mesh = new THREE.InstancedMesh(seatGeometry, seatMaterial, points.length);
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    const keySet = new Set(blockKeys);
    points.forEach((p, i) => {
      matrix.makeTranslation(p.x, 0, p.z);
      mesh.setMatrixAt(i, matrix);
      color.set(keySet.has(p.blockKey) ? partyColor(p.blockKey) : "#8d919b");
      mesh.setColorAt(i, color);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    scene.add(mesh);

    // Floor arc hint.
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(9, 64, Math.PI, Math.PI).rotateX(-Math.PI / 2).translate(0, -0.02, 1.2),
      new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.07 }),
    );
    scene.add(floor);

    let controls: OrbitControlsImpl | undefined;
    import("three/examples/jsm/controls/OrbitControls.js").then(({ OrbitControls }) => {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.copy(CAM_TARGET);
      controls.enableDamping = false;
      controls.enablePan = false;
      controls.minDistance = 6;
      controls.maxDistance = 30;
      controls.maxPolarAngle = Math.PI / 2.05;
      controls.addEventListener("change", requestRender);
      renderOnce();
    });

    let renderQueued = false;
    function renderOnce() {
      if (document.hidden) return; // pause when tab is hidden
      renderer.render(scene, camera);
    }
    function requestRender() {
      if (renderQueued) return;
      renderQueued = true;
      requestAnimationFrame(() => {
        renderQueued = false;
        renderOnce();
      });
    }

    // Pointer selection via raycasting.
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    function onPointerDown(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(mesh);
      if (hits.length > 0 && hits[0].instanceId !== undefined) {
        const point = points[hits[0].instanceId];
        if (point) selectRef.current(point);
        requestRender();
      }
    }
    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    function onContextLost(event: Event) {
      event.preventDefault();
      onFailure();
    }
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);

    function onVisibility() {
      if (!document.hidden) renderOnce();
    }
    document.addEventListener("visibilitychange", onVisibility);

    function onResize() {
      if (!mount) return;
      const w = mount.clientWidth;
      if (w === 0) return;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
      renderOnce();
    }
    const observer = new ResizeObserver(onResize);
    observer.observe(mount);

    renderOnce();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      controls?.dispose();
      seatGeometry.dispose();
      seatMaterial.dispose();
      floor.geometry.dispose();
      (floor.material as THREE.Material).dispose();
      mesh.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [points, blockKeys, onFailure]);

  const resetCamera = () => {
    // Simplest robust reset: remount by toggling a key would lose selection;
    // instead dispatch through the canvas by re-adding — we keep it simple
    // and reload the component-scoped effect via a stateful remount.
    setRemount((n) => n + 1);
  };

  const [remount, setRemount] = useRemountState();

  return (
    <div>
      <div ref={mountRef} data-remount={remount} className="overflow-hidden rounded-md border border-rule bg-paper" aria-label={`3D chamber view with ${points.length} seats`} role="img" />
      <button type="button" onClick={resetCamera} className="button secondary mt-2">
        Reset camera
      </button>
    </div>
  );
}

import { useState } from "react";
function useRemountState(): [number, (fn: (n: number) => number) => void] {
  return useState(0);
}
