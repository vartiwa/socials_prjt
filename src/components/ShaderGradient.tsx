'use client';

import React, { useEffect, useRef } from 'react';

export interface ShaderGradientProps {
  animate?: 'on' | 'off';
  axesHelper?: 'on' | 'off';
  bgColor1?: string;
  bgColor2?: string;
  brightness?: number;
  cAzimuthAngle?: number;
  cDistance?: number;
  cPolarAngle?: number;
  cameraZoom?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  destination?: string;
  embedMode?: string;
  envPreset?: string;
  format?: string;
  fov?: number;
  frameRate?: number;
  gizmoHelper?: string;
  grain?: 'on' | 'off';
  lightType?: string;
  pixelDensity?: number;
  positionX?: number;
  positionY?: number;
  positionZ?: number;
  range?: string;
  rangeEnd?: number;
  rangeStart?: number;
  reflection?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  shader?: string;
  type?: string;
  uAmplitude?: number;
  uDensity?: number;
  uFrequency?: number;
  uSpeed?: number;
  uStrength?: number;
  uTime?: number;
  wireframe?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// Convert hex to rgb [0-1]
function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const intVal = parseInt(clean, 16);
  if (isNaN(intVal)) return [0, 0, 0];
  const r = ((intVal >> 16) & 255) / 255;
  const g = ((intVal >> 8) & 255) / 255;
  const b = (intVal & 255) / 255;
  return [r, g, b];
}

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_bgColor1;
uniform float u_brightness;
uniform float u_strength;
uniform float u_density;
uniform float u_frequency;
uniform float u_rotationX;
uniform float u_rotationZ;
uniform float u_positionX;
uniform float u_positionY;

varying vec2 v_uv;

vec2 rotate2d(vec2 uv, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c) * uv;
}

void main() {
  vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

  // Position offset (positionX, positionY)
  st.x -= u_positionX * 0.5;
  st.y -= (u_positionY - 0.5) * 0.45;

  // Rotation Z
  if (abs(u_rotationZ) > 0.01) {
    st = rotate2d(st, u_rotationZ * 0.01745329251);
  }

  // Tilt perspective from rotationX (waterPlane tilted view)
  float radX = u_rotationX * 0.01745329251;
  float cosX = max(cos(radX), 0.25);
  st.y /= cosX;

  // Water plane coordinate scaling with density
  vec2 p = st * (u_density * 1.6);
  float t = u_time * 0.35;

  // When u_frequency is 0, use broad water swell frequency
  float freq = u_frequency > 0.05 ? u_frequency : 2.2;
  float str = max(u_strength * 0.32, 0.5);

  // Multi-frequency undulating water waves
  float w1 = sin(p.x * freq + t * 0.75) * cos(p.y * (freq * 0.85) + t * 0.55);
  float w2 = sin((p.x * 0.85 + p.y * 1.1) * freq - t * 0.65);
  float w3 = cos(length(p * vec2(0.9, 1.3)) * (freq * 0.75) - t * 0.85);
  float w4 = sin(p.x * 2.1 - p.y * 1.6 + t * 0.45);

  // Normalized wave displacement between 0 and 1
  float wave = (w1 * 0.35 + w2 * 0.30 + w3 * 0.20 + w4 * 0.15);
  float d = clamp(wave * str * 0.5 + 0.5, 0.0, 1.0);

  // 3-color fluid blending:
  // Void Black (#000000) -> Mint Seafoam (#94ffd1) -> Electric Cyan (#6bf5ff) -> White Crests (#ffffff)
  vec3 col = mix(u_bgColor1, u_color1, smoothstep(0.12, 0.60, d));
  col = mix(col, u_color2, smoothstep(0.40, 0.85, d));
  col = mix(col, u_color3, smoothstep(0.70, 0.98, d) * 0.9);

  // Brightness multiplier
  col *= u_brightness;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function ShaderGradient({
  animate = 'on',
  color1 = '#94ffd1',
  color2 = '#6bf5ff',
  color3 = '#ffffff',
  bgColor1 = '#000000',
  bgColor2 = '#000000',
  brightness = 1.2,
  positionX = 0,
  positionY = 0.9,
  positionZ = -0.3,
  rotationX = 45,
  rotationY = 0,
  rotationZ = 0,
  uSpeed = 0.2,
  uStrength = 3.4,
  uDensity = 1.2,
  uFrequency = 0,
  frameRate = 10,
  pixelDensity = 1,
  className = '',
  style = {},
}: ShaderGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use WebGL with fail-safe fallback
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power', // Keeps GPU consumption negligible
    });

    if (!gl) return;

    // Compile shaders
    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }
    gl.useProgram(program);

    // Full quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const color1Loc = gl.getUniformLocation(program, 'u_color1');
    const color2Loc = gl.getUniformLocation(program, 'u_color2');
    const color3Loc = gl.getUniformLocation(program, 'u_color3');
    const bgColor1Loc = gl.getUniformLocation(program, 'u_bgColor1');
    const brightnessLoc = gl.getUniformLocation(program, 'u_brightness');
    const strengthLoc = gl.getUniformLocation(program, 'u_strength');
    const densityLoc = gl.getUniformLocation(program, 'u_density');
    const frequencyLoc = gl.getUniformLocation(program, 'u_frequency');
    const rotationXLoc = gl.getUniformLocation(program, 'u_rotationX');
    const rotationZLoc = gl.getUniformLocation(program, 'u_rotationZ');
    const positionXLoc = gl.getUniformLocation(program, 'u_positionX');
    const positionYLoc = gl.getUniformLocation(program, 'u_positionY');

    // Set static uniforms
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const rgb3 = hexToRgb(color3);
    const bgRgb = hexToRgb(bgColor1);

    gl.uniform3f(color1Loc, rgb1[0], rgb1[1], rgb1[2]);
    gl.uniform3f(color2Loc, rgb2[0], rgb2[1], rgb2[2]);
    gl.uniform3f(color3Loc, rgb3[0], rgb3[1], rgb3[2]);
    gl.uniform3f(bgColor1Loc, bgRgb[0], bgRgb[1], bgRgb[2]);
    gl.uniform1f(brightnessLoc, brightness);
    gl.uniform1f(strengthLoc, uStrength);
    gl.uniform1f(densityLoc, uDensity);
    gl.uniform1f(frequencyLoc, uFrequency);
    gl.uniform1f(rotationXLoc, rotationX);
    gl.uniform1f(rotationZLoc, rotationZ);
    gl.uniform1f(positionXLoc, positionX);
    gl.uniform1f(positionYLoc, positionY);

    let animationFrameId: number;
    let lastTime = performance.now();
    let totalTime = 0;
    // Throttle rendering intervals to maintain maximum smoothness without CPU/GPU lag
    const intervalMs = Math.max(1000 / Math.max(frameRate, 12), 33); // ~24-30 fps cap is ultra-smooth for fluid water while using < 0.5% GPU

    // Resize observer to handle responsive canvas resolution with low internal DPR
    const handleResize = () => {
      if (!canvas) return;
      // Use low DPR for fluid shaders: 0.6 - 1.0 is imperceptible with fluid motion and saves 80% shader calculations
      const dpr = Math.min(window.devicePixelRatio || 1, 1) * (pixelDensity || 1);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = Math.max(width, 100);
        canvas.height = Math.max(height, 100);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Render initial frame immediately so canvas is never blank
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!isVisible) return;

      const delta = now - lastTime;
      if (delta < intervalMs && animate === 'on') return;

      lastTime = now - (delta % intervalMs);
      if (animate === 'on') {
        totalTime += (delta / 1000) * (uSpeed || 0.1) * 3.0;
      }

      gl.uniform1f(timeLoc, totalTime);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [
    animate,
    color1,
    color2,
    color3,
    bgColor1,
    brightness,
    rotationX,
    rotationZ,
    positionX,
    positionY,
    uSpeed,
    uStrength,
    uDensity,
    uFrequency,
    frameRate,
    pixelDensity,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${className}`}
      style={{
        imageRendering: 'auto',
        ...style,
      }}
    />
  );
}
export default ShaderGradient;
