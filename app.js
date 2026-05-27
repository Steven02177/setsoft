// ═══════════════════════════════════════════════
//  SetSoft — Lógica principal
//  Proyecto de Aula · Matemática Discreta · UDES 2025
// ═══════════════════════════════════════════════

// ── Estado global ────────────────────────────
let opActual = 'union';
let ultimoA = [], ultimoB = [], ultimoU = [], ultimoRes = [];

// ── Datos de cada operación ──────────────────
const DATOS = {
  union: {
    label: 'A ∪ B =',
    explain: 'La <strong>unión</strong> contiene todos los elementos que están en A, en B, o en ambos. Los elementos que aparecen en los dos conjuntos se incluyen una sola vez porque en un conjunto no hay repetidos.',
    explainPython: 'En Python, los conjuntos (<code>set</code>) son colecciones que no admiten repetidos. El operador <code>|</code> une dos conjuntos igual que la unión matemática: toma todos los elementos de ambos y elimina los duplicados automáticamente. También puedes escribirlo como <code>A.union(B)</code>, el resultado es el mismo.',
    explainSQL: 'En SQL, la palabra clave <code>UNION</code> combina los resultados de dos consultas en una sola lista. Las filas que aparezcan en las dos tablas se muestran una sola vez (sin repetir). Es como decir: "dame todo lo de la tabla A más todo lo de la tabla B, sin duplicados".',
    explainJS: 'En JavaScript, los <code>Set</code> funcionan igual que los conjuntos matemáticos: guardan valores únicos. Para hacer la unión usamos el operador <em>spread</em> (<code>...</code>) para mezclar los dos conjuntos en uno nuevo. Cualquier valor repetido desaparece solo porque <code>Set</code> no permite duplicados.',
    python: (A, B) => {
      const res = [...new Set([...A, ...B])];
      return `A = {${A.join(', ')}}\nB = {${B.join(', ')}}\n\nresultado = A | B\nprint(resultado)   # {${res.join(', ')}}\n\n# También se puede escribir así:\nresultado = A.union(B)`;
    },
    sql: (A, B) => {
      const res = [...new Set([...A, ...B])];
      return `-- La UNION combina los resultados de dos consultas\n-- eliminando los registros duplicados.\nSELECT id, nombre FROM tabla_a\nUNION\nSELECT id, nombre FROM tabla_b;\n\n-- A = {${A.join(', ')}}\n-- B = {${B.join(', ')}}\n-- Resultado = {${res.join(', ')}}`;
    },
    js: (A, B) => {
      const res = [...new Set([...A, ...B])];
      return `const A = new Set([${A.join(', ')}]);\nconst B = new Set([${B.join(', ')}]);\n\n// Unión: combinar y eliminar duplicados\nconst union = new Set([...A, ...B]);\nconsole.log([...union]); // [${res.join(', ')}]`;
    }
  },

  interseccion: {
    label: 'A ∩ B =',
    explain: 'La <strong>intersección</strong> contiene únicamente los elementos que están en A <em>y al mismo tiempo</em> en B. Si un elemento no está en los dos conjuntos, no aparece en el resultado.',
    explainPython: 'El operador <code>&</code> en Python filtra solo los elementos que existen en <strong>ambos</strong> conjuntos al mismo tiempo. Si un elemento está en A pero no en B (o al revés), no entra en el resultado. Es como buscar lo que dos listas tienen en común.',
    explainSQL: 'El <code>INNER JOIN</code> devuelve únicamente las filas que tienen una coincidencia en las dos tablas. Si un registro existe en la tabla A pero no en B, o viceversa, no aparece en el resultado. Es la forma más común de cruzar datos entre dos tablas.',
    explainJS: 'Usamos <code>.filter()</code> para quedarnos solo con los elementos de A que también existen en B (verificado con <code>.has()</code>). El resultado es un nuevo <code>Set</code> con solo lo que comparten los dos conjuntos; lo que sea exclusivo de uno u otro queda fuera.',
    python: (A, B) => {
      const res = A.filter(x => B.includes(x));
      return `A = {${A.join(', ')}}\nB = {${B.join(', ')}}\n\nresultado = A & B\nprint(resultado)   # {${res.join(', ')}}\n\n# También se puede escribir así:\nresultado = A.intersection(B)`;
    },
    sql: (A, B) => {
      const res = A.filter(x => B.includes(x));
      return `-- El INNER JOIN devuelve solo las filas que\n-- tienen correspondencia en AMBAS tablas.\nSELECT a.id, a.nombre\nFROM tabla_a a\nINNER JOIN tabla_b b ON a.id = b.id;\n\n-- A = {${A.join(', ')}}\n-- B = {${B.join(', ')}}\n-- Resultado = {${res.join(', ')}}`;
    },
    js: (A, B) => {
      const res = A.filter(x => B.includes(x));
      return `const A = new Set([${A.join(', ')}]);\nconst B = new Set([${B.join(', ')}]);\n\n// Intersección: solo los que están en los dos\nconst interseccion = new Set([...A].filter(x => B.has(x)));\nconsole.log([...interseccion]); // [${res.join(', ')}]`;
    }
  },

  diferencia: {
    label: 'A − B =',
    explain: 'La <strong>diferencia A − B</strong> contiene los elementos que están en A pero <em>no</em> están en B. Importante: A − B y B − A son resultados completamente distintos, la diferencia no es conmutativa.',
    explainPython: 'El operador <code>-</code> entre dos conjuntos de Python recorre A y descarta cualquier elemento que también aparezca en B. Solo sobreviven los que son <strong>exclusivos de A</strong>. Ojo: <code>A - B</code> y <code>B - A</code> dan resultados distintos, el orden importa.',
    explainSQL: '<code>NOT IN</code> actúa como un filtro de exclusión: primero obtiene todos los IDs de la tabla B, y luego devuelve solo las filas de A cuyo ID no aparece en esa lista. Es útil cuando quieres saber "qué registros de A no tienen contraparte en B".',
    explainJS: 'Con <code>.filter(x => !B.has(x))</code> recorremos A y usamos el signo <code>!</code> (negación) para quedarnos solo con los elementos que <strong>no</strong> están en B. El resultado es un nuevo <code>Set</code> con lo que es único de A.',
    python: (A, B) => {
      const res = A.filter(x => !B.includes(x));
      return `A = {${A.join(', ')}}\nB = {${B.join(', ')}}\n\nresultado = A - B\nprint(resultado)   # {${res.join(', ')}}\n\n# También se puede escribir así:\nresultado = A.difference(B)`;
    },
    sql: (A, B) => {
      const res = A.filter(x => !B.includes(x));
      return `-- NOT IN excluye de la primera tabla\n-- todos los registros que aparecen en la segunda.\nSELECT id, nombre FROM tabla_a\nWHERE id NOT IN (\n  SELECT id FROM tabla_b\n);\n\n-- A = {${A.join(', ')}}\n-- B = {${B.join(', ')}}\n-- Resultado = {${res.join(', ')}}`;
    },
    js: (A, B) => {
      const res = A.filter(x => !B.includes(x));
      return `const A = new Set([${A.join(', ')}]);\nconst B = new Set([${B.join(', ')}]);\n\n// Diferencia: los de A que no están en B\nconst diferencia = new Set([...A].filter(x => !B.has(x)));\nconsole.log([...diferencia]); // [${res.join(', ')}]`;
    }
  },

  complemento: {
    label: "A′ = U − A =",
    explain: 'El <strong>complemento de A</strong> respecto al universo U contiene todo lo que está en U pero <em>no</em> está en A. Siempre hay que definir el universo de referencia: es el "todo" dentro del problema.',
    explainPython: 'Para calcular el complemento necesitamos el universo U: restamos A de U con el operador <code>-</code>. Python descarta de U todos los elementos que también estén en A, dejando solo los que pertenecen al universo pero no al conjunto A. Sin definir U no hay complemento posible.',
    explainSQL: 'Consultamos toda la tabla <em>universo</em> y excluimos con <code>NOT IN</code> los registros que aparecen en la tabla A. Así obtenemos "todo lo demás": los elementos del universo que no forman parte de A. La tabla universo actúa como el conjunto referencia.',
    explainJS: 'Partimos del conjunto U y usamos <code>.filter(x => !A.has(x))</code> para eliminar todo lo que esté en A. Lo que queda son los elementos del universo que no pertenecen a A. Al igual que en matemáticas, sin definir U primero no podemos calcular el complemento.',
    python: (A, B, U) => {
      const res = U.filter(x => !A.includes(x));
      return `U = {${U.join(', ')}}\nA = {${A.join(', ')}}\n\nresultado = U - A\nprint(resultado)   # {${res.join(', ')}}\n\n# El complemento es la diferencia del universo menos A`;
    },
    sql: (A, B, U) => {
      const res = U.filter(x => !A.includes(x));
      return `-- Seleccionar todos los del universo\n-- que NO están en la tabla A.\nSELECT id, nombre FROM universo\nWHERE id NOT IN (\n  SELECT id FROM tabla_a\n);\n\n-- U = {${U.join(', ')}}\n-- A = {${A.join(', ')}}\n-- Resultado = {${res.join(', ')}}`;
    },
    js: (A, B, U) => {
      const res = U.filter(x => !A.includes(x));
      return `const U = new Set([${U.join(', ')}]);\nconst A = new Set([${A.join(', ')}]);\n\n// Complemento: los del universo que no están en A\nconst complemento = new Set([...U].filter(x => !A.has(x)));\nconsole.log([...complemento]); // [${res.join(', ')}]`;
    }
  }
};

// ── Helpers ──────────────────────────────────
function parsear(txt) {
  if (!txt.trim()) return [];
  const arr = txt.split(',').map(x => x.trim()).filter(x => x !== '');
  return [...new Set(arr)];
}

function fmtSet(arr) {
  if (arr.length === 0) return '∅  (conjunto vacío)';
  return '{ ' + arr.join(',  ') + ' }';
}

// ── Seleccionar operación ────────────────────
function selectOp(btn) {
  document.querySelectorAll('.op-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  opActual = btn.dataset.op;
}

// ── Mostrar pestaña de código ────────────────
let tabActual = 'python';
function showTab(tab, btn) {
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['Python','SQL','JS'].forEach(t => {
    document.getElementById('code' + t).style.display = 'none';
  });
  const map = { python: 'codePython', sql: 'codeSQL', js: 'codeJS' };
  document.getElementById(map[tab]).style.display = 'block';
  tabActual = tab;
  actualizarExplicacionCodigo();
}

// ── Mostrar / ocultar error ──────────────────
function mostrarError(msg) {
  const box = document.getElementById('errorBox');
  document.getElementById('errorMsg').textContent = msg;
  box.style.display = 'flex';
}
function ocultarError() {
  document.getElementById('errorBox').style.display = 'none';
}

// ── Actualizar explicación de código según pestaña ──
function actualizarExplicacionCodigo() {
  const d = DATOS[opActual];
  if (!d) return;
  const map = { python: d.explainPython, sql: d.explainSQL, js: d.explainJS };
  const texto = map[tabActual] || '';
  document.getElementById('explainCodeText').innerHTML = texto;
}

// ── Calcular ─────────────────────────────────
function calcular() {
  ocultarError();

  const A = parsear(document.getElementById('inA').value);
  const B = parsear(document.getElementById('inB').value);
  const U = parsear(document.getElementById('inU').value);

  // Validaciones
  if (A.length === 0) {
    mostrarError('El Conjunto A está vacío. Ingresa al menos un elemento.');
    return;
  }
  if (opActual !== 'complemento' && B.length === 0) {
    mostrarError('El Conjunto B está vacío. Ingresa al menos un elemento.');
    return;
  }
  if (opActual === 'complemento' && U.length === 0) {
    mostrarError('El Universo U está vacío. Es necesario para calcular el complemento.');
    return;
  }
  if (opActual === 'complemento') {
    const fueraU = A.filter(x => !U.includes(x));
    if (fueraU.length > 0) {
      mostrarError('Los elementos ' + fueraU.join(', ') + ' están en A pero no en U. El conjunto A debe ser subconjunto de U.');
      return;
    }
  }

  // Calcular resultado
  let res = [];
  if      (opActual === 'union')        res = [...new Set([...A, ...B])];
  else if (opActual === 'interseccion') res = A.filter(x => B.includes(x));
  else if (opActual === 'diferencia')   res = A.filter(x => !B.includes(x));
  else if (opActual === 'complemento')  res = U.filter(x => !A.includes(x));

  // Guardar para la descarga
  ultimoA = A; ultimoB = B; ultimoU = U; ultimoRes = res;

  // Actualizar UI
  const d = DATOS[opActual];
  document.getElementById('resultOp').textContent    = d.label;
  document.getElementById('resultVal').textContent   = fmtSet(res);
  document.getElementById('resultCount').textContent = res.length;
  document.getElementById('explainText').innerHTML   = d.explain;

  // Generar código dinámico con los valores reales
  document.getElementById('codePython').textContent = d.python(A, B, U);
  document.getElementById('codeSQL').textContent    = d.sql(A, B, U);
  document.getElementById('codeJS').textContent     = d.js(A, B, U);

  // Leyenda del diagrama
  const showLegend = opActual !== 'complemento';
  document.getElementById('vennLegend').style.display = showLegend ? 'flex' : 'none';

  // Actualizar explicación de código
  actualizarExplicacionCodigo();

  // Dibujar diagrama
  dibujarVenn(A, B, U, res, opActual);
}

// ── Diagrama de Venn ─────────────────────────
function dibujarVenn(A, B, U, res, op) {
  const canvas = document.getElementById('venn');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const BLUE   = '#3b82f6';
  const PURPLE = '#a855f7';
  const INDIGO = '#6366f1';
  const BLUE_F = 'rgba(59,130,246,0.22)';
  const PUR_F  = 'rgba(168,85,247,0.22)';
  const IND_F  = 'rgba(99,102,241,0.35)';
  const ELEM   = '#1e3a5f';
  const ELEM_B = '#4c1d95';

  if (op === 'complemento') {
    const pad = 18;
    ctx.fillStyle = 'rgba(99,102,241,0.10)';
    roundRect(ctx, pad, pad, W - pad*2, H - pad*2, 10);
    ctx.fill();
    ctx.strokeStyle = INDIGO;
    ctx.lineWidth = 1.5;
    roundRect(ctx, pad, pad, W - pad*2, H - pad*2, 10);
    ctx.stroke();

    const cx = W/2, cy = H/2, r = H*0.34;
    ctx.fillStyle = 'rgba(59,130,246,0.18)';
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2*Math.PI); ctx.fill();
    ctx.strokeStyle = INDIGO; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2*Math.PI); ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.rect(pad, pad, W - pad*2, H - pad*2);
    ctx.arc(cx, cy, r, 0, 2*Math.PI, true);
    ctx.fillStyle = IND_F;
    ctx.fill('evenodd');
    ctx.restore();

    ctx.fillStyle = BLUE; ctx.font = '600 14px DM Sans'; ctx.textAlign = 'center';
    ctx.fillText('A', cx, cy + 4);
    ctx.fillStyle = INDIGO; ctx.font = '600 13px DM Sans';
    ctx.fillText('U', pad + 14, pad + 18);

    const compElems = res.slice(0, 5);
    ctx.fillStyle = ELEM; ctx.font = '500 11px DM Mono'; ctx.textAlign = 'center';
    const spots = [
      [W*0.82, H*0.25], [W*0.82, H*0.75],
      [W*0.15, H*0.25], [W*0.15, H*0.75],
      [W*0.50, H*0.88]
    ];
    compElems.forEach((el, i) => {
      if (spots[i]) ctx.fillText(el, spots[i][0], spots[i][1]);
    });
    if (res.length > 5) {
      ctx.fillStyle = INDIGO;
      ctx.fillText(`+${res.length - 5} más`, W*0.50, H*0.88);
    }

    const aElems = A.slice(0, 4);
    ctx.fillStyle = BLUE; ctx.font = '500 11px DM Mono';
    const aSpots = [[cx-22, cy-12],[cx+22, cy-12],[cx-22, cy+14],[cx+22, cy+14]];
    aElems.forEach((el, i) => {
      if (aSpots[i]) ctx.fillText(el, aSpots[i][0], aSpots[i][1]);
    });
    return;
  }

  const cx1 = W * 0.37, cx2 = W * 0.63, cy = H * 0.50, r = H * 0.36;

  function circle(x, y, r) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
  }

  ctx.fillStyle = 'rgba(59,130,246,0.08)';
  circle(cx1, cy, r); ctx.fill();
  ctx.fillStyle = 'rgba(168,85,247,0.08)';
  circle(cx2, cy, r); ctx.fill();

  if (op === 'union') {
    ctx.fillStyle = BLUE_F; circle(cx1, cy, r); ctx.fill();
    ctx.fillStyle = PUR_F;  circle(cx2, cy, r); ctx.fill();
    ctx.save();
    ctx.beginPath(); ctx.arc(cx1,cy,r,0,2*Math.PI); ctx.arc(cx2,cy,r,0,2*Math.PI,true);
    ctx.fillStyle = IND_F; ctx.fill('evenodd');
    ctx.restore();
    ctx.save();
    ctx.beginPath(); circle(cx1, cy, r); ctx.clip();
    ctx.fillStyle = IND_F; circle(cx2, cy, r); ctx.fill();
    ctx.restore();
  } else if (op === 'interseccion') {
    ctx.save();
    ctx.beginPath(); circle(cx1, cy, r); ctx.clip();
    ctx.fillStyle = IND_F; circle(cx2, cy, r); ctx.fill();
    ctx.restore();
  } else if (op === 'diferencia') {
    ctx.save();
    ctx.beginPath(); circle(cx1, cy, r); ctx.clip();
    ctx.fillStyle = BLUE_F; circle(cx1, cy, r); ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    circle(cx2, cy, r); ctx.fill();
    ctx.restore();
  }

  ctx.strokeStyle = BLUE;   ctx.lineWidth = 1.5;
  circle(cx1, cy, r); ctx.stroke();
  ctx.strokeStyle = PURPLE;
  circle(cx2, cy, r); ctx.stroke();

  ctx.font = '600 14px DM Sans'; ctx.textAlign = 'center';
  ctx.fillStyle = BLUE;   ctx.fillText('A', cx1 - r + 18, cy - r + 22);
  ctx.fillStyle = PURPLE; ctx.fillText('B', cx2 + r - 18, cy - r + 22);

  const onlyA = A.filter(x => !B.includes(x));
  const both  = A.filter(x =>  B.includes(x));
  const onlyB = B.filter(x => !A.includes(x));

  ctx.font = '500 11.5px DM Mono';

  const xA = cx1 - r * 0.5;
  ctx.fillStyle = ELEM;
  onlyA.slice(0, 3).forEach((el, i) => {
    ctx.fillText(el, xA, cy - 10 + i * 18);
  });
  if (onlyA.length > 3) { ctx.fillStyle = BLUE; ctx.fillText(`+${onlyA.length-3}`, xA, cy + 44); }

  const xM = (cx1 + cx2) / 2;
  ctx.fillStyle = '#312e81';
  both.slice(0, 3).forEach((el, i) => {
    ctx.fillText(el, xM, cy - 10 + i * 18);
  });
  if (both.length > 3) { ctx.fillStyle = INDIGO; ctx.fillText(`+${both.length-3}`, xM, cy + 44); }

  const xB = cx2 + r * 0.5;
  ctx.fillStyle = ELEM_B;
  onlyB.slice(0, 3).forEach((el, i) => {
    ctx.fillText(el, xB, cy - 10 + i * 18);
  });
  if (onlyB.length > 3) { ctx.fillStyle = PURPLE; ctx.fillText(`+${onlyB.length-3}`, xB, cy + 44); }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── Descargar resultado como imagen ──────────
function descargarResultado() {
  if (ultimoRes.length === 0 && ultimoA.length === 0) {
    mostrarError('Primero calcula una operación para poder descargar el resultado.');
    return;
  }

  const exp = document.createElement('canvas');
  exp.width  = 900;
  exp.height = 520;
  const ctx  = exp.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 900, 520);
  grad.addColorStop(0, '#eff6ff');
  grad.addColorStop(1, '#eef2ff');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 900, 520);

  const hdr = ctx.createLinearGradient(0, 0, 900, 0);
  hdr.addColorStop(0, '#1d4ed8');
  hdr.addColorStop(1, '#4f46e5');
  ctx.fillStyle = hdr;
  ctx.fillRect(0, 0, 900, 68);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px DM Sans, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('SetSoft — Teoría de Conjuntos', 28, 28);
  ctx.font = '400 13px DM Sans, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Matemática Discreta · Ingeniería de Software · UDES 2025', 28, 52);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 14px DM Sans, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Conjuntos', 28, 108);

  ctx.font = '400 13px DM Mono, monospace';
  ctx.fillStyle = '#374151';
  ctx.fillText('A = { ' + ultimoA.join(', ') + ' }', 28, 134);
  ctx.fillText('B = { ' + ultimoB.join(', ') + ' }', 28, 158);
  if (ultimoU.length > 0) ctx.fillText('U = { ' + ultimoU.join(', ') + ' }', 28, 182);

  const d = DATOS[opActual];
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 14px DM Sans, sans-serif';
  ctx.fillText('Operación', 28, 220);

  ctx.fillStyle = '#1d4ed8';
  ctx.font = 'bold 18px DM Mono, monospace';
  ctx.fillText(d.label, 28, 248);

  const resTexto = ultimoRes.length === 0 ? '∅ (conjunto vacío)' : '{ ' + ultimoRes.join(', ') + ' }';
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 16px DM Mono, monospace';
  const maxW = 380;
  let resDisplay = resTexto;
  if (ctx.measureText(resDisplay).width > maxW) {
    while (ctx.measureText(resDisplay + '...').width > maxW && resDisplay.length > 10) {
      resDisplay = resDisplay.slice(0, -1);
    }
    resDisplay += '...';
  }
  ctx.fillText(resDisplay, 28, 278);

  ctx.fillStyle = '#6b7280';
  ctx.font = '400 12px DM Sans, sans-serif';
  ctx.fillText(`Cardinalidad: |resultado| = ${ultimoRes.length}`, 28, 306);

  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(440, 88); ctx.lineTo(440, 500); ctx.stroke();

  const mini = document.createElement('canvas');
  mini.width  = 420;
  mini.height = 280;
  const mCtx = mini.getContext('2d');
  mCtx.fillStyle = '#fff';
  mCtx.fillRect(0, 0, 420, 280);
  dibujarVennEn(mCtx, ultimoA, ultimoB, ultimoU, ultimoRes, opActual, 420, 280);
  ctx.drawImage(mini, 455, 88);

  ctx.fillStyle = '#374151';
  ctx.font = 'bold 13px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Diagrama de Venn', 665, 390);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '400 11px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Generado con SetSoft · Proyecto de Aula · Matemática Discreta · UDES 2025', 450, 500);

  const link = document.createElement('a');
  const op   = opActual.charAt(0).toUpperCase() + opActual.slice(1);
  link.download = `SetSoft_${op}_resultado.png`;
  link.href = exp.toDataURL('image/png');
  link.click();

  mostrarToast();
}

// Versión del dibujado que recibe un ctx externo (para el export)
function dibujarVennEn(ctx, A, B, U, res, op, W, H) {
  const BLUE   = '#3b82f6';
  const PURPLE = '#a855f7';
  const INDIGO = '#6366f1';
  const BLUE_F = 'rgba(59,130,246,0.22)';
  const PUR_F  = 'rgba(168,85,247,0.22)';
  const IND_F  = 'rgba(99,102,241,0.35)';

  function circle(cx, cy, r) {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2*Math.PI);
  }

  if (op === 'complemento') {
    const pad=14, cx=W/2, cy=H/2, r=H*0.33;
    ctx.fillStyle='rgba(99,102,241,0.10)';
    ctx.fillRect(pad,pad,W-pad*2,H-pad*2);
    ctx.save();
    ctx.beginPath();
    ctx.rect(pad,pad,W-pad*2,H-pad*2);
    ctx.arc(cx,cy,r,0,2*Math.PI,true);
    ctx.fillStyle=IND_F; ctx.fill('evenodd');
    ctx.restore();
    ctx.fillStyle='rgba(59,130,246,0.15)';
    circle(cx,cy,r); ctx.fill();
    ctx.strokeStyle=INDIGO; ctx.lineWidth=1;
    ctx.strokeRect(pad,pad,W-pad*2,H-pad*2);
    ctx.strokeStyle=BLUE; circle(cx,cy,r); ctx.stroke();
    ctx.fillStyle=BLUE; ctx.font='600 13px DM Sans'; ctx.textAlign='center';
    ctx.fillText('A',cx,cy+4);
    ctx.fillStyle=INDIGO; ctx.fillText('U',pad+12,pad+16);
    return;
  }

  const cx1=W*0.37, cx2=W*0.63, cy=H*0.50, r=H*0.35;
  ctx.fillStyle='rgba(59,130,246,0.08)'; circle(cx1,cy,r); ctx.fill();
  ctx.fillStyle='rgba(168,85,247,0.08)'; circle(cx2,cy,r); ctx.fill();

  if(op==='union'){
    ctx.fillStyle=BLUE_F; circle(cx1,cy,r); ctx.fill();
    ctx.fillStyle=PUR_F;  circle(cx2,cy,r); ctx.fill();
    ctx.save(); ctx.beginPath(); circle(cx1,cy,r); ctx.clip();
    ctx.fillStyle=IND_F; circle(cx2,cy,r); ctx.fill(); ctx.restore();
  } else if(op==='interseccion'){
    ctx.save(); ctx.beginPath(); circle(cx1,cy,r); ctx.clip();
    ctx.fillStyle=IND_F; circle(cx2,cy,r); ctx.fill(); ctx.restore();
  } else if(op==='diferencia'){
    ctx.save(); ctx.beginPath(); circle(cx1,cy,r); ctx.clip();
    ctx.fillStyle=BLUE_F; circle(cx1,cy,r); ctx.fill();
    ctx.globalCompositeOperation='destination-out';
    circle(cx2,cy,r); ctx.fill(); ctx.restore();
  }

  ctx.strokeStyle=BLUE;   ctx.lineWidth=1.5; circle(cx1,cy,r); ctx.stroke();
  ctx.strokeStyle=PURPLE;                    circle(cx2,cy,r); ctx.stroke();

  ctx.font='600 13px DM Sans'; ctx.textAlign='center';
  ctx.fillStyle=BLUE;   ctx.fillText('A',cx1-r+16,cy-r+20);
  ctx.fillStyle=PURPLE; ctx.fillText('B',cx2+r-16,cy-r+20);

  const onlyA=A.filter(x=>!B.includes(x));
  const both =A.filter(x=> B.includes(x));
  const onlyB=B.filter(x=>!A.includes(x));

  ctx.font='500 11px DM Mono,monospace';
  ctx.fillStyle='#1e3a5f';
  onlyA.slice(0,3).forEach((el,i)=>ctx.fillText(el,cx1-r*0.5,cy-8+i*17));
  ctx.fillStyle='#312e81';
  both.slice(0,3).forEach((el,i)=>ctx.fillText(el,(cx1+cx2)/2,cy-8+i*17));
  ctx.fillStyle='#4c1d95';
  onlyB.slice(0,3).forEach((el,i)=>ctx.fillText(el,cx2+r*0.5,cy-8+i*17));
}

// ── Toast de descarga ────────────────────────
function mostrarToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── Reiniciar ────────────────────────────────
function reiniciar() {
  document.getElementById('inA').value = '';
  document.getElementById('inB').value = '';
  document.getElementById('inU').value = '';
  document.getElementById('resultOp').textContent = 'Resultado';
  document.getElementById('resultVal').textContent = '—';
  document.getElementById('resultCount').textContent = '—';
  document.getElementById('explainText').innerHTML = 'Selecciona una operación y presiona <strong>Calcular</strong> para ver la explicación aquí.';
  document.getElementById('explainCodeText').innerHTML = 'Selecciona una operación y presiona <strong>Calcular</strong> para ver cómo se traduce a código.';
  document.getElementById('codePython').textContent = '-- Presiona Calcular para ver el ejemplo';
  document.getElementById('codeSQL').textContent = '';
  document.getElementById('codeJS').textContent = '';
  const canvas = document.getElementById('venn');
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  ocultarError();
  ultimoA = []; ultimoB = []; ultimoU = []; ultimoRes = [];
}

// ── Calcular al cargar ───────────────────────
window.addEventListener('load', () => {
  calcular();
});

// ── Enter para calcular ──────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') calcular();
});
