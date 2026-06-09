import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET() {
  try {
    // En Vercel, el directorio público está en process.cwd() + '/public'
    const publicDir = join(process.cwd(), 'public');
    
    console.log('Buscando en:', publicDir);
    
    // Verificar si el directorio existe
    if (!existsSync(publicDir)) {
      console.error('Directorio public no encontrado:', publicDir);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Directorio public no encontrado' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const folders = await getFolders(publicDir);
    
    // Excluir carpetas que no queremos como pestañas
    const excludeFolders = ['assets', 'blog', 'imagenes', 'logos', 'brochure'];
    const validFolders = folders.filter(folder => !excludeFolders.includes(folder.name));
    
    console.log('Carpetas encontradas:', validFolders.map(f => f.name));
    
    // Para cada carpeta, obtener su estructura de archivos
    const foldersData = [];
    for (const folder of validFolders) {
      const folderPath = join(publicDir, folder.name);
      const filesData = await getFilesStructure(folderPath, folder.name);
      foldersData.push({
        name: folder.name,
        path: folder.name,
        files: filesData
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      folders: foldersData 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error detallado:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getFolders(dirPath) {
  try {
    const items = await readdir(dirPath);
    const folders = [];
    
    for (const item of items) {
      try {
        const itemPath = join(dirPath, item);
        const itemStat = await stat(itemPath);
        if (itemStat.isDirectory() && !item.startsWith('_') && item !== 'api') {
          folders.push({ name: item, path: itemPath });
        }
      } catch (err) {
        console.error(`Error leyendo ${item}:`, err);
      }
    }
    
    return folders;
  } catch (error) {
    console.error('Error leyendo directorio:', error);
    return [];
  }
}

async function getFilesStructure(dirPath, basePath = '') {
  try {
    const items = await readdir(dirPath);
    const files = [];
    
    for (const item of items) {
      try {
        const itemPath = join(dirPath, item);
        const itemStat = await stat(itemPath);
        
        if (itemStat.isFile() && !item.startsWith('.')) {
          const ext = item.split('.').pop().toLowerCase();
          files.push({
            name: item,
            type: ext,
            size: itemStat.size,
            path: `${basePath}/${item}`,
            url: `/${basePath}/${item}`
          });
        } else if (itemStat.isDirectory()) {
          // Si hay subcarpetas, las exploramos recursivamente
          const subFiles = await getFilesStructure(itemPath, `${basePath}/${item}`);
          files.push(...subFiles);
        }
      } catch (err) {
        console.error(`Error procesando ${item}:`, err);
      }
    }
    
    return files;
  } catch (error) {
    console.error(`Error leyendo directorio ${dirPath}:`, error);
    return [];
  }
}