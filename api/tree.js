// api/tree.js - Este archivo debe estar en la carpeta 'api' en la raíz
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    // En Vercel, el directorio público está en process.cwd()
    const publicDir = path.join(process.cwd(), 'public');
    
    console.log('Leyendo directorio:', publicDir);
    
    if (!fs.existsSync(publicDir)) {
      return res.status(500).json({ 
        success: false, 
        error: 'Directorio no encontrado' 
      });
    }
    
    const items = fs.readdirSync(publicDir);
    const folders = [];
    
    // Carpetas a excluir
    const excludeFolders = ['assets', 'blog', 'imagenes', 'logos', 'api', '_next', 'data'];
    
    for (const item of items) {
      const itemPath = path.join(publicDir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory() && !excludeFolders.includes(item)) {
        const files = [];
        
        // Función recursiva para leer archivos
        function readFiles(dir, basePath) {
          try {
            const subItems = fs.readdirSync(dir);
            for (const subItem of subItems) {
              const subPath = path.join(dir, subItem);
              const subStat = fs.statSync(subPath);
              
              if (subStat.isFile() && !subItem.startsWith('.')) {
                const ext = subItem.split('.').pop().toLowerCase();
                const relativePath = path.relative(publicDir, subPath);
                files.push({
                  name: subItem,
                  type: ext,
                  url: '/' + relativePath.replace(/\\/g, '/')
                });
              } else if (subStat.isDirectory()) {
                readFiles(subPath, path.join(basePath, subItem));
              }
            }
          } catch (err) {
            console.error(`Error leyendo ${dir}:`, err);
          }
        }
        
        readFiles(itemPath, item);
        folders.push({ name: item, files });
      }
    }
    
    return res.status(200).json({ 
      success: true, 
      folders: folders 
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};