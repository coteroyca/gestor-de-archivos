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
    // LISTA ACTUALIZADA: Ignoramos carpetas del sistema e interfaz visual
    const ignorar = [
      '.vercel', 'node_modules', '.git', '.next', 'app', 
      'logos', 'index.html', 'favicon.ico'
    ];
    
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
    // Apuntamos directamente a la carpeta public que es donde moviste todo
    const rutaPublic = path.join(process.cwd(), 'public');
    
    // Leemos el contenido de la carpeta public
    const arbolCompleto = conseguirArbol(rutaPublic);
    
    // Modificamos el nombre raíz para la interfaz
    arbolCompleto.name = "Raíz";
    
    return NextResponse.json(arbolCompleto);
  } catch (error) {
    return NextResponse.json({ error: 'Error al leer directorios', detalle: error.message }, { status: 500 });
  }
}
