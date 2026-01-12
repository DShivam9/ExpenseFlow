import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { scheduler } from '../../utils/performance/AnimationScheduler';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';

/**
 * molecule-dark-veil shader
 * Recreated based on ReactBits Dark Veil
 */
const vertex = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragment = `
  precision highp float;
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    
    // Slow organic movement
    float noise = snoise(uv * 3.0 + uTime * 0.2);
    
    // Warp effect using noise
    uv += noise * 0.05;
    
    // Scanlines
    float scanline = sin(uv.y * 300.0) * 0.04;
    
    // Vignette
    float d = length(uv - 0.5);
    float vignette = 1.0 - smoothstep(0.4, 1.2, d);
    
    // Base color mixing with noise
    vec3 color = uColor * (0.8 + noise * 0.3);
    
    // Add subtle glow/veiling
    color += vec3(0.1, 0.1, 0.1) * (1.0 - uv.y) * 0.2; // Gradient from bottom
    
    // Apply effects
    color -= scanline;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const DarkVeil = () => {
    const containerRef = useRef(null);
    const { tier, reducedMotion } = usePerformanceMode();

    useEffect(() => {
        if (reducedMotion || !containerRef.current) return;

        const renderer = new Renderer({
            dpr: tier === 'low' ? 0.5 : (tier === 'medium' ? 1 : Math.min(window.devicePixelRatio, 2)),
            alpha: true
        });

        const gl = renderer.gl;
        containerRef.current.appendChild(gl.canvas);
        gl.clearColor(0, 0, 0, 0);

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new Color('#111111') }, // Pure Dark Gray/Black base
            },
        });

        const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

        const resize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', resize);
        resize();

        const cleanupSubscription = scheduler.subscribe('dark-veil', (delta, time) => {
            program.uniforms.uTime.value = time * 0.001;
            renderer.render({ scene: mesh });
        });

        return () => {
            window.removeEventListener('resize', resize);
            cleanupSubscription();
            const canvas = containerRef.current?.querySelector('canvas');
            if (canvas) canvas.remove();
        };
    }, [tier, reducedMotion]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
            style={{
                background: '#0a0a0a' // Deep Dark Background Fallback
            }}
        />
    );
};

export default DarkVeil;
