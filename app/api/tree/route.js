import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Función que arma el árbol de forma recursiva
function conseguirArbol(rutaActual) {
  const stats = fs.statSync(rutaActual);
  const nombre = path.basename(rutaActual);
  const info = { name: nombre };

  if (stats.isDirectory()) {
    info.type = 'folder';
    // Ignoramos carpetas ocultas de sistemas y dependencias para no ensuciar el árbol
    const ignorar = ['.vercel', 'node_modules', '.git', '.next','app,'public','package.json','package-lock.json','next.config.js','next.config.mjs','jsconfig.json'];
    
    info.children = fs.readdirSync(rutaActual)
      .filter(hijo => !ignorar.includes(hijo))
      .map(hijo => conseguirArbol(path.join(rutaActual, hijo)));
  } else {
    info.type = 'file';
  }
  return info;
}

export async function GET() {
  try {
    // process.cwd() apunta a la raíz exacta del despliegue congelado en Vercel
    const rutaRaiz = process.cwd();
    const arbolCompleto = conseguirArbol(rutaRaiz);
    
    return NextResponse.json(arbolCompleto);
  } catch (error) {
    return NextResponse.json({ error: 'Error al leer directorios', detalle: error.message }, { status: 500 });
  }
}
