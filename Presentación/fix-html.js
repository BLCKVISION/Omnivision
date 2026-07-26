const fs = require('fs');
let html = fs.readFileSync('vision.html', 'utf8');

const map = {
  '01&ensp;&ensp;D E S C R I P C I Ó N&ensp;&ensp;Y&ensp;&ensp;P R O P Ó S I T O': '01 DESCRIPCIÓN Y PROPÓSITO',
  '02&ensp;&ensp;O B J E T I V O&ensp;&ensp;G E N E R A L': '02 OBJETIVO GENERAL',
  '03&ensp;&ensp;O B J E T I V O S&ensp;&ensp;E S P E C Í F I C O S': '03 OBJETIVOS ESPECÍFICOS',
  '04&ensp;&ensp;A R Q U I T E C T U R A&ensp;&ensp;D E&ensp;&ensp;A L T O&ensp;&ensp;R E N D I M I E N T O': '04 ARQUITECTURA DE ALTO RENDIMIENTO',
  '05&ensp;&ensp;M A R C O&ensp;&ensp;L E G A L': '05 MARCO LEGAL',
  '05&ensp;&ensp;A L C A N C E S&ensp;&ensp;D E L&ensp;&ensp;P R O Y E C T O': '05 ALCANCES DEL PROYECTO',
  '06&ensp;&ensp;L I M I T A C I O N E S': '06 LIMITACIONES',
  '07&ensp;&ensp;M E T O D O L O G Í A': '07 METODOLOGÍA',
  '08&ensp;&ensp;D E S G L O S E&ensp;&ensp;D E&ensp;&ensp;T R A B A J O': '08 DESGLOSE DE TRABAJO',
  '09&ensp;&ensp;C R O N O G R A M A': '09 CRONOGRAMA',
  '10&ensp;&ensp;M V P&ensp;&ensp;F A S E&ensp;&ensp;D E&ensp;&ensp;D E S P L I E G U E': '10 MVP FASE DE DESPLIEGUE'
};

for (const [key, value] of Object.entries(map)) {
    html = html.replace(key, value);
}

fs.writeFileSync('vision.html', html);
console.log('Fixed eyebrows in HTML');
