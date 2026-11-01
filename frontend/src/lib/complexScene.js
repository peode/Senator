import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// 3D-модель ЖК: будинки будуються зі статусів і кількості поверхів секцій.
// Усі координати задані на стандартній карті ЖК, один поверх — FLOOR її пікселів
const MAP = { w: 1262, h: 1246 };
const FLOOR = 15;

const STATUS_COLORS = {
  SELLING: "#3fae63",
  COMING_SOON: "#00aaff",
  PLANNED: "#ffb52e",
  SOLD: "#e64040",
};

// Ділянки плану, де намальована будівля без номера: їх закриваємо травою з поля поруч
const CLEARED = [[628, 100, 520, 195], [858, 295, 290, 170]];
const GRASS = [880, 505, 240, 130];

// Частина плану, яку лишаємо: вул. Руська зверху, без поля й вул. О. Пчілки справа
const CROP = { x0: 95, y0: 0, x1: 875, y1: 1232 };
const CENTER = { x: 485, y: 616 };

// Центр округлої частини вежі: її схід і південь упираються в секції 1 і 10
const TOWER = { x: 230, y: 246, rx: 73, ry: 73 };

// Контури будинків на карті: x0, y0, x1, y1
const FOOTPRINTS = {
  1: [303, 143, 412, 273],
  2: [412, 143, 518, 273],
  3: [518, 143, 627, 273],
  4: [516, 356, 640, 482],
  5: [640, 356, 764, 451],
  6: [703, 451, 795, 598],
  7: [703, 598, 795, 748],
  8: [662, 748, 794, 862],
  9: [535, 748, 662, 862],
  10: [195, 319, 287, 467],
  11: [195, 467, 287, 615],
  12: [195, 615, 287, 761],
  13: [195, 761, 287, 905],
  14: [197, 905, 293, 1087],
  15: [293, 958, 480, 1088],
  16: [157, 173, 303, 319],
};

// З якого боку наближати секцію: туди, де її нічого не закриває
const FRONT = {
  1: [0, -1], 2: [0, -1], 3: [0, -1], 4: [0, 1], 5: [0, -1], 6: [1, 0], 7: [1, 0], 8: [0, 1],
  9: [0, 1], 10: [-1, 0], 11: [-1, 0], 12: [-1, 0], 13: [-1, 0], 14: [-1, 0], 15: [0, 1], 16: [-0.72, -0.7],
};

// Фасади за фото ЖК
const styleOf = (id) => (id === 16 ? "tower" : id >= 4 && id <= 9 ? "brown" : "grey");

const toX = (x) => x - CENTER.x;
const toZ = (y) => y - CENTER.y;

export const createComplexScene = ({ container, sections, mapSrc, onHover, onFocus, onFloorHover, onFloorSelect }) => {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let disposed = false;

  const placed = sections
    .filter(({ id }) => FOOTPRINTS[id])
    .map((section) => ({ ...section, box: FOOTPRINTS[section.id] }));

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute("aria-label", "3D-модель ЖК Senator");
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#e6edf1");

  const camera = new THREE.PerspectiveCamera(32, 1, 10, 6000);
  camera.position.set(-640, 760, 1040);

  const makeControls = () => {
    const c = new OrbitControls(camera, renderer.domElement);
    c.enableDamping = true;
    c.dampingFactor = 0.08;
    c.enablePan = false;
    c.minPolarAngle = 0.15;
    c.maxPolarAngle = 1.38;
    return c;
  };

  let controls = makeControls();
  controls.target.set(0, 40, 0);
  controls.minDistance = 450;
  controls.maxDistance = 2000;
  controls.autoRotate = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  controls.autoRotateSpeed = 0.5;
  controls.addEventListener("start", () => { controls.autoRotate = false; });

  scene.add(new THREE.HemisphereLight("#ffffff", "#8c9a78", 0.85));
  const sun = new THREE.DirectionalLight("#fff2dc", 0.95);
  sun.position.set(-520, 900, 420);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -800, right: 800, top: 800, bottom: -800, near: 100, far: 2200 });
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 1.2;
  scene.add(sun);

  // Небо для відбиттів у склі
  const sky = (() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 128;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, "#5f8db8");
    grad.addColorStop(0.46, "#e9f1f6");
    grad.addColorStop(0.52, "#8a9486");
    grad.addColorStop(1, "#3c4438");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 128);
    g.fillStyle = "rgba(255, 255, 255, .85)";
    [[40, 34, 34], [150, 26, 42], [216, 40, 26]].forEach(([x, y, r]) => {
      g.beginPath();
      g.ellipse(x, y, r, r / 3, 0, 0, Math.PI * 2);
      g.fill();
    });
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.encoding = THREE.sRGBEncoding;
    return new THREE.PMREMGenerator(renderer).fromEquirectangular(tex).texture;
  })();

  const glassDark = () => new THREE.MeshStandardMaterial({ color: "#0b1119", metalness: 0.9, roughness: 0.12, envMap: sky, envMapIntensity: 0.5 });
  const glassClear = new THREE.MeshStandardMaterial({ color: "#a8cfe2", metalness: 0.55, roughness: 0.08, envMap: sky, transparent: true, opacity: 0.6 });
  const concrete = new THREE.MeshStandardMaterial({ color: "#f3f0ea", roughness: 0.7 });
  const leaves = new THREE.MeshLambertMaterial({ color: "#1e3f18", flatShading: true });

  // Текстури фасадів: один ряд текстури дорівнює одному поверху
  const SCALE = 5;
  const rowH = FLOOR * SCALE;

  const paintBrown = (g, c, cols, floors) => {
    g.fillStyle = "#6e4a3c";
    g.fillRect(0, 0, c.width, c.height);
    for (let y = 0, row = 0; y < c.height; y += 5, row++) {
      g.fillStyle = "rgba(0, 0, 0, .2)";
      g.fillRect(0, y, c.width, 1);
      for (let x = row % 2 ? 0 : 7; x < c.width; x += 15) {
        g.fillStyle = (x * 3 + row * 11) % 5 === 0 ? "rgba(255, 190, 150, .13)" : "rgba(0, 0, 0, .1)";
        g.fillRect(x, y + 1, 14, 4);
      }
    }
    const colW = c.width / cols;
    for (let r = 1; r < floors; r++) {
      for (let k = 0; k < cols; k++) {
        const tall = k % 3 === 0;
        const w = colW * (tall ? 0.74 : 0.52);
        const h = rowH * 0.74;
        const x = k * colW + (colW - w) / 2;
        const y = (floors - 1 - r) * rowH + rowH * 0.13;
        g.fillStyle = "#e9e6df";
        g.fillRect(x - 2, y - 2, w + 4, h + 4);
        g.fillStyle = (r * 5 + k * 3) % 7 < 2 ? "#a8bcc7" : "#28323a";
        g.fillRect(x, y, w, h);
        g.fillStyle = "#e9e6df";
        g.fillRect(x + w / 2 - 1, y, 2, h);
        g.fillRect(x, y + h * 0.38, w, 2);
      }
    }
    // Перший поверх: вітрини під білим карнизом
    const y = c.height - rowH;
    g.fillStyle = "#93aab4";
    g.fillRect(0, y, c.width, rowH);
    g.fillStyle = "#f1eee8";
    g.fillRect(0, y, c.width, 6);
    for (let x = 0; x < c.width; x += colW) g.fillRect(x, y, 4, rowH);
    g.fillStyle = "#2d211c";
    g.fillRect(0, 0, c.width, 8);
  };

  const paintGrey = (g, c, cols, floors) => {
    g.fillStyle = "#9da3a6";
    g.fillRect(0, 0, c.width, c.height);
    const colW = c.width / cols;
    for (let r = 0; r < floors; r++) {
      const y = r * rowH;
      g.fillStyle = "#b9bec0";
      g.fillRect(0, y + rowH - 5, c.width, 5);
      for (let k = 0; k < cols; k++) {
        const w = colW * 0.68;
        const h = rowH * 0.7;
        const x = k * colW + (colW - w) / 2;
        const wy = y + rowH * 0.12;
        g.fillStyle = "#3d4a54";
        g.fillRect(x - 2, wy - 2, w + 4, h + 4);
        g.fillStyle = (r * 7 + k * 13) % 9 < 2 ? "#a9c2d0" : "#22303b";
        g.fillRect(x, wy, w, h);
      }
    }
    g.fillStyle = "#59636a";
    g.fillRect(0, c.height - rowH, c.width, rowH);
  };

  // Тил вежі за фото: глуха бежева стіна, темне скло і стовпчик лоджій на розі
  const paintTowerBack = (g, c, floors) => {
    const W = c.width;
    g.fillStyle = "#b5ac9e";
    g.fillRect(0, 0, W, c.height);
    const glassFrom = W * 0.4, loggiaFrom = W * 0.76;
    g.fillStyle = "#131d28";
    g.fillRect(glassFrom, 0, loggiaFrom - glassFrom, c.height);
    for (let r = 0; r < floors; r++) {
      const y = r * rowH;
      const low = r >= floors - 7;
      if (low) {
        g.fillStyle = "#24333e";
        g.fillRect(glassFrom, y, loggiaFrom - glassFrom, rowH);
        g.fillStyle = "rgba(190, 205, 212, .5)";
        for (let x = glassFrom; x < loggiaFrom; x += 28) g.fillRect(x, y, 2, rowH);
        g.fillRect(glassFrom, y + rowH / 2, loggiaFrom - glassFrom, 2);
      }
      g.fillStyle = "#ddd8ce";
      g.fillRect(glassFrom, y + rowH - 4, loggiaFrom - glassFrom, 4);
      g.fillStyle = "#cfc7b9";
      g.fillRect(loggiaFrom, y, W - loggiaFrom, rowH);
      const bay = (W - loggiaFrom) / 2;
      for (let k = 0; k < 2; k++) {
        const x = loggiaFrom + k * bay;
        g.fillStyle = k ? "#1a2631" : "#6d5c4c";
        g.fillRect(x + 5, y + 8, bay - 10, rowH - 18);
        g.fillStyle = "#a9c0cb";
        g.fillRect(x + bay / 2 - 1, y + 8, 2, rowH - 18);
      }
      g.fillStyle = "#efeae1";
      g.fillRect(loggiaFrom, y + rowH - 6, W - loggiaFrom, 6);
    }
  };

  const facadeCache = new Map();
  const facade = (style, width, floors) => {
    const key = `${style}-${Math.round(width)}-${floors}`;
    if (facadeCache.has(key)) return facadeCache.get(key);
    const c = document.createElement("canvas");
    c.width = Math.ceil(width * SCALE);
    c.height = floors * rowH;
    const g = c.getContext("2d");
    const cols = Math.max(2, Math.round(width / 15));
    if (style === "brown") paintBrown(g, c, cols, floors);
    else if (style === "towerBack") paintTowerBack(g, c, floors);
    else paintGrey(g, c, cols, floors);
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    facadeCache.set(key, tex);
    return tex;
  };

  const roofOf = (edge, field) => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    g.fillStyle = field;
    g.fillRect(0, 0, 128, 128);
    g.strokeStyle = edge;
    g.lineWidth = 8;
    g.strokeRect(4, 4, 120, 120);
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  };
  const ROOFS = { brown: roofOf("#2d211c", "#8f8f8c"), grey: roofOf("#7c8387", "#a9adab") };

  // Балкони на всіх чотирьох стінах: білі плити для цегли, скляні для сірих секцій
  const addBalconies = (mesh, w, d, h, floors, material, size) => {
    const slots = [];
    const [bw, bh, bd] = size;
    const eachWall = (len, place) => {
      const bays = Math.floor(len / 30);
      for (let f = 1; f < floors; f++) {
        for (let b = 0; b < bays; b++) {
          if ((f + b) % 2 && material === concrete) continue;
          place(-len / 2 + (b + 0.5) * (len / bays), -h / 2 + f * FLOOR + (material === concrete ? 0 : FLOOR * 0.34));
        }
      }
    };
    eachWall(w, (x, y) => {
      slots.push([x, y, d / 2 + bd / 2, bw, bh, bd], [x, y, -d / 2 - bd / 2, bw, bh, bd]);
    });
    eachWall(d, (z, y) => {
      slots.push([w / 2 + bd / 2, y, z, bd, bh, bw], [-w / 2 - bd / 2, y, z, bd, bh, bw]);
    });
    const items = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material, slots.length);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    slots.forEach(([x, y, z, sx, sy, sz], i) => {
      m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(sx, sy, sz));
      items.setMatrixAt(i, m);
    });
    items.castShadow = true;
    mesh.add(items);
  };

  // Дах вежі: хвойні дерева за скляним огородженням
  const addRoofGarden = (parent, y, reach) => {
    const crown = new THREE.ConeGeometry(1, 2.6, 7);
    [[-0.55, -0.1], [-0.2, -0.55], [0.25, -0.35], [-0.35, 0.3], [0.2, 0.2], [-0.62, -0.42]].forEach(([a, b], i) => {
      const tree = new THREE.Mesh(crown, leaves);
      const size = 5.5 + (i % 3);
      tree.position.set(a * reach, y + size * 1.3, b * reach);
      tree.scale.setScalar(size);
      tree.castShadow = true;
      parent.add(tree);
    });
  };

  const makeBuilding = ({ id, box, floors }) => {
    const style = styleOf(id);
    const [x0, y0, x1, y1] = box;
    const w = x1 - x0, d = y1 - y0, h = floors * FLOOR;
    const side = (len) => new THREE.MeshStandardMaterial({ map: facade(style, len, floors), roughness: 0.85 });
    const roof = new THREE.MeshStandardMaterial({ map: ROOFS[style], roughness: 0.95 });
    const blank = new THREE.MeshBasicMaterial({ color: "#555" });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [side(d), side(d), roof, blank, side(w), side(w)]);
    mesh.position.set(toX((x0 + x1) / 2), h / 2, toZ((y0 + y1) / 2));
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    if (style === "brown") addBalconies(mesh, w, d, h, floors, concrete, [26, 1.8, 5]);
    if (style === "grey") addBalconies(mesh, w, d, h, floors, glassClear, [20, FLOOR * 0.62, 4]);
    const core = new THREE.Mesh(new THREE.BoxGeometry(Math.min(w, d) * 0.22, 9, Math.min(w, d) * 0.3), new THREE.MeshStandardMaterial({ color: "#c9c8c1", roughness: 0.9 }));
    core.position.set(0, h / 2 + 4.5, 0);
    core.castShadow = true;
    mesh.add(core);
    return mesh;
  };

  // Вежа з фото: скло округле лише там, де вільно, а до секцій 1 і 10 вона стоїть прямими стінами
  const makeTower = ({ floors }) => {
    const { x, y, rx, ry } = TOWER;
    const H = floors * FLOOR;
    const curve = new THREE.CatmullRomCurve3([[0.62, 0], [0.78, 0.1], [0.97, 0.26], [1, 0.38], [0.95, 0.58], [0.88, 0.8], [0.87, 0.93], [0.9, 1]].map(([r, t]) => new THREE.Vector3(r, t, 0)));
    const samples = curve.getPoints(60);
    const widthAt = (t) => samples.reduce((best, p) => (Math.abs(p.y - t) < Math.abs(best.y - t) ? p : best)).x;
    // u: 0 біля стіни із секцією 1, 1 біля стіни із секцією 10; краї лишаються на місці, вигинається лише середина
    const at = (u, t) => {
      const a = -u * Math.PI * 1.5;
      const scale = 1 - (1 - widthAt(t)) * Math.min(1, Math.sin(u * Math.PI) * 1.6);
      return new THREE.Vector3(Math.cos(a) * rx * scale, t * H, Math.sin(a) * ry * scale);
    };

    const positions = [], uvs = [], index = [];
    const U = 72, V = 40;
    for (let i = 0; i <= U; i++) {
      for (let j = 0; j <= V; j++) {
        const p = at(i / U, j / V);
        positions.push(p.x, p.y, p.z);
        uvs.push(i / U, j / V);
      }
    }
    for (let i = 0; i < U; i++) {
      for (let j = 0; j < V; j++) {
        const a = i * (V + 1) + j, b = a + V + 1;
        index.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    const curvedCount = index.length;
    const wall = (ax, az, bx, bz) => {
      const n = positions.length / 3;
      positions.push(ax, 0, az, bx, 0, bz, bx, H, bz, ax, H, az);
      uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
      index.push(n, n + 1, n + 2, n, n + 2, n + 3);
    };
    wall(rx, 0, rx, ry);
    wall(0, ry, rx, ry);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(index);
    geometry.computeVertexNormals();
    geometry.addGroup(0, curvedCount, 0);
    geometry.addGroup(curvedCount, 6, 1);
    geometry.addGroup(curvedCount + 6, 6, 2);

    const glass = glassDark();
    glass.side = THREE.DoubleSide;
    const side = () => new THREE.MeshStandardMaterial({ map: facade("towerBack", rx, floors), roughness: 0.85, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, [glass, side(), side()]);
    mesh.position.set(toX(x), 0, toZ(y));
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);

    const along = (points, radius) => {
      const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), points.length * 2, radius, 5), concrete);
      mesh.add(tube);
    };
    for (let f = 1; f <= floors; f++) {
      const points = [];
      for (let i = 0; i <= 44; i++) points.push(at(i / 44, f / floors));
      along(points, f === floors ? 1.6 : 0.45);
    }
    // Дві білі лінії на склі: вони розходяться знизу вгору
    [[0.82, 0.74], [0.6, 0.4]].forEach(([from, to]) => {
      const points = [];
      for (let i = 0; i <= 36; i++) {
        const t = i / 36;
        const ease = t * t * (3 - 2 * t);
        const p = at(from + (to - from) * ease + Math.sin(t * Math.PI * 2) * 0.035, t);
        points.push(p.setX(p.x * 1.012).setZ(p.z * 1.012));
      }
      along(points, 1.7);
    });

    // Тераси з рослинами збоку вежі, на нижніх поверхах
    const slab = new THREE.MeshStandardMaterial({ color: "#2b333b", roughness: 0.6 });
    for (let f = 2; f <= 9; f++) {
      const p = at(0.1, (f - 0.15) / floors);
      const out = Math.atan2(p.z, p.x);
      const terrace = new THREE.Mesh(new THREE.BoxGeometry(14, 2, 28), slab);
      terrace.position.set(p.x + Math.cos(out) * 4, p.y, p.z + Math.sin(out) * 4);
      terrace.rotation.y = -out;
      terrace.castShadow = true;
      mesh.add(terrace);
      [-8, 8].forEach((shift) => {
        const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(3.4, 1), leaves);
        bush.position.set(terrace.position.x + Math.cos(out) * 2 - Math.sin(out) * shift, p.y + 4, terrace.position.z + Math.sin(out) * 2 + Math.cos(out) * shift);
        mesh.add(bush);
      });
    }

    // Блік на склі, як на фото
    const glare = [];
    for (let i = 0; i <= 16; i++) glare.push(at(0.41, 0.42 + i * 0.027).multiply(new THREE.Vector3(1.016, 1, 1.016)));
    mesh.add(new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(glare), 32, 1.5, 6),
      new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.55 }),
    ));

    const railing = [];
    for (let i = 0; i <= 44; i++) railing.push(at(i / 44, 1).setY(H + 7));
    along(railing, 0.4);

    const outline = new THREE.Shape();
    for (let i = 0; i <= 44; i++) {
      const p = at(i / 44, 1);
      if (i) outline.lineTo(p.x, p.z);
      else outline.moveTo(p.x, p.z);
    }
    outline.lineTo(rx, ry);
    const lawn = new THREE.Mesh(new THREE.ShapeGeometry(outline), new THREE.MeshLambertMaterial({ color: "#6f8a58", side: THREE.DoubleSide }));
    lawn.rotation.x = Math.PI / 2;
    lawn.position.y = H - 0.4;
    mesh.add(lawn);
    addRoofGarden(mesh, H, rx * 0.9);
    // Контур поверху: для підсвітки при виборі
    mesh.userData.outlineAt = (t) => {
      const shape = new THREE.Shape();
      for (let i = 0; i <= 44; i++) {
        const p = at(i / 44, t);
        if (i) shape.lineTo(p.x * 1.02, p.z * 1.02);
        else shape.moveTo(p.x * 1.02, p.z * 1.02);
      }
      shape.lineTo(rx + 1, ry + 1);
      return shape;
    };
    return mesh;
  };

  const badge = (section) => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    g.beginPath();
    g.arc(64, 64, 58, 0, Math.PI * 2);
    g.fillStyle = STATUS_COLORS[section.status];
    g.fill();
    g.lineWidth = 7;
    g.strokeStyle = "#ffffff";
    g.stroke();
    g.fillStyle = section.status === "COMING_SOON" || section.status === "PLANNED" ? "#17252c" : "#ffffff";
    g.font = "700 60px 'Geist Variable', Arial, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(section.id, 64, 68);
    const tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true, sizeAttenuation: true }));
    sprite.scale.set(46, 46, 1);
    sprite.renderOrder = 10;
    return sprite;
  };

  const surfaces = (mesh) => [].concat(mesh.material).filter((m) => m.emissive);

  const tags = [];

  const parts = placed.map((section) => {
    const mesh = styleOf(section.id) === "tower" ? makeTower(section) : makeBuilding(section);
    mesh.userData.section = section;
    const glow = new THREE.Color(STATUS_COLORS[section.status]);
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry, 40),
      new THREE.LineBasicMaterial({ color: glow, transparent: true, opacity: 0, depthTest: false }),
    );
    outline.renderOrder = 5;
    mesh.add(outline);
    const tag = badge(section);
    tags.push(tag);
    tag.position.set(mesh.position.x, section.floors * FLOOR + 42, mesh.position.z);
    scene.add(tag);
    surfaces(mesh).forEach((m) => {
      m.emissive = glow.clone();
      m.emissiveIntensity = 0;
      m.userData.base = m.color.clone();
    });
    const band = new THREE.MeshBasicMaterial({ color: glow, transparent: true, opacity: 0.62, depthWrite: false });
    return { section, mesh, outline, band, bands: new Map(), amount: 0 };
  });
  const meshes = parts.map((p) => p.mesh);

  // Земля: сам план ЖК, а дерева стоять там, де на ньому зелені крони
  const planted = (px, py) => placed.some(({ box: [a, b, c, d] }) => px > a - 12 && px < c + 12 && py > b - 12 && py < d + 12);

  const treeTops = new THREE.MeshLambertMaterial({ color: "#ffffff", flatShading: true, transparent: true });

  let trunks = null;

  const addTrees = (g) => {
    const { data } = g.getImageData(0, 0, MAP.w, MAP.h);
    const spots = [];
    for (let y = CROP.y0 + 100; y < CROP.y1 - 30; y += 15) {
      for (let x = CROP.x0 + 30; x < CROP.x1 - 30; x += 15) {
        const px = x + ((y * 7 + x * 3) % 9) - 4;
        const py = y + ((x * 5 + y) % 9) - 4;
        const i = (py * MAP.w + px) * 4;
        const [r, gr, b] = [data[i], data[i + 1], data[i + 2]];
        if (gr > r * 1.12 && gr > b * 1.3 && gr < 112 && !planted(px, py)) spots.push([px, py]);
      }
    }
    const crown = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), treeTops, spots.length);
    const trunk = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.1, 0.14, 1, 6),
      new THREE.MeshLambertMaterial({ color: "#5d4a38" }),
      spots.length,
    );
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const color = new THREE.Color();
    spots.forEach(([px, py], n) => {
      const seed = (px * 17 + py * 31) % 100 / 100;
      const size = 11 + seed * 9;
      const height = 20 + seed * 18;
      m.compose(new THREE.Vector3(toX(px), height, toZ(py)), q, new THREE.Vector3(size, size * 1.25, size));
      crown.setMatrixAt(n, m);
      crown.setColorAt(n, color.setHSL(0.27 + seed * 0.05, 0.5, 0.09 + seed * 0.06));
      m.compose(new THREE.Vector3(toX(px), height / 2, toZ(py)), q, new THREE.Vector3(size, height, size));
      trunk.setMatrixAt(n, m);
    });
    crown.castShadow = trunk.castShadow = true;
    trunks = trunk;
    trunk.visible = !focused;
    scene.add(crown, trunk);
  };

  new THREE.TextureLoader().load(mapSrc, ({ image }) => {
    if (disposed) return;
    const c = document.createElement("canvas");
    c.width = MAP.w;
    c.height = MAP.h;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(image, 0, 0, MAP.w, MAP.h);
    const [sx, sy, sw, sh] = GRASS;
    CLEARED.forEach(([x, y, w, h]) => {
      g.save();
      g.beginPath();
      g.rect(x, y, w, h);
      g.clip();
      for (let py = y; py < y + h; py += sh) {
        for (let px = x; px < x + w; px += sw) g.drawImage(c, sx, sy, sw, sh, px, py, sw, sh);
      }
      g.restore();
    });
    const width = CROP.x1 - CROP.x0, depth = CROP.y1 - CROP.y0;
    const cut = document.createElement("canvas");
    cut.width = width;
    cut.height = depth;
    const gc = cut.getContext("2d");
    gc.drawImage(c, -CROP.x0, -CROP.y0);
    // Краї плавно зникають у тлі, щоб ділянка не обривалась різко
    gc.globalCompositeOperation = "destination-out";
    const fade = (x0, y0, x1, y1, rect) => {
      const grad = gc.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, "rgba(0, 0, 0, 1)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      gc.fillStyle = grad;
      gc.fillRect(...rect);
    };
    fade(0, 0, 60, 0, [0, 0, 60, depth]);
    fade(width, 0, width - 60, 0, [width - 60, 0, 60, depth]);
    fade(0, depth, 0, depth - 70, [0, depth - 70, width, 70]);
    fade(0, 0, 0, 22, [0, 0, width, 22]);
    const tex = new THREE.CanvasTexture(cut);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshStandardMaterial({ map: tex, roughness: 1, transparent: true }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(toX((CROP.x0 + CROP.x1) / 2), 0, toZ((CROP.y0 + CROP.y1) / 2));
    ground.receiveShadow = true;
    scene.add(ground);
    addTrees(g);
  });

  // Шлях: огляд → секція з вибором поверху → план на сторінці секції
  const el = renderer.domElement;
  let hovered = null;
  let focused = null;
  let shown = null; // підсвічений поверх: [секція, номер, сітка]
  let tween = null;
  let home = null;
  let down = null;
  let frame = 0;
  const shift = { x: 0, y: 0 };

  const refresh = () => {
    el.style.cursor = hovered ? "pointer" : "";
    // Під час вибору поверху номери й крони не закривають фасад
    tags.forEach((tag) => {
      tag.visible = !focused;
    });
    treeTops.opacity = focused ? 0.28 : 1;
    treeTops.depthWrite = !focused;
    if (trunks) trunks.visible = !focused;
  };

  const bandOf = (part, number) => {
    const { section, mesh, bands } = part;
    if (!bands.has(number)) {
      const geometry = mesh.userData.outlineAt
        ? new THREE.ExtrudeGeometry(mesh.userData.outlineAt((number - 0.5) / section.floors), { depth: FLOOR, bevelEnabled: false })
            .rotateX(Math.PI / 2)
            .translate(0, FLOOR, 0)
        : new THREE.BoxGeometry(section.box[2] - section.box[0] + 2, FLOOR, section.box[3] - section.box[1] + 2);
      const band = new THREE.Mesh(geometry, part.band);
      band.position.y = mesh.userData.outlineAt
        ? (number - 1) * FLOOR
        : (number - 0.5) * FLOOR - (section.floors * FLOOR) / 2;
      band.renderOrder = 4;
      bands.set(number, band);
    }
    return bands.get(number);
  };

  const showFloor = (number) => {
    if (shown?.[0] === focused && shown?.[1] === (number ?? null)) return;
    if (shown) shown[0].mesh.remove(shown[2]);
    shown = null;
    if (!focused || !number) return;
    const band = bandOf(focused, number);
    focused.mesh.add(band);
    shown = [focused, number, band];
  };

  const fly = (position, target, offset) => {
    // Новий контролер скидає незавершене перетягування: інакше камера ходитиме за курсором
    const { target: pivot, minDistance, maxDistance } = controls;
    controls.dispose();
    controls = makeControls();
    controls.target.copy(pivot);
    controls.minDistance = minDistance;
    controls.maxDistance = maxDistance;
    tween = {
      start: performance.now(),
      time: still ? 1 : 950,
      from: [camera.position.clone(), controls.target.clone(), shift.x, shift.y],
      to: [position, target, offset.x, offset.y],
    };
    controls.enabled = false;
  };

  const focus = (id) => {
    const part = parts.find(({ section }) => section.id === id);
    if (!part || part === focused) return;
    showFloor(null);
    controls.autoRotate = false;
    if (!focused) home = [camera.position.clone(), controls.target.clone()];
    focused = part;
    hovered = null;
    const { section } = part;
    const [x0, y0, x1, y1] = section.box;
    const h = section.floors * FLOOR;
    const [dx, dz] = FRONT[section.id];
    const center = new THREE.Vector3(toX((x0 + x1) / 2), h / 2, toZ((y0 + y1) / 2));
    const facing = dx && dz ? Math.max(x1 - x0, y1 - y0) : dx ? y1 - y0 : x1 - x0;
    const { width, height } = container.getBoundingClientRect();
    const phone = width <= 640;
    const usableW = phone ? width : width - 280;
    const usableH = phone ? height * 0.5 : height;
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const distance = Math.max(((h * 0.95) / tan) * (height / usableH), (facing * 0.95) / (tan * (usableW / height)));
    const position = center.clone().add(new THREE.Vector3(dx * distance, distance * 0.26, dz * distance));
    controls.minDistance = 160;
    fly(position, center, phone ? { x: 0, y: height * 0.24 } : { x: 132, y: 0 });
    refresh();
    onHover(null);
    onFocus(section.id);
  };

  const overview = () => {
    if (!focused) return;
    showFloor(null);
    focused = null;
    controls.minDistance = 450;
    fly(home[0], home[1], { x: 0, y: 0 });
    refresh();
    onFocus(null);
  };

  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pick = (event) => {
    const rect = el.getBoundingClientRect();
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(pointer, camera);
    const hit = ray.intersectObjects(meshes, false)[0];
    if (!hit) return null;
    const part = parts.find((p) => p.mesh === hit.object);
    return { part, floor: Math.min(part.section.floors, Math.max(1, Math.ceil(hit.point.y / FLOOR))) };
  };

  const onPointerDown = (event) => {
    down = { x: event.clientX, y: event.clientY };
    hovered = null;
    refresh();
    onHover(null);
  };

  const onPointerMove = (event) => {
    if (event.pointerType === "touch" || event.buttons || tween) return;
    const hit = pick(event);
    hovered = hit?.part ?? null;
    refresh();
    onHover(hovered && hovered !== focused ? hovered.section.id : null, event);
    if (focused) {
      const number = hit?.part === focused ? hit.floor : null;
      showFloor(number);
      onFloorHover(number);
    }
  };

  const onPointerLeave = () => {
    hovered = null;
    showFloor(null);
    refresh();
    onHover(null);
    onFloorHover(null);
  };

  const onPointerUp = (event) => {
    const start = down;
    down = null;
    if (!start || tween || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6) return;
    const hit = pick(event);
    if (!hit) return;
    if (hit.part === focused) onFloorSelect(hit.part.section.id, hit.floor);
    else focus(hit.part.section.id);
  };

  // Коліщатко гортає сторінку, а не змінює масштаб: наближає лише жест двома пальцями на тачпаді
  const onWheel = (event) => {
    if (!event.ctrlKey) event.stopPropagation();
  };

  el.addEventListener("pointerdown", onPointerDown);
  el.addEventListener("pointermove", onPointerMove);
  el.addEventListener("pointerleave", onPointerLeave);
  el.addEventListener("pointerup", onPointerUp);
  container.addEventListener("wheel", onWheel, { capture: true, passive: true });

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    if (shift.x || shift.y) camera.setViewOffset(width, height, shift.x, shift.y, width, height);
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  // На вузькому екрані камера стартує далі, щоб у кадр вмістився весь ЖК
  if (camera.aspect < 1.2) {
    const away = camera.position.clone().sub(controls.target).multiplyScalar(Math.min(1.2 / camera.aspect, 2.4));
    camera.position.copy(controls.target).add(away);
    controls.maxDistance = away.length() * 1.15;
  }

  const applyShift = () => {
    const { width, height } = container.getBoundingClientRect();
    if (shift.x || shift.y) camera.setViewOffset(width, height, shift.x, shift.y, width, height);
    else camera.clearViewOffset();
  };

  const tick = (now) => {
    if (tween) {
      const raw = Math.min(1, (now - tween.start) / tween.time);
      const k = raw < 0.5 ? 4 * raw ** 3 : 1 - (-2 * raw + 2) ** 3 / 2;
      const [p0, t0, sx0, sy0] = tween.from;
      const [p1, t1, sx1, sy1] = tween.to;
      camera.position.lerpVectors(p0, p1, k);
      controls.target.lerpVectors(t0, t1, k);
      shift.x = sx0 + (sx1 - sx0) * k;
      shift.y = sy0 + (sy1 - sy0) * k;
      applyShift();
      if (raw === 1) {
        tween = null;
        controls.enabled = true;
      }
    }
    controls.update();
    const current = hovered && hovered !== focused ? hovered : null;
    parts.forEach((p) => {
      const goal = p === current ? 1 : 0;
      if (Math.abs(p.amount - goal) > 0.002) {
        p.amount += (goal - p.amount) * 0.22;
        surfaces(p.mesh).forEach((m) => {
          m.emissiveIntensity = p.amount * 0.45;
          m.color.lerpColors(m.userData.base, m.emissive, p.amount * 0.7);
        });
        p.outline.material.opacity = p.amount;
      }
    });
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    controls.dispose();
    el.removeEventListener("pointerdown", onPointerDown);
    el.removeEventListener("pointermove", onPointerMove);
    el.removeEventListener("pointerleave", onPointerLeave);
    el.removeEventListener("pointerup", onPointerUp);
    container.removeEventListener("wheel", onWheel, { capture: true });
    scene.traverse((object) => {
      object.geometry?.dispose();
      [].concat(object.material ?? []).forEach((material) => {
        material.map?.dispose();
        material.dispose();
      });
    });
    renderer.dispose();
    el.remove();
  };

  return { focus, overview, showFloor, dispose };
};
