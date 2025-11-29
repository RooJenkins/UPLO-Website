import React, { useEffect, useRef } from 'react';

const FluidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Basic WebGL boilerplate
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    }

    // Shaders
    const baseVertexShader = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
    `;

    const displayShaderSource = `
      precision highp float;
      uniform sampler2D u_texture;
      uniform vec2 u_resolution;
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        vec4 color = texture2D(u_texture, uv);
        gl_FragColor = vec4(color.rgb, 1.0);
      }
    `;

    const splatShaderSource = `
      precision highp float;
      uniform sampler2D u_texture;
      uniform vec2 u_point;
      uniform vec3 u_color;
      uniform float u_radius;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        vec2 p = uv - u_point.xy;
        p.x *= u_resolution.x / u_resolution.y;
        vec3 splat = exp(-dot(p, p) / u_radius) * u_color;
        vec3 base = texture2D(u_texture, uv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionShaderSource = `
      precision highp float;
      uniform sampler2D u_velocity;
      uniform sampler2D u_source;
      uniform vec2 u_texelSize;
      uniform float u_dt;
      uniform float u_dissipation;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        vec2 coord = uv - u_dt * texture2D(u_velocity, uv).xy * u_texelSize;
        vec4 result = texture2D(u_source, coord);
        gl_FragColor = result * u_dissipation;
      }
    `;

    const divergenceShaderSource = `
      precision highp float;
      uniform sampler2D u_velocity;
      uniform vec2 u_texelSize;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        float L = texture2D(u_velocity, uv - vec2(u_texelSize.x, 0.0)).x;
        float R = texture2D(u_velocity, uv + vec2(u_texelSize.x, 0.0)).x;
        float T = texture2D(u_velocity, uv + vec2(0.0, u_texelSize.y)).y;
        float B = texture2D(u_velocity, uv - vec2(0.0, u_texelSize.y)).y;

        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const pressureShaderSource = `
      precision highp float;
      uniform sampler2D u_pressure;
      uniform sampler2D u_divergence;
      uniform vec2 u_texelSize;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        float L = texture2D(u_pressure, uv - vec2(u_texelSize.x, 0.0)).x;
        float R = texture2D(u_pressure, uv + vec2(u_texelSize.x, 0.0)).x;
        float T = texture2D(u_pressure, uv + vec2(0.0, u_texelSize.y)).x;
        float B = texture2D(u_pressure, uv - vec2(0.0, u_texelSize.y)).x;
        float div = texture2D(u_divergence, uv).x;

        float pressure = (L + R + T + B - div) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradientSubtractShaderSource = `
      precision highp float;
      uniform sampler2D u_pressure;
      uniform sampler2D u_velocity;
      uniform vec2 u_texelSize;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        float L = texture2D(u_pressure, uv - vec2(u_texelSize.x, 0.0)).x;
        float R = texture2D(u_pressure, uv + vec2(u_texelSize.x, 0.0)).x;
        float T = texture2D(u_pressure, uv + vec2(0.0, u_texelSize.y)).x;
        float B = texture2D(u_pressure, uv - vec2(0.0, u_texelSize.y)).x;

        vec2 velocity = texture2D(u_velocity, uv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    // Compile shaders
    const vShader = createShader(gl, gl.VERTEX_SHADER, baseVertexShader);
    const splatShader = createShader(gl, gl.FRAGMENT_SHADER, splatShaderSource);
    const advectionShader = createShader(gl, gl.FRAGMENT_SHADER, advectionShaderSource);
    const divergenceShader = createShader(gl, gl.FRAGMENT_SHADER, divergenceShaderSource);
    const pressureShader = createShader(gl, gl.FRAGMENT_SHADER, pressureShaderSource);
    const gradientSubtractShader = createShader(gl, gl.FRAGMENT_SHADER, gradientSubtractShaderSource);
    const displayShader = createShader(gl, gl.FRAGMENT_SHADER, displayShaderSource);

    if (!vShader || !splatShader || !advectionShader || !divergenceShader || !pressureShader || !gradientSubtractShader || !displayShader) return;

    const splatProgram = createProgram(gl, vShader, splatShader);
    const advectionProgram = createProgram(gl, vShader, advectionShader);
    const divergenceProgram = createProgram(gl, vShader, divergenceShader);
    const pressureProgram = createProgram(gl, vShader, pressureShader);
    const gradientSubtractProgram = createProgram(gl, vShader, gradientSubtractShader);
    const displayProgram = createProgram(gl, vShader, displayShader);

    // Setup buffers
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);

    // Framebuffers
    let width = canvas.width;
    let height = canvas.height;

    // Use half resolution for simulation to improve performance
    let simWidth = width >> 1;
    let simHeight = height >> 1;

    // Check for float texture support - try multiple approaches
    const floatExt = gl.getExtension('OES_texture_float');
    gl.getExtension('OES_texture_float_linear');
    const halfFloatExt = gl.getExtension('OES_texture_half_float');
    gl.getExtension('OES_texture_half_float_linear');

    // Function to test if a texture type works for rendering
    const testTextureType = (type: number): boolean => {
      const testTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, testTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, 4, 0, gl.RGBA, type, null);

      const testFbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, testFbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, testTexture, 0);
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(testFbo);
      gl.deleteTexture(testTexture);

      return status === gl.FRAMEBUFFER_COMPLETE;
    };

    // Determine best available texture type by testing
    let textureType: number = gl.UNSIGNED_BYTE;
    let filterType: number = gl.NEAREST; // Start with NEAREST which has better support

    if (floatExt && testTextureType(gl.FLOAT)) {
      textureType = gl.FLOAT;
      filterType = gl.LINEAR;
    } else if (halfFloatExt && testTextureType(halfFloatExt.HALF_FLOAT_OES)) {
      textureType = halfFloatExt.HALF_FLOAT_OES;
      filterType = gl.LINEAR;
    }

    const createFBO = (w: number, h: number) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterType);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterType);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, textureType, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

      // Double-check framebuffer is complete, fallback if needed
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      if (status !== gl.FRAMEBUFFER_COMPLETE) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      }

      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return { texture, fbo, width: w, height: h };
    };

    let density = createFBO(simWidth, simHeight);
    let densityTemp = createFBO(simWidth, simHeight);
    let velocity = createFBO(simWidth, simHeight);
    let velocityTemp = createFBO(simWidth, simHeight);
    let divergence = createFBO(simWidth, simHeight);
    let pressure = createFBO(simWidth, simHeight);
    let pressureTemp = createFBO(simWidth, simHeight);

    const blit = (destination: any) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, destination ? destination.fbo : null);
      gl.viewport(0, 0, destination ? destination.width : width, destination ? destination.height : height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    };

    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;

    // Initial splats
    const multipleSplats = (amount: number) => {
      for (let i = 0; i < amount; i++) {
        const color = [Math.random() * 10, Math.random() * 10, Math.random() * 10];
        const x = Math.random() * width;
        const y = Math.random() * height;
        const dx = 100 * (Math.random() - 0.5);
        const dy = 100 * (Math.random() - 0.5);

        if (splatProgram) {
          gl.useProgram(splatProgram);
          gl.uniform1i(gl.getUniformLocation(splatProgram, 'u_texture'), 0);
          gl.uniform1f(gl.getUniformLocation(splatProgram, 'u_radius'), 0.005 + Math.random() * 0.01);
          gl.uniform2f(gl.getUniformLocation(splatProgram, 'u_point'), x / width, 1.0 - y / height);
          gl.uniform2f(gl.getUniformLocation(splatProgram, 'u_resolution'), simWidth, simHeight);

          gl.uniform3f(gl.getUniformLocation(splatProgram, 'u_color'), dx, dy, 0.0);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, velocity.texture);
          blit(velocityTemp);
          [velocity, velocityTemp] = [velocityTemp, velocity];

          gl.uniform3f(gl.getUniformLocation(splatProgram, 'u_color'), color[0], color[1], color[2]);
          gl.bindTexture(gl.TEXTURE_2D, density.texture);
          blit(densityTemp);
          [density, densityTemp] = [densityTemp, density];
        }
      }
    };

    // Set up buffer BEFORE initial splats (required for drawing)
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    // Initial splats
    multipleSplats(Math.floor(Math.random() * 20) + 5);

    // Also add delayed splats to ensure they appear even if first batch fails
    const splatTimeout = setTimeout(() => {
      multipleSplats(Math.floor(Math.random() * 15) + 5);
    }, 100);

    const update = () => {
      const dt = 0.016;

      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      // Splat (Mouse interaction)
      if (isMoving && splatProgram) {
        gl.useProgram(splatProgram);
        gl.uniform1i(gl.getUniformLocation(splatProgram, 'u_texture'), 0);
        gl.uniform1f(gl.getUniformLocation(splatProgram, 'u_radius'), 0.005); // Smaller radius
        gl.uniform2f(gl.getUniformLocation(splatProgram, 'u_point'), mouseX / width, 1.0 - mouseY / height);
        gl.uniform2f(gl.getUniformLocation(splatProgram, 'u_resolution'), simWidth, simHeight);

        // Add velocity
        gl.uniform3f(gl.getUniformLocation(splatProgram, 'u_color'), (mouseX - lastMouseX) * 5, -(mouseY - lastMouseY) * 5, 0.0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.texture);
        blit(velocityTemp);
        [velocity, velocityTemp] = [velocityTemp, velocity];

        // Add density (Color)
        // Cycle colors
        const time = Date.now() * 0.001;
        const r = Math.sin(time) * 0.5 + 0.5;
        const g = Math.sin(time + 2) * 0.5 + 0.5;
        const b = Math.sin(time + 4) * 0.5 + 0.5;

        gl.uniform3f(gl.getUniformLocation(splatProgram, 'u_color'), r * 0.5, g * 0.5, b * 0.5); // Density amount
        gl.bindTexture(gl.TEXTURE_2D, density.texture);
        blit(densityTemp);
        [density, densityTemp] = [densityTemp, density];

        isMoving = false;
      }

      // Advection (Velocity)
      if (advectionProgram) {
        gl.useProgram(advectionProgram);
        gl.uniform1i(gl.getUniformLocation(advectionProgram, 'u_velocity'), 0);
        gl.uniform1i(gl.getUniformLocation(advectionProgram, 'u_source'), 0);
        gl.uniform1f(gl.getUniformLocation(advectionProgram, 'u_dt'), dt);
        gl.uniform1f(gl.getUniformLocation(advectionProgram, 'u_dissipation'), 0.98);
        gl.uniform2f(gl.getUniformLocation(advectionProgram, 'u_texelSize'), 1.0 / simWidth, 1.0 / simHeight);
        gl.uniform2f(gl.getUniformLocation(advectionProgram, 'u_resolution'), simWidth, simHeight);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.texture);
        blit(velocityTemp);
        [velocity, velocityTemp] = [velocityTemp, velocity];
      }

      // Advection (Density)
      if (advectionProgram) {
        gl.useProgram(advectionProgram);
        gl.uniform1i(gl.getUniformLocation(advectionProgram, 'u_velocity'), 0);
        gl.uniform1i(gl.getUniformLocation(advectionProgram, 'u_source'), 1);
        gl.uniform1f(gl.getUniformLocation(advectionProgram, 'u_dissipation'), 0.97);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.texture);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, density.texture);
        blit(densityTemp);
        [density, densityTemp] = [densityTemp, density];
      }

      // Divergence
      if (divergenceProgram) {
        gl.useProgram(divergenceProgram);
        gl.uniform1i(gl.getUniformLocation(divergenceProgram, 'u_velocity'), 0);
        gl.uniform2f(gl.getUniformLocation(divergenceProgram, 'u_texelSize'), 1.0 / simWidth, 1.0 / simHeight);
        gl.uniform2f(gl.getUniformLocation(divergenceProgram, 'u_resolution'), simWidth, simHeight);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, velocity.texture);
        blit(divergence);
      }

      // Pressure (Jacobi)
      if (pressureProgram) {
        gl.useProgram(pressureProgram);
        gl.uniform1i(gl.getUniformLocation(pressureProgram, 'u_divergence'), 0);
        gl.uniform1i(gl.getUniformLocation(pressureProgram, 'u_pressure'), 1);
        gl.uniform2f(gl.getUniformLocation(pressureProgram, 'u_texelSize'), 1.0 / simWidth, 1.0 / simHeight);
        gl.uniform2f(gl.getUniformLocation(pressureProgram, 'u_resolution'), simWidth, simHeight);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, divergence.texture);

        for (let i = 0; i < 20; i++) {
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, pressure.texture);
          blit(pressureTemp);
          [pressure, pressureTemp] = [pressureTemp, pressure];
        }
      }

      // Gradient Subtract
      if (gradientSubtractProgram) {
        gl.useProgram(gradientSubtractProgram);
        gl.uniform1i(gl.getUniformLocation(gradientSubtractProgram, 'u_pressure'), 0);
        gl.uniform1i(gl.getUniformLocation(gradientSubtractProgram, 'u_velocity'), 1);
        gl.uniform2f(gl.getUniformLocation(gradientSubtractProgram, 'u_texelSize'), 1.0 / simWidth, 1.0 / simHeight);
        gl.uniform2f(gl.getUniformLocation(gradientSubtractProgram, 'u_resolution'), simWidth, simHeight);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pressure.texture);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, velocity.texture);
        blit(velocityTemp);
        [velocity, velocityTemp] = [velocityTemp, velocity];
      }

      // Display
      if (displayProgram) {
        gl.useProgram(displayProgram);
        gl.uniform1i(gl.getUniformLocation(displayProgram, 'u_texture'), 0);
        gl.uniform2f(gl.getUniformLocation(displayProgram, 'u_resolution'), width, height);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, density.texture);
        blit(null); // Draw to screen
      }

      requestAnimationFrame(update);
    };

    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;
    };

    // Touch event handlers for mobile
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      lastMouseX = touch.clientX;
      lastMouseY = touch.clientY;
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      isMoving = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      mouseX = touch.clientX;
      mouseY = touch.clientY;
      isMoving = true;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      simWidth = width >> 1;
      simHeight = height >> 1;

      // Recreate all FBOs with new dimensions
      density = createFBO(simWidth, simHeight);
      densityTemp = createFBO(simWidth, simHeight);
      velocity = createFBO(simWidth, simHeight);
      velocityTemp = createFBO(simWidth, simHeight);
      divergence = createFBO(simWidth, simHeight);
      pressure = createFBO(simWidth, simHeight);
      pressureTemp = createFBO(simWidth, simHeight);

      // Add new splats after resize so it's not empty
      multipleSplats(Math.floor(Math.random() * 10) + 3);
    };
    window.addEventListener('resize', handleResize);

    update();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      clearTimeout(splatTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: '#000',
        touchAction: 'none',
      }}
    />
  );
};

export default FluidBackground;
