// api/tree.js - Escanea TODAS las carpetas dinámicamente
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    // Obtener parámetro para forzar refresh
    const forceRefresh = req.query.refresh === 'true';
    
    // Directorio público
    const publicDir = path.join(process.cwd(), 'public');
    
    console.log('=== Escaneando directorio:', publicDir);
    
    if (!fs.existsSync(publicDir)) {
      return res.status(500).json({ 
        success: false, 
        error: 'Directorio no encontrado' 
      });
    }
    
    // Leer TODAS las carpetas (sin excluir nada por defecto)
    const items = fs.readdirSync(publicDir);
    const folders = [];
    
    // Solo excluir carpetas del sistema
    const excludeFolders = ['api', '_next', 'node_modules'];
    
    for (const item of items) {
      const itemPath = path.join(publicDir, item);
      
      try {
        const stat = fs.statSync(itemPath);
        
        // Incluir TODAS las carpetas excepto las excluidas
        if (stat.isDirectory() && !excludeFolders.includes(item)) {
          console.log(`📁 Procesando carpeta: ${item}`);
          
          const files = [];
          
          // Función recursiva para leer TODOS los archivos
          function readAllFiles(dir, basePath = '') {
            try {
              const subItems = fs.readdirSync(dir);
              
              for (const subItem of subItems) {
                const subPath = path.join(dir, subItem);
                
                try {
                  const subStat = fs.statSync(subPath);
                  
                  if (subStat.isFile() && !subItem.startsWith('.')) {
                    const ext = subItem.split('.').pop().toLowerCase();
                    const relativePath = path.relative(publicDir, subPath);
                    files.push({
                      name: subItem,
                      type: ext,
                      size: subStat.size,
                      url: '/' + relativePath.replace(/\\/g, '/'),
                      fullPath: relativePath.replace(/\\/g, '/')
                    });
                    console.log(`  📄 Archivo encontrado: ${subItem} (${ext})`);
                  } else if (subStat.isDirectory()) {
                    // Explorar subcarpetas recursivamente
                    const subBasePath = basePath ? `${basePath}/${subItem}` : subItem;
                    readAllFiles(subPath, subBasePath);
                  }
                } catch (err) {
                  console.error(`Error leyendo ${subItem}:`, err.message);
                }
              }
            } catch (err) {
              console.error(`Error leyendo directorio ${dir}:`, err.message);
            }
          }
          
          readAllFiles(itemPath, item);
          
          folders.push({ 
            name: item, 
            files: files,
            fileCount: files.length
          });
          
          console.log(`✅ Carpeta ${item}: ${files.length} archivos encontrados`);
        }
      } catch (err) {
        console.error(`Error procesando ${item}:`, err.message);
      }
    }
    
    console.log(`=== Total: ${folders.length} carpetas procesadas`);
    
    return res.status(200).json({ 
      success: true, 
      folders: folders,
      timestamp: new Date().toISOString(),
      totalFolders: folders.length
    });
    
  } catch (error) {
    console.error('Error general:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};