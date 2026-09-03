"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * The 3D portrait.
 *
 * Loading is deliberately staged so the page is never held hostage by it:
 *   1. a lightweight poster image paints immediately (this is the LCP element);
 *   2. three.js + the 568 KB model are fetched only after the page is idle,
 *      and only when the connection and the user's motion preference allow it;
 *   3. the canvas cross-fades in once the first frame is actually rendered.
 *
 * On a slow link, a data-saver connection, or with reduced motion enabled,
 * step 2 never happens and the poster simply stays — which is a complete,
 * intentional-looking hero rather than a degraded one.
 */

const MODEL_URL = "/3d/head.glb";
const POSTER_URL = "/3d/head-poster.webp";

type ConnectionLike = {
  saveData?: boolean;
  effectiveType?: string;
};

function connectionAllows3D() {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: ConnectionLike })
    .connection;
  if (!conn) return true; // Unknown — assume it is fine.
  if (conn.saveData) return false;
  if (conn.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return false;
  return true;
}

export default function Head3D({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || !connectionAllows3D()) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const start = async () => {
      const [THREE, { GLTFLoader }, { MeshoptDecoder }, { RoomEnvironment }] =
        await Promise.all([
          import("three"),
          import("three/examples/jsm/loaders/GLTFLoader.js"),
          import("three/examples/jsm/libs/meshopt_decoder.module.js"),
          import("three/examples/jsm/environments/RoomEnvironment.js"),
        ]);
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      const canvas = renderer.domElement;
      canvas.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 900ms cubic-bezier(0.22,1,0.36,1)";
      host.appendChild(canvas);

      const scene = new THREE.Scene();

      // Procedural studio environment — soft image-based lighting with no
      // HDR file to download.
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envRT.texture;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

      // Key light, warm; rim light, violet — the two accents of the palette.
      const key = new THREE.DirectionalLight(0xfff1de, 2.1);
      key.position.set(2.5, 3, 4);
      scene.add(key);

      const rim = new THREE.DirectionalLight(0xa78bfa, 2.4);
      rim.position.set(-3, 1.2, -2.5);
      scene.add(rim);

      const fill = new THREE.DirectionalLight(0x9fb4ff, 0.5);
      fill.position.set(-1.5, -1, 2);
      scene.add(fill);

      const pivot = new THREE.Group();
      scene.add(pivot);

      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);

      let model: import("three").Object3D | null = null;

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = host;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      try {
        const gltf = await loader.loadAsync(MODEL_URL);
        if (disposed) return;
        model = gltf.scene;

        // Centre the bust on the pivot and frame it from its own bounds, so
        // the composition does not depend on how the model was exported.
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const radius = Math.max(size.x, size.y, size.z) / 2;
        const distance =
          (radius / Math.sin((camera.fov * Math.PI) / 360)) * 1.06;
        camera.position.set(0, 0, distance);
        camera.lookAt(0, 0, 0);

        model.traverse((child) => {
          const mesh = child as import("three").Mesh;
          if (!mesh.isMesh) return;
          const mat = mesh.material as import("three").MeshStandardMaterial;
          if (mat && "envMapIntensity" in mat) {
            mat.envMapIntensity = 0.85;
          }
        });

        pivot.add(model);
      } catch {
        // Model unavailable — the poster underneath stays, nothing breaks.
        renderer.dispose();
        canvas.remove();
        return;
      }

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(host);

      // Pointer target, in normalised [-1, 1] space around the viewport.
      const target = { x: 0, y: 0 };
      const current = { x: 0, y: 0 };
      let pointerDriven = false;

      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        pointerDriven = true;
        target.x = (e.clientX / window.innerWidth) * 2 - 1;
        target.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      let frame = 0;
      let visible = true;
      const visObserver = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { rootMargin: "120px" },
      );
      visObserver.observe(host);

      let nodEnergy = 0;
      const onPointerDown = () => {
        nodEnergy = 1.0;
      };
      host.addEventListener("pointerdown", onPointerDown);
      host.style.cursor = "pointer";

      const clock = new THREE.Clock();
      let firstFrameDone = false;

      const tick = () => {
        frame = requestAnimationFrame(tick);
        if (!visible) return;

        const t = clock.getElapsedTime();

        // Without a mouse (touch, or before the first move) the head breathes
        // on a slow figure-eight instead of sitting perfectly still.
        const idleX = Math.sin(t * 0.32) * 0.42;
        const idleY = Math.sin(t * 0.21) * 0.22;

        const wantX = pointerDriven ? target.x : idleX;
        const wantY = pointerDriven ? target.y : idleY;

        // Critically damped follow — the softness the whole design asks for.
        current.x += (wantX - current.x) * 0.045;
        current.y += (wantY - current.y) * 0.045;

        // Friendly nod on click/tap
        if (nodEnergy > 0.005) {
          nodEnergy *= 0.91;
        } else {
          nodEnergy = 0;
        }
        const nodAngle = Math.sin((1 - nodEnergy) * Math.PI * 3) * nodEnergy * 0.08;
        const nodHop = Math.sin((1 - nodEnergy) * Math.PI) * nodEnergy * 0.035;

        pivot.rotation.y = current.x * 0.55;
        pivot.rotation.x = current.y * 0.3 + nodAngle;
        pivot.position.y = Math.sin(t * 0.6) * 0.012 + nodHop;
        rim.intensity = 2.4 + nodEnergy * 1.6;

        renderer.render(scene, camera);

        if (!firstFrameDone) {
          firstFrameDone = true;
          canvas.style.opacity = "1";
          setReady(true);
        }
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        visObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        host.removeEventListener("pointerdown", onPointerDown);
        envRT.texture.dispose();
        pmrem.dispose();
        model?.traverse((child) => {
          const mesh = child as import("three").Mesh;
          if (!mesh.isMesh) return;
          mesh.geometry?.dispose();
          const mat = mesh.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat?.dispose();
        });
        renderer.dispose();
        canvas.remove();
      };
    };

    // Wait for the browser to be idle so the model never competes with the
    // first paint.
    const canIdle = typeof window.requestIdleCallback === "function";
    const idle = canIdle
      ? window.requestIdleCallback(() => void start(), { timeout: 2500 })
      : window.setTimeout(() => void start(), 1200);

    return () => {
      disposed = true;
      if (canIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanup?.();
    };
  }, []);

  return (
    <div ref={hostRef} className={`relative ${className ?? ""}`}>
      <Image
        src={POSTER_URL}
        alt="3D portrait of Elias Elloumi"
        width={760}
        height={760}
        priority
        sizes="(min-width: 1024px) 520px, (min-width: 640px) 400px, 300px"
        className="h-full w-full object-contain transition-opacity duration-700"
        style={{ opacity: ready ? 0 : 1 }}
      />
    </div>
  );
}
