// api/tree.js - Con estructura de 2 niveles incluyendo archivos en raíz
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const publicDir = path.join(process.cwd(), 'public');
    
    console.log('=== Escaneando estructura de 2 niveles (con archivos raíz):', publicDir);
    
    if (!fs.existsSync(publicDir)) {
      return res.status(500).json({ 
        success: false, 
        error: 'Directorio public no encontrado' 
      });
    }
    
    const items = fs.readdirSync(publicDir);
    const folders = [];
    
    // Excluir carpetas del sistema
    const excludeFolders = ['api', '_next', 'node_modules'];
    
    for (const item of items) {
      const itemPath = path.join(publicDir, item);
      
      try {
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !excludeFolders.includes(item)) {
          console.log(`📁 Procesando carpeta principal: ${item}`);
          
          // Array para subcarpetas
          const subfolders = [];
          
          // Array para archivos en la raíz
          const rootFiles = [];
          
          // Escanear todo el contenido de la carpeta principal
          const subItems = fs.readdirSync(itemPath);
          
          for (const subItem of subItems) {
            const subItemPath = path.join(itemPath, subItem);
            
            try {
              const subStat = fs.statSync(subItemPath);
              
              if (subStat.isDirectory() && !subItem.startsWith('.')) {
                // Es una subcarpeta
                console.log(`  📂 Subcarpeta encontrada: ${subItem}`);
                
                // Escanear archivos dentro de la subcarpeta
                const files = [];
                
                function readFiles(dir, basePath) {
                  try {
                    const fileItems = fs.readdirSync(dir);
                    
                    for (const fileItem of fileItems) {
                      const filePath = path.join(dir, fileItem);
                      const fileStat = fs.statSync(filePath);
                      
                      if (fileStat.isFile() && !fileItem.startsWith('.')) {
                        const ext = fileItem.split('.').pop().toLowerCase();
                        const relativePath = path.relative(publicDir, filePath);
                        files.push({
                          name: fileItem,
                          type: ext,
                          size: fileStat.size,
                          url: '/' + relativePath.replace(/\\/g, '/')
                        });
                        console.log(`    📄 Archivo: ${fileItem} (${ext})`);
                      }
                    }
                  } catch (err) {
                    console.error(`Error leyendo archivos en ${dir}:`, err.message);
                  }
                }
                
                readFiles(subItemPath, `${item}/${subItem}`);
                
                subfolders.push({
                  name: subItem,
                  files: files,
                  fileCount: files.length,
                  path: `${item}/${subItem}`
                });
              } 
              else if (subStat.isFile() && !subItem.startsWith('.')) {
                // Es un archivo en la raíz de la carpeta principal
                const ext = subItem.split('.').pop().toLowerCase();
                const relativePath = path.relative(publicDir, subItemPath);
                rootFiles.push({
                  name: subItem,
                  type: ext,
                  size: subStat.size,
                  url: '/' + relativePath.replace(/\\/g, '/')
                });
                console.log(`  📄 Archivo raíz encontrado: ${subItem} (${ext})`);
              }
            } catch (err) {
              console.error(`Error procesando ${subItem}:`, err.message);
            }
          }
          
          // Si hay archivos en la raíz, crear una subcarpeta virtual "Raíz"
          if (rootFiles.length > 0) {
            subfolders.unshift({
              name: "📁 Raíz",
              nameRaw: "Raíz",
              files: rootFiles,
              fileCount: rootFiles.length,
              isVirtual: true,
              path: item
            });
            console.log(`  ✅ Creada carpeta virtual "Raíz" con ${rootFiles.length} archivos`);
          }
          
          // Ordenar subcarpetas: primero "Raíz" (si existe), luego las demás alfabéticamente
          subfolders.sort((a, b) => {
            if (a.name === "📁 Raíz") return -1;
            if (b.name === "📁 Raíz") return 1;
            return a.name.localeCompare(b.name);
          });
          
          folders.push({
            name: item,
            subfolders: subfolders,
            totalSubfolders: subfolders.length,
            totalFiles: subfolders.reduce((sum, sub) => sum + sub.fileCount, 0),
            rootFilesCount: rootFiles.length
          });
          
          console.log(`✅ Carpeta ${item}: ${subfolders.length} subcarpetas (incluyendo virtual), ${rootFiles.length} archivos raíz`);
        }
      } catch (err) {
        console.error(`Error procesando ${item}:`, err.message);
      }
    }
    
    console.log(`=== Total: ${folders.length} carpetas principales procesadas`);
    
    return res.status(200).json({ 
      success: true, 
      folders: folders,
      timestamp: new Date().toISOString(),
      totalMainFolders: folders.length
    });
    
  } catch (error) {
    console.error('Error general:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
