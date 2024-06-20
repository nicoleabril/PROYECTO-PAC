const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const PDFDocument = require('pdfkit');
const app = express();
const fs = require('fs');
app.use(bodyParser.json(), cors());
app.options('*', cors());
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const currentDirectory = __dirname;

// Directorio donde se guardarán los archivos de los procesos (relativo al directorio de trabajo)
const uploadsDirectoryProceso = path.join(__dirname, '..', '..', 'procesos');
const uploadsDirectoryInfima = path.join(__dirname, '..', '..', 'infimas');
// Verificar si el directorio de uploads existe, si no, crearlo
if (!fs.existsSync(uploadsDirectoryProceso)) {
  fs.mkdirSync(uploadsDirectoryProceso, { recursive: true });
}

if (!fs.existsSync(uploadsDirectoryInfima)) {
    fs.mkdirSync(uploadsDirectoryInfima, { recursive: true });
  }

// Configuración de Multer para subir archivos a carpetas en el servidor
const diskStorageProceso = multer.diskStorage({
    destination: function (req, file, cb) {
      // Directorio donde se guardarán los archivos, usando el nombre del proceso como subcarpeta
      const processFolder = path.join(uploadsDirectoryProceso, req.body.pac_fase_preparatoria_pk);
  
      // Verificar si la carpeta del proceso ya existe
      if (!fs.existsSync(processFolder)) {
        fs.mkdirSync(processFolder, { recursive: true }); // Crea la carpeta del proceso si no existe
      }
  
      cb(null, processFolder);
    },
    filename: function (req, file, cb) {
      // Nombre del archivo en el servidor
      cb(null, file.originalname);
    }
});

const diskStorageInfima = multer.diskStorage({
    destination: function (req, file, cb) {
      // Directorio donde se guardarán los archivos, usando el nombre del proceso como subcarpeta
      const processFolder = path.join(uploadsDirectoryInfima, req.body.id_infima);
  
      // Verificar si la carpeta del proceso ya existe
      if (!fs.existsSync(processFolder)) {
        fs.mkdirSync(processFolder, { recursive: true }); // Crea la carpeta del proceso si no existe
      }
  
      cb(null, processFolder);
    },
    filename: function (req, file, cb) {
      // Nombre del archivo en el servidor
      cb(null, file.originalname);
    }
});
  
const uploadToFolderProceso = multer({ storage: diskStorageProceso });
const uploadToFolderInfima = multer({ storage: diskStorageInfima });

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//5432 contrasenia accit.2023 5433

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'clonada',
    password: 'contrasenia',
    port: 5432,
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT pu.* FROM pac.pac_usuarios pu WHERE pu.correo_usuario = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = result.rows[0];

        if (bcrypt.compareSync(password, user.contrasena_usuario)) {
            const token = jwt.sign({ username }, 'secret_key');
            return res.json({ token });
        } else {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.post('/registro', async (req, res) => {
    try {
      const { nombres, apellidos, correo, contrasena, departamento, id_rol } = req.body;
  
      // Comprobar si el nombre de usuario ya existe
      const userExists = await pool.query('SELECT * FROM pac.pac_usuarios WHERE correo_usuario = $1', [correo]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'El correo de usuario ya está en uso' });
      }
  
      await pool.query('BEGIN'); // Iniciar transacción
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      const newUserResult = await pool.query('INSERT INTO pac.pac_usuarios (nombres_usuario, apellidos_usuario, correo_usuario, contrasena_usuario, depar_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario', [nombres, apellidos, correo, hashedPassword, departamento]);
      const idUsuario = newUserResult.rows[0].id_usuario;
      await pool.query('INSERT INTO pac.pac_roles_usuarios (usuario, rol) VALUES ($1, $2)', [idUsuario, id_rol]);
  
      await pool.query('COMMIT'); // Confirmar transacción
      console.log('Transacción completada');
      return res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
      await pool.query('ROLLBACK'); // Cancelar transacción en caso de error
      console.error('Error en el servidor:', error);
      return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
});
  
app.post('/actualizar', async (req, res) => {
    try {
      const { id, nombres, apellidos, correo, contrasena, departamento, id_rol } = req.body;
      const userExists = await pool.query('SELECT * FROM pac.pac_usuarios WHERE id_usuario = $1', [id]);
      if (userExists.rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      await pool.query('BEGIN'); // Iniciar transacción
      let hashedPassword;
      if (contrasena) {
        hashedPassword = await bcrypt.hash(contrasena, 10);
      }
      await pool.query('UPDATE pac.pac_usuarios SET nombres_usuario = $1, apellidos_usuario = $2, correo_usuario = $3, contrasena_usuario = COALESCE($4, contrasena_usuario), depar_usuario = $5 WHERE id_usuario = $6', [nombres, apellidos, correo, hashedPassword, departamento, id]);
      await pool.query('UPDATE pac.pac_roles_usuarios SET rol = $1 WHERE usuario = $2', [id_rol, id]);
      await pool.query('COMMIT'); // Confirmar transacción
      console.log('Transacción completada');
      return res.status(200).json({ message: 'Usuario actualizado con éxito' });
    } catch (error) {
      await pool.query('ROLLBACK'); // Cancelar transacción en caso de error
      console.error('Error en el servidor:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.post('/actualizar_solo_datos', upload.single('imagen_usuario'), async (req, res) => {
    try {
      const { id, nombres, apellidos, correo, contrasena, ruta_usuario } = req.body;
      const pdfData = req.file.buffer;
      const userExists = await pool.query('SELECT * FROM pac.pac_usuarios WHERE id_usuario = $1', [id]);
      if (userExists.rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      await pool.query('BEGIN'); // Iniciar transacción
      let hashedPassword;
      if (contrasena) {
        hashedPassword = await bcrypt.hash(contrasena, 10);
      }
      await pool.query('UPDATE pac.pac_usuarios SET nombres_usuario = $1, apellidos_usuario = $2, correo_usuario = $3, contrasena_usuario = COALESCE($4, contrasena_usuario), imagen_usuario = $5, ruta_usuario = $6 WHERE id_usuario = $7', [nombres, apellidos, correo, hashedPassword, pdfData, ruta_usuario, id]);
      await pool.query('COMMIT'); // Confirmar transacción
      console.log('Transacción completada');
      return res.status(200).json({ message: 'Usuario actualizado con éxito' });
    } catch (error) {
      await pool.query('ROLLBACK'); // Cancelar transacción en caso de error
      console.error('Error en el servidor:', error);
      return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

  
app.post('/borrar', async (req, res) => {
    try {
      const { id } = req.body;
      const userExists = await pool.query('SELECT * FROM pac.pac_usuarios WHERE id_usuario = $1', [id]);
      if (userExists.rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      await pool.query('BEGIN'); // Iniciar transacción
      await pool.query('DELETE FROM pac.pac_roles_usuarios WHERE usuario = $1', [id]);
      await pool.query('DELETE FROM pac.pac_usuarios WHERE id_usuario = $1', [id]);
  
      await pool.query('COMMIT'); // Confirmar transacción
      console.log('Transacción completada');
  
      return res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
      await pool.query('ROLLBACK'); // Cancelar transacción en caso de error
      console.error('Error en el servidor:', error);
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  });

app.get('/obtener_info_user/:correo', async(req, res) => {
    try{
        const { correo } = req.params;
        const info_user = await pool.query('SELECT * FROM pac.pac_usuarios WHERE correo_usuario = $1', [correo]);
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

app.get('/obtener_menu/:correo', async(req, res) => {
    try{
        const { correo } = req.params;
        const info_user = await pool.query(`
        SELECT * FROM pac.pac_menu
        INNER JOIN pac.pac_accesos ON pac.pac_menu.id_opcion = pac.pac_accesos.opcion_menu
        LEFT JOIN pac.pac_roles_usuarios ON pac.pac_accesos.opcion_rol = pac.pac_roles_usuarios.rol
        WHERE pac.pac_roles_usuarios.usuario = (
            SELECT id_usuario
            FROM pac.pac_usuarios
            WHERE correo_usuario = $1
        ) OR pac.pac_accesos.opcion_rol IS NULL ORDER BY pac.pac_menu.id_opcion`, [correo]);
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor al obtener menu' });
    }
})

app.get('/obtener_rol_usuario/:correo', async(req, res) => {
    try{
        const { correo } = req.params;
        const info_user = await pool.query(`
        SELECT r.*
        FROM pac.pac_usuarios u
        JOIN pac.pac_roles_usuarios ru ON u.id_usuario = ru.usuario
        JOIN pac.pac_roles r ON ru.rol = r.id_rol
        WHERE u.correo_usuario = $1`, [correo]);
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor al obtener menu' });
    }
})

app.get('/obtener_info_user_dado_ID/:id', async(req, res) => {
    try{
        const { id } = req.params;
        const info_user = await pool.query('SELECT * FROM pac.pac_usuarios WHERE id_usuario = $1', [id]);
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})


app.get('/obtener_regimen/', async(req, res) => {
    try{
        const info_user = await pool.query('SELECT DISTINCT tipo_regimen FROM pac.pac_procedimientos');
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

app.get('/obtener_doc_habilitantes/', async(req, res) => {
    try{
        const info_user = await pool.query('SELECT * FROM pac.pac_doc_habilitantes');
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

app.get('/obtener_doc_hab/:id_doc', async(req, res) => {
    try{
        const { id_doc } = req.params;
        const info_user = await pool.query('SELECT * FROM pac.pac_doc_habilitantes WHERE id_doc = $1', [id_doc]);
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

app.get('/obtener_doc_gen/:id_doc', async(req, res) => {
    try{
        const { id_doc } = req.params;
        const info_user = await pool.query('SELECT * FROM pac.pac_doc_generales WHERE id_doc = $1', [id_doc]);
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

app.get('/obtener_doc_generales/', async(req, res) => {
    try{
        const info_user = await pool.query('SELECT * FROM pac.pac_doc_generales');
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})


app.get('/obtener_doc_tipo_compra/', async(req, res) => {
    try{
        const info_user = await pool.query('SELECT * FROM pac.pac_tipo_compra');
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

app.get('/obtener_doc_tipo_proceso/', async(req, res) => {
    try{
        const info_user = await pool.query('SELECT * FROM pac.pac_tipo_proceso');
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})


app.get('/obtener_presupuesto_total/', async(req, res) => {
    try{
        const presupuesto = await pool.query('SELECT SUM(valor_disponible) FROM pac.pac_partidas_presupuestarias');
        return res.json(presupuesto.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error obteniendo presupuesto total' });
    }
})

app.get('/obtener_numero_procesos/', async(req, res) => {
    try{
        const procesos = await pool.query('SELECT COUNT(*) FROM pac.pac_procesos');
        return res.json(procesos.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error obteniendo numero de procesos' });
    }
})

app.get('/obtener_compra/:regimen', async(req, res) => {
    try{
        const { regimen } = req.params;
        const info_user = await pool.query('SELECT DISTINCT tipo_compra FROM pac.pac_procedimientos where tipo_regimen = $1', [regimen]);
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

app.get('/obtener_tipo_compra/', async(req, res) => {
    try{
        const info_user = await pool.query('SELECT DISTINCT tipo_compra FROM pac.pac_procedimientos WHERE tipo_compra != $1', ['CONSULTORIA']);
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})


app.get('/obtener_procedimiento_sugerido/:regimen/:compra', async(req, res) => {
    try{
        const { regimen, compra } = req.params;
        const info_user = await pool.query('SELECT DISTINCT procedimiento_sugerido FROM pac.pac_procedimientos where tipo_regimen = $1 and tipo_compra = $2', [regimen, compra]);
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

app.get('/obtener_tipo_producto/:regimen/:compra/:procSuge', async(req, res) => {
    try{
        const { regimen, compra, procSuge } = req.params;
        const info_user = await pool.query('SELECT DISTINCT tipo_producto FROM pac.pac_procedimientos where tipo_regimen = $1 and tipo_compra = $2 and procedimiento_sugerido = $3', [regimen, compra, procSuge]);
        return res.json(info_user.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
})

app.get('/obtener_departamento_user/:id_departamento', async(req, res) => {
    try{
        const { id_departamento } = req.params;
        const departamento = await pool.query('SELECT * FROM pac.pac_departamentos WHERE id_departamento = $1', [id_departamento]);
        return res.json(departamento.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.get('/obtener_direccion_departamento/:id_direccion', async(req, res) => {
    try{
        const { id_direccion } = req.params;
        const direccion = await pool.query('SELECT * FROM pac.pac_direcciones WHERE id_direccion = $1', [id_direccion]);
        return res.json(direccion.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.get('/obtener_departamento/:id_departamento', async(req, res) => {
    try{
        const { id_departamento } = req.params;
        const direccion = await pool.query('SELECT * FROM pac.pac_departamentos WHERE id_departamento = $1', [id_departamento]);
        return res.json(direccion.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.get('/obtener_rol/:id_rol', async(req, res) => {
    try{
        const { id_rol } = req.params;
        const direccion = await pool.query('SELECT * FROM pac.pac_roles WHERE id_rol = $1', [id_rol]);
        return res.json(direccion.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.get('/obtener_usuario/:id_usuario', async(req, res) => {
    try{
        const { id_usuario } = req.params;
        const direccion = await pool.query('SELECT * FROM pac.pac_usuarios WHERE id_usuario = $1', [id_usuario]);
        return res.json(direccion.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.get('/obtener_usuario_correo/:correo_usuario', async(req, res) => {
    try{
        const { correo_usuario } = req.params;
        const direccion = await pool.query('SELECT * FROM pac.pac_usuarios WHERE correo_usuario = $1', [correo_usuario]);
        return res.json(direccion.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.get('/obtener_procesos/:correo/:rol', async (req, res) => {
    try {
        const { correo,rol } = req.params;
        if(rol=='Administrador'){
            // Obtener los procesos del usuario
            const procesos = await pool.query("SELECT  ROW_NUMBER() OVER (ORDER BY a.id_proceso) AS row_number,a.* FROM pac.pac_procesos a,(SELECT b.ID_PROCESO id_proceso, MAX(b.VERSION_PROCESO) version_proceso FROM pac.pac_procesos b group by b.id_proceso) b WHERE b.ID_PROCESO=a.ID_PROCESO and b.VERSION_PROCESO=a.VERSION_PROCESO and a.eliminado='NO' and estado_fase_preparatoria ='NO INICIADO' order by a.id_proceso asc");
            return res.json(procesos.rows);
        }
        try {
            // Obtener los procesos del usuario
            const procesos = await pool.query("SELECT  ROW_NUMBER() OVER (ORDER BY a.id_proceso) AS row_number,a.* FROM pac.pac_procesos a,(SELECT b.ID_PROCESO id_proceso, MAX(b.VERSION_PROCESO) version_proceso FROM pac.pac_procesos b group by b.id_proceso) b WHERE funcionario_responsable = $1 and b.ID_PROCESO=a.ID_PROCESO and b.VERSION_PROCESO=a.VERSION_PROCESO and a.eliminado='NO' and estado_fase_preparatoria ='NO INICIADO' order by a.id_proceso asc", [correo]);
            return res.json(procesos.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_infimas_cuantias/:correo/:rol', async (req, res) => {
    try {
        const { correo, rol } = req.params;
        if (rol === 'Administrador') {
            // Obtener los procesos del usuario
            const procesos = await pool.query("SELECT ROW_NUMBER() OVER (ORDER BY a.id_infima) AS row_number, a.*, d.nombre_direccion FROM pac.pac_infimas_cuantias a LEFT JOIN pac.pac_direcciones d ON a.id_direccion = d.id_direccion ORDER BY a.id_infima ASC");
            return res.json(procesos.rows);
        } else {
            try {
                // Obtener los procesos del usuario
                const procesos = await pool.query("SELECT ROW_NUMBER() OVER (ORDER BY a.id_infima) AS row_number, a.*, d.nombre_direccion FROM pac.pac_infimas_cuantias a LEFT JOIN pac.pac_direcciones d ON a.id_direccion = d.id_direccion WHERE funcionario_responsable = $1 ORDER BY a.id_infima ASC", [correo]);
                return res.json(procesos.rows);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error en el servidor' });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor: ' + error });
    }
});


app.get('/obtener_infima_cuantia/:id_infima', async (req, res) => {
    try {
        const { id_infima } = req.params;

        const procesos = await pool.query("SELECT a.*, d.nombre_direccion FROM pac.pac_infimas_cuantias a LEFT JOIN pac.pac_direcciones d ON a.id_direccion = d.id_direccion WHERE a.id_infima = $1", [id_infima]);
        return res.json(procesos.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});



app.get('/obtener_procesos_pac', async (req, res) => {
    try {

        const procesos = await pool.query("SELECT  ROW_NUMBER() OVER (ORDER BY a.id_proceso) AS row_number,a.* FROM pac.pac_procesos a,(SELECT b.ID_PROCESO id_proceso, MAX(b.VERSION_PROCESO) version_proceso FROM pac.pac_procesos b group by b.id_proceso) b WHERE b.ID_PROCESO=a.ID_PROCESO and b.VERSION_PROCESO=a.VERSION_PROCESO and a.eliminado='NO' and estado_fase_preparatoria ='PUBLICADO' order by a.id_proceso asc");
        return res.json(procesos.rows);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_procesos_preparatorios/:correo', async (req, res) => {
    try {
        const { correo } = req.params;
        // Comprobar si el usuario tiene procesos
        const nro_procesos = await pool.query('SELECT COUNT(*) FROM pac.pac_procesos WHERE funcionario_responsable = $1', [correo]);
        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron procesos para su usuario' });
        }
        try {
            // Obtener los procesos del usuario
            const procesos = await pool.query("SELECT  ROW_NUMBER() OVER (ORDER BY a.id_proceso) AS row_number,a.* FROM pac.pac_procesos a,(SELECT b.ID_PROCESO id_proceso, MAX(b.VERSION_PROCESO) version_proceso FROM pac.pac_procesos b group by b.id_proceso) b WHERE funcionario_responsable = $1 and b.ID_PROCESO=a.ID_PROCESO and b.VERSION_PROCESO=a.VERSION_PROCESO and a.eliminado='NO' and estado_fase_preparatoria !='NO INICIADO' order by a.id_proceso asc", [correo]);
            return res.json(procesos.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_direcciones/', async (req, res) => {
    try {
        const nro_procesos = await pool.query('SELECT COUNT(*) FROM pac.pac_direcciones');
        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron direcciones' });
        }
        try {
            const procesos = await pool.query("SELECT * FROM pac.pac_direcciones ORDER BY nombre_direccion");
            return res.json(procesos.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_departamentos/', async (req, res) => {
    try {
        const nro_procesos = await pool.query('SELECT COUNT(*) FROM pac.pac_departamentos');
        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron departamentos' });
        }
        try {
            const procesos = await pool.query("SELECT * FROM pac.pac_departamentos ORDER BY nombre_departamento");
            return res.json(procesos.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_usuarios/', async (req, res) => {
    try {
        const nro_procesos = await pool.query('SELECT COUNT(*) FROM pac.pac_usuarios');
        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron usuarios' });
        }
        try {
            const procesos = await pool.query("SELECT * FROM pac.pac_usuarios ORDER BY correo_usuario");
            return res.json(procesos.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_roles/', async (req, res) => {
    try {
        const nro_procesos = await pool.query('SELECT COUNT(*) FROM pac.pac_roles');
        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron roles' });
        }
        try {
            const procesos = await pool.query("SELECT ROW_NUMBER() OVER (ORDER BY id_rol) AS id, * FROM pac.pac_roles;");
            return res.json(procesos.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_menu_opciones/', async (req, res) => {
    try {
        const nro_procesos = await pool.query('SELECT COUNT(*) FROM pac.pac_menu');
        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron roles' });
        }
        try {
            const procesos = await pool.query("SELECT * FROM pac.pac_menu ORDER BY id_opcion");
            return res.json(procesos.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_accesos_rol/:opcion_rol', async (req, res) => {
    try {
        const { opcion_rol } = req.params;
        const nro_procesos = await pool.query('SELECT COUNT(*) FROM pac.pac_accesos');
        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron roles' });
        }
        try {
            const procesos = await pool.query("SELECT * FROM pac.pac_accesos WHERE opcion_rol = $1 or opcion_rol is NULL",  [opcion_rol]);
            return res.json(procesos.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_accesos/', async (req, res) => {
    try {
        const nro_procesos = await pool.query('SELECT COUNT(*) FROM pac.pac_accesos');
        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron roles' });
        }
        try {
            const procesos = await pool.query("SELECT * FROM pac.pac_accesos");
            return res.json(procesos.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_roles_usuarios/', async (req, res) => {
    try {
        const nro_procesos = await pool.query('SELECT COUNT(*) FROM pac.pac_roles_usuarios');
        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron roles' });
        }
        try {
            const procesos = await pool.query("SELECT * FROM pac.pac_roles_usuarios");
            return res.json(procesos.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_proceso/:id_proceso', async (req, res) => {
    try {
        const { id_proceso } = req.params;
        // Comprobar si el usuario tiene procesos
        const nro_procesos = await pool.query('SELECT * FROM pac.pac_procesos WHERE pac_fase_preparatoria_pk = $1', [id_proceso]);

        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontro el proceso' });
        }
        try {
            // Obtener los procesos del usuario
            const procesos = await pool.query('SELECT * FROM pac.pac_procesos WHERE pac_fase_preparatoria_pk = $1', [id_proceso]);
            return res.json(procesos.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_reforma/:secuencial_reforma', async (req, res) => {
    try {
        const { secuencial_reforma } = req.params;
        // Comprobar si el usuario tiene procesos
        const nro_procesos = await pool.query('SELECT * FROM pac.pac_reformas_pac WHERE secuencial_reforma = $1', [secuencial_reforma]);

        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontro el proceso' });
        }
        try {
            // Obtener los procesos del usuario
            const procesos = await pool.query('SELECT * FROM pac.pac_reformas_pac WHERE secuencial_reforma = $1', [secuencial_reforma]);
            return res.json(procesos.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});


app.get('/obtener_reformas/', async (req, res) => {
    try {
        const { secuencial_reforma } = req.params;
        // Comprobar si el usuario tiene procesos
        const nro_procesos = await pool.query('SELECT * FROM pac.pac_reformas_pac');

        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontro el proceso' });
        }
        try {
            // Obtener los procesos del usuario
            const procesos = await pool.query('SELECT * FROM pac.pac_reformas_pac ORDER BY id_proceso');
            return res.json(procesos.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_reformas_autorizadas/:secuencial_resolucion', async (req, res) => {
    try {
        const { secuencial_resolucion } = req.params;
        const procesos = await pool.query('SELECT * FROM pac.pac_reformas_pac WHERE secuencial_resolucion = $1', [secuencial_resolucion]);
        return res.json(procesos.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_resoluciones/:estado', async (req, res) => {
    try {
        const { estado } = req.params;
        // Comprobar si el usuario tiene procesos
        const nro_resolu = await pool.query('SELECT * FROM pac.pac_resoluciones WHERE estado = $1', [estado]);

        if (nro_resolu.rows.length === 0) {
            return res.json({ message: 'No se encontro el proceso' });
        }
        try {
            // Obtener los procesos del usuario
            const resolu = await pool.query('SELECT * FROM pac.pac_resoluciones WHERE estado = $1', [estado]);
            return res.json(resolu.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_resolucion/:secuencial_resolucion', async (req, res) => {
    try {
        const { secuencial_resolucion } = req.params;
        // Comprobar si el usuario tiene procesos
        const nro_resolu = await pool.query('SELECT * FROM pac.pac_resoluciones WHERE secuencial_resolucion = $1', [secuencial_resolucion]);

        if (nro_resolu.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontro el proceso' });
        }
        try {
            // Obtener los procesos del usuario
            const resolu = await pool.query('SELECT * FROM pac.pac_resoluciones WHERE secuencial_resolucion = $1', [secuencial_resolucion]);
            return res.json(resolu.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_id_proceso/', async (req, res) => {
    try{
        const id_proceso = await pool.query('SELECT nextval(\'pac.pac_procesos_id_proceso_seq\')');
        return res.json(id_proceso.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.get('/obtener_id_resolucion/', async (req, res) => {
    try{
        const id_proceso = await pool.query('SELECT nextval(\'pac.pac_resoluciones_secuencial_resolucion_seq\')');
        return res.json(id_proceso.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});

app.post('/registrarProceso/', async (req, res) => {
    try {
        const { proceso, partida, anio, cpc, tipoCompra, codigoProceso, detalleProducto, cantidadAnual, estado, costoUnitario, total, cuatrimestre, fechaEedh, fechaReedh, fechaEstPublic, fechaRealPublic, tipoProducto, catalogoElectronico, procedimeintoSugerido, fondosBid, codOpePresBid, codigoProyectoBid, tipoRegimen, tipoPresupuesto, funcionarioResponsable, directorResponsable, versionProceso, unidad, presupuestoPublicado, observaciones, revisorCompras, funcionarioRevisor, fechaUltModif, usrCreacion, usrUltModif, fechaCreacion, direccion, partidaPresupuestaria, pacFasePreparatoriaPK, secuencialResolucion, eliminado, estadoFasePreparatoria, fechaEdp, fechaCpc, fechaRv, fechaSip, fechaExp, fechaElp, fechaSi, fechaRi, fechaFin, revisorJuridico, idDepartamento, reqIp } = req.body;
        await pool.query('INSERT INTO pac.pac_procesos(id_proceso, id_partida, "año", cpc, tipo_compra, codigo_proceso, detalle_producto, cantidad_anual, estado, costo_unitario, total, cuatrimestre, fecha_eedh, fecha_reedh, fecha_est_public, fecha_real_public, tipo_producto, catalogo_electronico, procedimiento_sugerido, fondos_bid, cod_ope_pres_bid, codigo_proyecto_bid, tipo_regimen, tipo_presupuesto, funcionario_responsable, director_responsable, version_proceso, unidad, presupuesto_publicado, observaciones, revisor_compras, funcionario_revisor, fecha_ult_modif, usr_creacion, usr_ult_modif, fecha_creacion, direccion, partida_presupuestaria, pac_fase_preparatoria_pk, secuencial_resolucion, eliminado, estado_fase_preparatoria, fecha_edp, fecha_cpc, fecha_rv, fecha_sip, fecha_exp, fecha_elp, fecha_si, fecha_ri, fecha_fin, revisor_juridico, id_departamento, req_ip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54)', [proceso, partida, anio, cpc, tipoCompra, codigoProceso, detalleProducto, cantidadAnual, estado, costoUnitario, total, cuatrimestre, fechaEedh, fechaReedh, fechaEstPublic, fechaRealPublic, tipoProducto, catalogoElectronico, procedimeintoSugerido, fondosBid, codOpePresBid, codigoProyectoBid, tipoRegimen, tipoPresupuesto, funcionarioResponsable, directorResponsable, versionProceso, unidad, presupuestoPublicado, observaciones, revisorCompras, funcionarioRevisor, fechaUltModif, usrCreacion, usrUltModif, fechaCreacion, direccion, partidaPresupuestaria, pacFasePreparatoriaPK, secuencialResolucion, eliminado, estadoFasePreparatoria, fechaEdp, fechaCpc, fechaRv, fechaSip, fechaExp, fechaElp, fechaSi, fechaRi, fechaFin, revisorJuridico, idDepartamento, reqIp]);
        return res.status(201).json({ message: 'Proceso registrado con éxito' });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.post('/registrarReforma/', async (req, res) => {
    try {
        const { area_requirente, anio, just_tecnica, just_econom, just_caso_fort_fmayor, id_partida_presupuestaria, partida_presupuestaria, cpc, tipo_compra, tipo_regimen, tipo_presupuesto, tipo_producto, procedimiento_sugerido, descripcion, cantidad, unidad, costo_unitario, total, cuatrimestre, fecha_eedh, fecha_est_public, tipo_reforma, observaciones, usr_creacion, fecha_creacion, id_proceso, estado_elaborador, usr_revisor, usr_aprobador, usr_consolidador, usr_autorizador, id_departamento, version_proceso, comentario, secuencial_resolucion } = req.body;
        await pool.query('INSERT INTO pac.pac_reformas_pac(area_requirente, anio, just_tecnica, just_econom, just_caso_fort_fmayor, id_partida_presupuestaria, partida_presupuestaria, cpc, tipo_compra, tipo_regimen, tipo_presupuesto, tipo_producto, procedimiento_sugerido, descripcion, cantidad, unidad, costo_unitario, total, cuatrimestre, fecha_eedh, fecha_est_public, tipo_reforma, observaciones, usr_creacion, fecha_creacion, id_proceso, estado_elaborador, usr_revisor, usr_aprobador, usr_consolidador, usr_autorizador, id_departamento, version_proceso, comentario, secuencial_resolucion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35)', [area_requirente, anio, just_tecnica, just_econom, just_caso_fort_fmayor, id_partida_presupuestaria, partida_presupuestaria, cpc, tipo_compra, tipo_regimen, tipo_presupuesto, tipo_producto, procedimiento_sugerido, descripcion, cantidad, unidad, costo_unitario, total, cuatrimestre, fecha_eedh, fecha_est_public, tipo_reforma, observaciones, usr_creacion, fecha_creacion, id_proceso, estado_elaborador, usr_revisor, usr_aprobador, usr_consolidador, usr_autorizador, id_departamento, version_proceso, comentario, secuencial_resolucion]);
        return res.status(201).json({ message: 'Reforma registrada con éxito' });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.post('/generar_detalle_reforma/', async (req, res) => {
    try {
        const { datos } = req.body;
        if (!datos || !Array.isArray(datos)) {
            throw new Error('Datos no válidos');
        }

        const pdfDoc = new PDFDocument();
        const buffers = [];

        pdfDoc.on('data', chunk => buffers.push(chunk));
        pdfDoc.on('end', () => {
            try {
                const pdfData = Buffer.concat(buffers);
                res.status(200)
                    .header('Content-Type', 'application/pdf')
                    .header('Content-Disposition', 'attachment; filename=output.pdf')
                    .send(pdfData);
            } catch (error) {
                console.error('Error al enviar el PDF:', error);
                res.status(500).json({ error: 'Error al enviar el PDF', mensaje: error.message });
            }
        });

        pdfDoc.text('Datos:\n\n');
        datos.forEach(item => {
            pdfDoc.text(JSON.stringify(item));
            pdfDoc.moveDown();
        });

        pdfDoc.end();
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).json({ error: 'Error al generar el PDF', mensaje: error.message });
    }
});

app.post('/registrarResolucion', upload.single('url_detalle_resol'), async (req, res) => {
    try {
      const { secuencial_resolucion, fch_solicitada, usr_solicita, estado } = req.body;
  
      // Obtener el archivo PDF desde la solicitud
      const pdfData = req.file.buffer;
  
      // Insertar datos en la base de datos
      const query = 'INSERT INTO pac.pac_resoluciones(secuencial_resolucion, fch_solicitada, usr_solicita, estado, url_detalle_resol) VALUES ($1, $2, $3, $4, $5)';
      const values = [secuencial_resolucion, fch_solicitada, usr_solicita, estado, pdfData];
  
      await pool.query(query, values);
  
      res.status(200).json({ message: 'Resolución registrada exitosamente' });
    } catch (error) {
      console.error('Error al registrar resolución:', error);
      res.status(500).json({ message: 'Error al registrar resolución' });
    }
});


app.post('/actualizarResolucionCargada', upload.fields([
    { name: 'url_resolucion' },
    { name: 'url_detalle_resol' }
]), async (req, res) => {
    try {
      const { fch_carga_documento, usr_carga, nro_sol_resol, secuencial_resolucion } = req.body;

      const archivos = req.files;
      if (!archivos || !archivos['url_resolucion'] || !archivos['url_detalle_resol']) {
        return res.status(400).json({ message: 'No se encontraron archivos adjuntos' });
        }
      const url_resolucion = archivos['url_resolucion'][0];
      const url_detalle_resol = archivos['url_detalle_resol'][0];
  
      const query = 'UPDATE pac.pac_resoluciones SET fch_carga_documento = $2, usr_carga = $3, nro_sol_resol = $4, url_resolucion = $5, url_detalle_resol = $6, estado = $7 WHERE secuencial_resolucion = $1';
      const values = [secuencial_resolucion, fch_carga_documento, usr_carga, nro_sol_resol, url_resolucion, url_detalle_resol, 'Iniciado'];

  
      await pool.query(query, values);
  
      res.status(200).json({ message: 'Resolución actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar resolución:', error);
      res.status(500).json({ message: 'Error al actualizar resolución', error: error.message });
    }
});

app.post('/actualizarResolucionFirmada', upload.fields([
    { name: 'url_resolucion_firmada' },
    { name: 'url_detalle_resol' }
]), async (req, res) => {
    try {
      const { fch_carga_firmada, usr_carga_firmada, nro_sol_resol, secuencial_resolucion } = req.body;

      const archivos = req.files;
      if (!archivos || !archivos['url_resolucion_firmada'] || !archivos['url_detalle_resol']) {
        return res.status(400).json({ message: 'No se encontraron archivos adjuntos' });
        }
      const url_resolucion_firmada = archivos['url_resolucion_firmada'][0];
      const url_detalle_resol = archivos['url_detalle_resol'][0];
  
      const query = 'UPDATE pac.pac_resoluciones SET fch_carga_firmada = $2, usr_carga_firmada = $3, nro_sol_resol = $4, url_resolucion_firmada = $5, url_detalle_resol = $6, estado = $7 WHERE secuencial_resolucion = $1';
      const values = [secuencial_resolucion, fch_carga_firmada, usr_carga_firmada, nro_sol_resol, url_resolucion_firmada, url_detalle_resol, 'Firmada'];

  
      await pool.query(query, values);
  
      res.status(200).json({ message: 'Resolución firmada actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar resolución:', error);
      res.status(500).json({ message: 'Error al actualizar resolución firmada', error: error.message });
    }
});

app.post('/registrarDireccion', async (req, res) => {
    try {
      const { nombre_direccion, fecha_creacion, fecha_actualizacion, id_superior, siglas_direccion } = req.body;
      const query = 'INSERT INTO pac.pac_direcciones(nombre_direccion, fecha_creacion, fecha_actualizacion, id_superior, siglas_direccion) VALUES ($1, $2, $3, $4, $5)';
      const values = [nombre_direccion, fecha_creacion, fecha_actualizacion, id_superior, siglas_direccion];
      await pool.query(query, values);
      res.status(200).json({ message: 'Dirección registrada exitosamente' });
    } catch (error) {
      console.error('Error al registrar dirección:', error);
      res.status(500).json({ message: 'Error al registrar dirección' });
    }
});

app.post('/registrarInfimaCuantia', async (req, res) => {
    try {
      const { id_direccion, id_partida, partida_presupuestaria, cpc, tipo_compra, detalle_producto, cantidad, unidad,  fecha_inicio_estado, estado, elaborador, aprobador} = req.body;
      const query = 'INSERT INTO pac.pac_infimas_cuantias(id_direccion, id_partida, partida_presupuestaria, cpc, tipo_compra, detalle_producto, cantidad, unidad, fecha_inicio_estado, estado, elaborador, aprobador) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);';
      const values = [id_direccion, id_partida, partida_presupuestaria, cpc, tipo_compra, detalle_producto, cantidad, unidad,  fecha_inicio_estado, estado, elaborador, aprobador];
      await pool.query(query, values);
      res.status(200).json({ message: 'Infima Cuantia registrada exitosamente' });
    } catch (error) {
      console.error('Error al registrar Infima Cuantia:', error);
      res.status(500).json({ message: 'Error al registrar Infima Cuantia' });
    }
});

app.post('/actualizar_responsables', async (req, res) => {
    try {
        const { id_infima, elaborador, aprobador, revisor_compras, oferente_adjudicado } = req.body;

        // Realizar la actualización en la base de datos
        await pool.query(
            'UPDATE pac.pac_infimas_cuantias SET elaborador = $1, aprobador = $2, revisor_compras = $3, oferente_adjudicado = $4 WHERE id_infima = $5',
            [elaborador, aprobador, revisor_compras, oferente_adjudicado, id_infima]
        );

        return res.json({ message: 'Responsables actualizados correctamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor: ' + error });
    }
});


app.post('/registrarDocHab', async (req, res) => {
    try {
      const { nombre_doc, tipo_compra, obligatorio, email_doc, tipo_proceso } = req.body;
      const query = 'INSERT INTO pac.pac_doc_habilitantes(nombre_doc, tipo_compra, obligatorio, email_doc, tipo_proceso) VALUES ($1, $2, $3, $4, $5)';
      const values = [nombre_doc, tipo_compra, obligatorio, email_doc, tipo_proceso];
      await pool.query(query, values);
      res.status(200).json({ message: 'Documento registrado exitosamente' });
    } catch (error) {
      console.error('Error al registrar documento:', error);
      res.status(500).json({ message: 'Error al registrar documento' });
    }
});

app.post('/actualizarDocHab', async (req, res) => {
    try {
      const { id_doc, nombre_doc, tipo_compra, obligatorio, email_doc, tipo_proceso } = req.body;
      const query = `
        UPDATE pac.pac_doc_habilitantes
        SET nombre_doc = $2, tipo_compra = $3, obligatorio = $4, email_doc = $5, tipo_proceso = $6
        WHERE id_doc = $1
      `;
      const values = [id_doc, nombre_doc, tipo_compra, obligatorio, email_doc, tipo_proceso];
      await pool.query(query, values);
      res.status(200).json({ message: 'Documento actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar documento:', error);
      res.status(500).json({ message: 'Error al actualizar documento' });
    }
});

app.post('/eliminarDocHab', async (req, res) => {
    try {
      const { id_doc } = req.body;
      const query = 'DELETE FROM pac.pac_doc_habilitantes WHERE id_doc = $1';
      const values = [id_doc];
      await pool.query(query, values);
      res.status(200).json({ message: 'Documento eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      res.status(500).json({ message: 'Error al eliminar documento' });
    }
});
  
  

app.post('/registrarDocGen', async (req, res) => {
    try {
      const { nombre_doc, obligatorio, email_doc, fase_preparatoria, tipo_proceso } = req.body;
      const query = 'INSERT INTO pac.pac_doc_generales(nombre_doc, obligatorio, email_doc, fase_preparatoria, tipo_proceso) VALUES ($1, $2, $3, $4, $5)';
      const values = [nombre_doc, obligatorio, email_doc, fase_preparatoria, tipo_proceso];
      await pool.query(query, values);
      res.status(200).json({ message: 'Documento registrada exitosamente' });
    } catch (error) {
      console.error('Error al registrar documento:', error);
      res.status(500).json({ message: 'Error al registrar documento' });
    }
});

app.post('/actualizarDocGen', async (req, res) => {
    try {
      const { id_doc, nombre_doc, obligatorio, email_doc, fase_preparatoria, tipo_proceso } = req.body;
      const query = `
        UPDATE pac.pac_doc_generales
        SET nombre_doc = $2, obligatorio = $3, email_doc = $4, fase_preparatoria = $5, tipo_proceso = $6
        WHERE id_doc = $1
      `;
      const values = [id_doc, nombre_doc, obligatorio, email_doc, fase_preparatoria, tipo_proceso];
      await pool.query(query, values);
      res.status(200).json({ message: 'Documento actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar documento:', error);
      res.status(500).json({ message: 'Error al actualizar documento' });
    }
});

app.post('/eliminarDocGen', async (req, res) => {
    try {
      const { id_doc } = req.body;
      const query = 'DELETE FROM pac.pac_doc_generales WHERE id_doc = $1';
      const values = [id_doc];
      await pool.query(query, values);
      res.status(200).json({ message: 'Documento eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      res.status(500).json({ message: 'Error al eliminar documento' });
    }
});
  
  

app.post('/registrarComentario', async (req, res) => {
    try {
        const { comentario, correo_usuario, proceso, fecha } = req.body;

        // Obtener el id_usuario correspondiente al correo proporcionado
        const userQuery = 'SELECT id_usuario FROM pac.pac_usuarios WHERE correo_usuario = $1';
        const userResult = await pool.query(userQuery, [correo_usuario]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const id_usuario = userResult.rows[0].id_usuario;

        // Insertar el comentario utilizando el id_usuario obtenido
        const query = 'INSERT INTO pac.pac_comentarios(comentario, usuario, proceso, fecha) VALUES ($1, $2, $3, $4)';
        const values = [comentario, id_usuario, proceso, fecha];
        await pool.query(query, values);

        res.status(200).json({ message: 'Comentario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar comentario:', error);
        res.status(500).json({ message: 'Error al registrar comentario', error: error.message });
    }
});

app.post('/registrarReplanificacion', async (req, res) => {
    const {
      procedimiento_sugerido,
      tipo_compra,
      detalle_producto,
      fecha_eedhA,
      cuatrimestreA,
      fecha_publiA,
      fecha_eedhN,
      cuatrimestreN,
      fecha_publiN,
      justificacion,
      estado_solicitud,
      usuario_solicitante,
      pac_fase_preparatoria_pk
    } = req.body;
  
    const query = `
      INSERT INTO pac.pac_replanificacion_procesos (
        procedimiento_sugerido, 
        tipo_compra, 
        detalle_producto, 
        "fecha_eedhA", 
        "cuatrimestreA", 
        "fecha_publiA", 
        "fecha_eedhN", 
        "cuatrimestreN", 
        "fecha_publiN", 
        justificacion, 
        estado_solicitud, 
        usuario_solicitante, 
        pac_fase_preparatoria_pk
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
    `;
  
    const values = [
      procedimiento_sugerido,
      tipo_compra,
      detalle_producto,
      fecha_eedhA,
      cuatrimestreA,
      fecha_publiA,
      fecha_eedhN,
      cuatrimestreN,
      fecha_publiN,
      justificacion,
      estado_solicitud,
      usuario_solicitante,
      pac_fase_preparatoria_pk
    ];
  
    try {
      await pool.query(query, values);
      res.status(201).send('Replanificacion ingresada correctamente');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al insertar replanificacion');
    }
  });


app.post('/actualizarDireccion', async (req, res) => {
    try {
      const { id_direccion, nombre_direccion, fecha_actualizacion, id_superior, siglas_direccion } = req.body;
      const query = 'UPDATE pac.pac_direcciones SET nombre_direccion = $1, fecha_actualizacion = $2, id_superior = $3, siglas_direccion = $4 WHERE id_direccion = $5';
      const values = [nombre_direccion, fecha_actualizacion, id_superior, siglas_direccion, id_direccion];
      await pool.query(query, values);
      res.status(200).json({ message: 'Dirección actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar dirección:', error);
      res.status(500).json({ message: 'Error al actualizar dirección' });
    }
});  


app.post('/actualizarPAC', async (req, res) => {
    try {
        await pool.query('BEGIN');
        const { secuencial_resolucion, reformasAutorizadas } = req.body;
        const reformas = JSON.parse(reformasAutorizadas);
        const updateQuery = 'UPDATE pac.pac_resoluciones SET estado = $1 WHERE secuencial_resolucion = $2';
        const updateValues = ['Aplicada', secuencial_resolucion];
        await pool.query(updateQuery, updateValues);

        for (let i = 0; i < reformas.length; i++) {
            const reforma = reformas[i];
            let catalogo_electronico = 'NO';
            if(reforma.procedimiento_sugerido == 'CATALOGO ELECTRONICO'){
                catalogo_electronico = 'SI';
            }
            let revisorCompras = null;
            let revisorJuridico = null;
            if (reforma.tipo_reforma === 'Modificacion') {
                const selectQuery = 'SELECT revisor_compras, revisor_juridico FROM pac.pac_procesos WHERE pac_fase_preparatoria_pk = $1';
                const selectValues = [reforma.id_proceso + '-' + (reforma.version_proceso - 1)];
                const result = await pool.query(selectQuery, selectValues);
                if (result.rows.length > 0) {
                    revisorCompras = result.rows[0].revisor_compras;
                    revisorJuridico = result.rows[0].revisor_juridico;
                }
            }
            const pac_fase_preparatoria_pk = reforma.id_proceso + '-' + reforma.version_proceso;
            const insertQuery = 'INSERT INTO pac.pac_procesos(id_proceso, id_partida, "año", cpc, tipo_compra, codigo_proceso, detalle_producto, cantidad_anual, estado, costo_unitario, total, cuatrimestre, fecha_eedh, fecha_reedh, fecha_est_public, fecha_real_public, tipo_producto, catalogo_electronico, procedimiento_sugerido, fondos_bid, cod_ope_pres_bid, codigo_proyecto_bid, tipo_regimen, tipo_presupuesto, funcionario_responsable, director_responsable, version_proceso, unidad, presupuesto_publicado, observaciones, revisor_compras, funcionario_revisor, fecha_ult_modif, usr_creacion, usr_ult_modif, fecha_creacion, direccion, partida_presupuestaria, pac_fase_preparatoria_pk, secuencial_resolucion, eliminado, estado_fase_preparatoria, fecha_edp, fecha_cpc, fecha_rv, fecha_sip, fecha_exp, fecha_elp, fecha_si, fecha_ri, fecha_fin, revisor_juridico, id_departamento, req_ip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54)';
            const insertValues = [reforma.id_proceso, reforma.id_partida_presupuestaria, reforma.anio, reforma.cpc, reforma.tipo_compra, '', reforma.descripcion, reforma.cantidad, reforma.estado, reforma.costo_unitario, reforma.total, reforma.cuatrimestre, reforma.fecha_eedh, null, reforma.fecha_est_public, null, reforma.tipo_producto, catalogo_electronico, reforma.procedimiento_sugerido, null, null, null, reforma.tipo_regimen, reforma.tipo_presupuesto, reforma.usr_creacion, reforma.usr_aprobador, reforma.version_proceso, reforma.unidad, null, reforma.observaciones, revisorCompras, null, reforma.fecha_creacion, reforma.usr_creacion, reforma.usr_creacion, reforma.fecha_creacion, reforma.area_requirente, reforma.partida_presupuestaria, pac_fase_preparatoria_pk, reforma.secuencialResolucion, reforma.eliminado, 'NO INICIADO', null, null, null, null, null, null, null, null, null, revisorJuridico, reforma.id_departamento, 'NO'];
            await pool.query(insertQuery, insertValues);
        }
        
        await pool.query('COMMIT');
        res.status(200).json({ message: 'Actualizacion del PAC exitosa' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error al actualizar PAC:', error);
        res.status(500).json({ message: 'Error al actualizar PAC', error: error.message });
    }
});



app.post('/borrarDireccion', async (req, res) => {
    try {
      const { id_direccion } = req.body;
      const query = 'DELETE FROM pac.pac_direcciones WHERE id_direccion = $1';
      const values = [id_direccion];
      await pool.query(query, values);
      res.status(200).json({ message: 'Dirección eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      res.status(500).json({ message: 'Error al eliminar dirección' });
    }
});

app.post('/borrarInfima', async (req, res) => {
    try {
      const { id_infima } = req.body;
      const query = 'DELETE FROM pac.pac_infimas_cuantias WHERE id_infima = $1';
      const values = [id_infima];
      await pool.query(query, values);
      res.status(200).json({ message: 'Ínfima eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      res.status(500).json({ message: 'Error al eliminar ínfima' });
    }
});

app.post('/registrarRolUsuario', async (req, res) => {
    try {
      const { usuario, rol} = req.body;
      const query = 'INSERT INTO pac.pac_roles_usuarios(usuario, rol) VALUES ($1, $2)';
      const values = [usuario, rol];
      await pool.query(query, values);
      res.status(200).json({ message: 'Rol del Usuario registrado exitosamente' });
    } catch (error) {
      console.error('Error al registrar dirección:', error);
      res.status(500).json({ message: 'Error al registrar Rol del Usuario' });
    }
});

app.post('/registrarDepartamento', async (req, res) => {
    try {
      const { id_direccion, nombre_departamento, fecha_creacion, fecha_modificacion, id_superior } = req.body;
      const query = 'INSERT INTO pac.pac_departamentos(id_direccion, nombre_departamento, fecha_creacion, fecha_modificacion, id_superior) VALUES ($1, $2, $3, $4, $5)';
      const values = [id_direccion, nombre_departamento, fecha_creacion, fecha_modificacion, id_superior];
      await pool.query(query, values);
      res.status(200).json({ message: 'Departamento registrado exitosamente' });
    } catch (error) {
      console.error('Error al registrar dirección:', error);
      res.status(500).json({ message: 'Error al registrar Departamento' });
    }
});

app.post('/actualizarDepartamento', async (req, res) => {
    try {
      const { id_departamento, id_direccion, nombre_departamento, fecha_modificacion, id_superior } = req.body;
      const query = 'UPDATE pac.pac_departamentos SET id_direccion= $1, nombre_departamento = $2, fecha_modificacion = $3, id_superior = $4 WHERE id_departamento = $5';
      const values = [id_direccion, nombre_departamento, fecha_modificacion, id_superior, id_departamento];
      await pool.query(query, values);
      res.status(200).json({ message: 'Departamento actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar dirección:', error);
      res.status(500).json({ message: 'Error al actualizar Departamento' });
    }
});  

app.post('/borrarDepartamento', async (req, res) => {
    try {
      const { id_departamento } = req.body;
      const query = 'DELETE FROM pac.pac_departamentos WHERE id_departamento = $1';
      const values = [id_departamento];
      await pool.query(query, values);
      res.status(200).json({ message: 'Departamento eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar dirección:', error);
      res.status(500).json({ message: 'Error al eliminar Departamento' });
    }
});

app.post('/registrarRol', async (req, res) => {
    try {
        const { nombre_rol, accesos } = req.body;
        await pool.query('BEGIN'); // Iniciar transacción
        // Insertar el nuevo rol y obtener su id_rol generado por la secuencia
        const nuevoRolResult = await pool.query('INSERT INTO pac.pac_roles(nombre_rol) VALUES ($1) RETURNING id_rol', [nombre_rol]);
        const idRol = nuevoRolResult.rows[0].id_rol;
        const accesosActivos = Object.entries(accesos).filter(([id_opcion, activo]) => activo).map(([id_opcion, _]) => id_opcion);
        for (const id_opcion of accesosActivos) {
        await pool.query('INSERT INTO pac.pac_accesos(opcion_menu, opcion_rol) VALUES ($1, $2)', [id_opcion, idRol]);
        }
        await pool.query('COMMIT'); // Confirmar transacción
        console.log('Transacción completada');
        res.status(200).json({ message: 'Rol registrado exitosamente' });
    } catch (error) {
        await pool.query('ROLLBACK'); // Cancelar transacción en caso de error
        console.error('Error al registrar rol:', error);
        res.status(500).json({ message: 'Error al registrar rol', error: error.message });
    }
  });
  
app.post('/actualizarRol', async (req, res) => {
    try {
      const { id_rol, nombre_rol, accesos } = req.body;

      await pool.query('BEGIN'); // Iniciar transacción

      const nuevoRolResult = await pool.query('UPDATE pac.pac_roles SET nombre_rol= $1 WHERE id_rol = $2', [nombre_rol, id_rol]);
      await pool.query('DELETE FROM pac.pac_accesos WHERE opcion_rol = $1', [id_rol]);

      const accesosActivos = Object.entries(accesos).filter(([id_opcion, activo]) => activo).map(([id_opcion, _]) => id_opcion);
      for (const id_opcion of accesosActivos) {
        await pool.query('INSERT INTO pac.pac_accesos(opcion_menu, opcion_rol) VALUES ($1, $2)', [id_opcion, id_rol]);
      }
      await pool.query('COMMIT'); // Confirmar transacción
      console.log('Transacción completada');
  
      res.status(200).json({ message: 'Rol actualizado exitosamente' });
    } catch (error) {
      await pool.query('ROLLBACK'); // Cancelar transacción en caso de error
      console.error('Error al registrar rol:', error);
      res.status(500).json({ message: 'Error al actualizar rol', error: error.message });
    }
  });
  

app.post('/borrarRol', async (req, res) => {
    try {
      const { id_rol } = req.body;
      await pool.query('BEGIN'); // Iniciar transacción
      await pool.query('DELETE FROM pac.pac_accesos WHERE opcion_rol = $1', [id_rol]);
      await pool.query('DELETE FROM pac.pac_roles WHERE id_rol = $1', [id_rol]);
      await pool.query('DELETE FROM pac.pac_roles_usuarios WHERE rol = $1', [id_rol]);
      await pool.query('COMMIT'); // Confirmar transacción
      console.log('Transacción completada');
      res.status(200).json({ message: 'Rol eliminado exitosamente' });
    } catch (error) {
      await pool.query('ROLLBACK'); // Cancelar transacción en caso de error
      console.error('Error al eliminar rol:', error);
      res.status(500).json({ message: 'Error al eliminar rol' });
    }
  });
  
app.post('/actualizarResolucion/', async (req, res) => {
    try {
        const { fch_carga_documento, fch_carga_firmada, usr_carga, usr_carga_firmada, estado, url_resolucion, url_resol_firmada, codigo_resolucion, nro_sol_resol } = req.body;
        await pool.query('INSERT INTO pac.pac_reformas_pac(area_requirente, anio, just_tecnica, just_econom, just_caso_fort_fmayor, id_partida_presupuestaria, partida_presupuestaria, cpc, tipo_compra, tipo_regimen, tipo_presupuesto, tipo_producto, procedimiento_sugerido, descripcion, cantidad, unidad, costo_unitario, total, cuatrimestre, fecha_eedh, fecha_est_public, tipo_reforma, observaciones, usr_creacion, fecha_creacion, id_proceso, estado_elaborador, usr_revisor, usr_aprobador, usr_consolidador, usr_autorizador, id_departamento, version_proceso, comentario, secuencial_resolucion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35)', [area_requirente, anio, just_tecnica, just_econom, just_caso_fort_fmayor, id_partida_presupuestaria, partida_presupuestaria, cpc, tipo_compra, tipo_regimen, tipo_presupuesto, tipo_producto, procedimiento_sugerido, descripcion, cantidad, unidad, costo_unitario, total, cuatrimestre, fecha_eedh, fecha_est_public, tipo_reforma, observaciones, usr_creacion, fecha_creacion, id_proceso, estado_elaborador, usr_revisor, usr_aprobador, usr_consolidador, usr_autorizador, id_departamento, version_proceso, comentario, secuencial_resolucion]);
        return res.status(201).json({ message: 'Reforma registrada con éxito' });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.post('/eliminarReforma/', async (req, res) => {
    try {
        const { id_proceso, version_proceso, just_tec, just_econom, just_caso_fort } = req.body;
        await pool.query('SELECT pac.eliminar_procesos_pac_reformas_proc($1, $2, $3, $4, $5)', [id_proceso, version_proceso, just_tec, just_econom, just_caso_fort]);
        return res.status(201).json({ message: 'Reforma eliminada con éxito' });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.post('/eliminarFisicaReforma/', async (req, res) => {
    try {
        const { secuencial_reforma } = req.body;
        await pool.query('DELETE FROM pac.pac_reformas_pac WHERE secuencial_reforma = $1', [secuencial_reforma]);
        return res.status(201).json({ message: 'Reforma eliminada con éxito' });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.post('/editarReforma/', async (req, res) => {
    try {
        const {just_tecnica, just_econom, just_caso_fort_fmayor, id_partida_presupuestaria,partida_presupuestaria, cpc, tipo_compra, tipo_regimen, tipo_presupuesto, tipo_producto, procedimiento_sugerido,  descripcion, cantidad, unidad, costo_unitario, total, cuatrimestre, fecha_eedh, fecha_est_public, observaciones, comentario, secuencial_reforma} = req.body;
        await pool.query('UPDATE pac.pac_reformas_pac SET just_tecnica = $1, just_econom = $2, just_caso_fort_fmayor = $3, id_partida_presupuestaria = $4, partida_presupuestaria = $5, cpc = $6, tipo_compra = $7, tipo_regimen = $8, tipo_presupuesto = $9, tipo_producto = $10, procedimiento_sugerido = $11, descripcion= $12, cantidad = $13, unidad = $14, costo_unitario= $15, total= $16, cuatrimestre = $17, fecha_eedh = $18, fecha_est_public = $19, observaciones = $20, comentario = $21 WHERE secuencial_reforma = $22', [just_tecnica, just_econom, just_caso_fort_fmayor, id_partida_presupuestaria,partida_presupuestaria, cpc, tipo_compra, tipo_regimen, tipo_presupuesto, tipo_producto, procedimiento_sugerido,  descripcion, cantidad, unidad, costo_unitario, total, cuatrimestre, fecha_eedh, fecha_est_public, observaciones, comentario, secuencial_reforma]);
        return res.status(201).json({ message: 'Reforma Editada con éxito' });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.post('/cambiarEstadoReforma/', async (req, res) => {
    try {
        const {estadoACambiar, estadoNuevo, secuencial_reforma} = req.body;
        if(estadoACambiar === 'estado_revisor'){
            await pool.query('UPDATE pac.pac_reformas_pac SET estado_revisor = $1 WHERE secuencial_reforma=$2', [estadoNuevo,secuencial_reforma]);
            return res.status(201).json({ message: 'Estado de Reforma Cambiado con Éxito' });
        }
        if(estadoACambiar === 'estado_aprobador'){
            await pool.query('UPDATE pac.pac_reformas_pac SET estado_aprobador = $1 WHERE secuencial_reforma=$2', [estadoNuevo,secuencial_reforma]);
            return res.status(201).json({ message: 'Estado de Reforma Cambiado con Éxito' });
        }
        if(estadoACambiar === 'estado_consolidador'){
            await pool.query('UPDATE pac.pac_reformas_pac SET estado_consolidador = $1 WHERE secuencial_reforma=$2', [estadoNuevo,secuencial_reforma]);
            return res.status(201).json({ message: 'Estado de Reforma Cambiado con Éxito' });
        }
        if(estadoACambiar === 'estado_autorizador'){
            await pool.query('UPDATE pac.pac_reformas_pac SET estado_autorizador = $1 WHERE secuencial_reforma=$2', [estadoNuevo,secuencial_reforma]);
            return res.status(201).json({ message: 'Estado de Reforma Cambiado con Éxito' });
        }
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.post('/cambiar_fase_preparatoria/', async (req, res) => {
    try {
        const { estadoNuevo, pac_fase_preparatoria_pk } = req.body;
        await pool.query('UPDATE pac.pac_procesos SET estado_fase_preparatoria = $1 WHERE pac_fase_preparatoria_pk = $2', [estadoNuevo, pac_fase_preparatoria_pk]);
        return res.status(201).json({ message: 'Estado de Proceso Cambiado con Éxito' });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
});

app.post('/cambiar_fase_preparatoria_infima/', async (req, res) => {
    try {
        const { estadoNuevo, id_infima } = req.body;
        await pool.query('UPDATE pac.pac_infimas_cuantias SET estado = $1 WHERE id_infima = $2', [estadoNuevo, id_infima]);
        return res.status(201).json({ message: 'Estado de Infima Cambiado con Éxito' });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor: ' + error.message });
    }
});

app.post('/enviarComentario/', async (req, res) => {
    try {
        const {comentario, secuencial_reforma} = req.body;
        await pool.query('UPDATE pac.pac_reformas_pac SET comentario = $1 WHERE secuencial_reforma=$2', [comentario,secuencial_reforma]);
        return res.status(201).json({ message: 'Comentario enviado con Éxito' });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.post('/enviarBitacora', async (req, res) => {
    try {
        const { fecha, remitente, estado_inicial, destinatario, estado_final, comentario, id_infima } = req.body;
        const query = `
            INSERT INTO pac.pac_bitacora_infima (fecha, remitente, estado_inicial, destinatario, estado_final, comentario, id_infima)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await pool.query(query, [fecha, remitente, estado_inicial, destinatario, estado_final, comentario, id_infima]);
        return res.status(201).json({ message: 'Bitácora enviada con éxito' });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor: ' + error });
    }
});


app.post('/actualizarSecuencial/', async (req, res) => {
    try {
        const {secuencial_resolucion, secuencial_reforma} = req.body;
        await pool.query('UPDATE pac.pac_reformas_pac SET secuencial_resolucion = $1 WHERE secuencial_reforma=$2', [secuencial_resolucion,secuencial_reforma]);
        return res.status(201).json({ message: 'Actualizado con exito' });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtenerPartidasPresupuestarias/:id_direccion', async (req, res) => {
    try {
        const { id_direccion } = req.params;
        const partidas = await pool.query('SELECT ppp.codigo_partida as index, ppp.actividad as opcion FROM pac.pac_partidas_presupuestarias as ppp WHERE id_direccion = $1', [id_direccion]);
        return res.json(partidas.rows);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtenerPartidaPresupuestaria/:codigo_partida/:actividad/:id_direccion', async (req, res) => {
    try {
        const { codigo_partida, actividad, id_direccion } = req.params;
        const partidas = await pool.query('SELECT * FROM pac.pac_partidas_presupuestarias WHERE codigo_partida = $1 and actividad = $2 and id_direccion = $3', [codigo_partida, actividad, id_direccion]);
        return res.json(partidas.rows);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtenerComentarios/:pac_fase_preparatoria_pk', async (req, res) => {
    try {
        const { pac_fase_preparatoria_pk } = req.params;
        const partidas = await pool.query('SELECT ROW_NUMBER() OVER() AS fila, u.nombres_usuario, u.apellidos_usuario, c.* FROM pac.pac_comentarios c INNER JOIN pac.pac_usuarios u ON c.usuario = u.id_usuario WHERE c.proceso = $1', [pac_fase_preparatoria_pk]);
        return res.json(partidas.rows);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtenerBitacora/:id_infima', async (req, res) => {
    try {
        const { id_infima } = req.params;
        const partidas = await pool.query('SELECT ROW_NUMBER() OVER() AS fila, * FROM pac.pac_bitacora_infima WHERE id_infima = $1', [id_infima]);
        return res.json(partidas.rows);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtenerCPC/:cp_codigo', async (req, res) => {
    try {
        const { cp_codigo } = req.params;
        const partidas = await pool.query('SELECT cp_codigo, cp_descripción FROM pac.pac_cpc WHERE cp_codigo = $1', [cp_codigo]);
        return res.json(partidas.rows);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtenerEmpresa/', async (req, res) => {
    try {
        const empresa = await pool.query('SELECT * FROM pac.pac_empresa');
        return res.json(empresa.rows);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_reformas_a_revisar/:rol/:id_departamento/:id_direccion', async (req, res) => {
    try {
        const { rol, id_departamento, id_direccion } = req.params;
        let empresa = null;
        if(rol === 'Administrador'){
            empresa = await pool.query("SELECT * FROM pac.pac_reformas_pac WHERE estado_revisor = 'Iniciado' ORDER BY id_proceso");
        }
        if(rol === 'Revisor'){
            empresa = await pool.query("SELECT * FROM pac.pac_reformas_pac WHERE estado_revisor = 'Iniciado' and id_departamento = $1 ORDER BY id_proceso", [id_departamento]);
        }
        if(rol === 'Aprobador'){
            empresa = await pool.query(`SELECT p.*
                                        FROM pac.pac_reformas_pac p
                                        JOIN pac.pac_direcciones dir ON p.area_requirente = dir.nombre_direccion
                                        WHERE p.estado_revisor = 'Iniciado' and dir.id_direccion = $1 ORDER BY p.id_proceso`, [id_direccion]);
        }
        
        return res.json(empresa.rows);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_reformas_a_aprobar/:rol/:id_direccion', async (req, res) => {
    try {
        const { rol, id_direccion } = req.params;
        let empresa = null;
        if(rol === 'Administrador'){
            empresa = await pool.query("SELECT * FROM pac.pac_reformas_pac WHERE estado_aprobador = 'Iniciado' ORDER BY id_proceso");
        }
        if(rol === 'Aprobador'){
            empresa = await pool.query(`SELECT p.*
                                        FROM pac.pac_reformas_pac p
                                        JOIN pac.pac_direcciones dir ON p.area_requirente = dir.nombre_direccion
                                        WHERE p.estado_aprobador = 'Iniciado' and dir.id_direccion = 1 ORDER BY p.id_proceso`, [id_direccion]);
        }
        return res.json(empresa.rows);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_reformas_a_consolidar/', async (req, res) => {
    try {
        const { rol, id_direccion } = req.params;
        let empresa = null;
        empresa = await pool.query("SELECT * FROM pac.pac_reformas_pac WHERE estado_consolidador = 'Iniciado' ORDER BY id_proceso");
        return res.json(empresa.rows);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_reformas_a_autorizar/', async (req, res) => {
    try {
        const { rol, id_direccion } = req.params;
        let empresa = null;
        empresa = await pool.query("SELECT * FROM pac.pac_reformas_pac WHERE estado_autorizador = 'Iniciado' or estado_autorizador = 'Autorizado' ORDER BY id_proceso");
        return res.json(empresa.rows);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_procesos_a_replanificar/:estado', async (req, res) => {
    try {
        const { estado } = req.params;
        empresa = await pool.query("SELECT * FROM pac.pac_replanificacion_procesos WHERE estado_solicitud = $1 ORDER BY id_replanificacion", [estado]);
        return res.json(empresa.rows);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_replanificacion/:id_replanificacion', async (req, res) => {
    try {
        const { id_replanificacion } = req.params;
        empresa = await pool.query("SELECT * FROM pac.pac_replanificacion_procesos WHERE id_replanificacion = $1", [id_replanificacion]);
        return res.json(empresa.rows);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.post('/actualizarEstadoReplanificacion/', async (req, res) => {
    try {
        const { id_replanificacion, estado} = req.body;
        await pool.query('UPDATE pac.pac_replanificacion_procesos SET estado_solicitud = $1 WHERE id_replanificacion = $2', [estado, id_replanificacion ]);
        return res.status(200).json({ message: 'Replanificación actualizada con éxito' });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.post('/actualizarEmpresa', upload.single('imagen_empresa'), async (req, res) => {
    try {
      const { nombre_empresa, ruc_empresa, logo_empresa } = req.body;
      // Obtener el archivo PDF desde la solicitud
      const pdfData = req.file.buffer;
      // Insertar datos en la base de datos
      const query = 'UPDATE pac.pac_empresa SET nombre_empresa = $1, logo_empresa = $2, ruc_empresa = $3, imagen_empresa = $4 WHERE id_empresa = 1';
      const values = [nombre_empresa, logo_empresa, ruc_empresa, pdfData];
      await pool.query(query, values);
      res.status(200).json({ message: 'Empresa actualizada con Éxito' });
    } catch (error) {
      console.error('Error al registrar empresa:', error);
      res.status(500).json({ message: 'Error al actualizar empresa' });
    }
});

app.post('/actualizarParametrosEmpresa/', async (req, res) => {
    try {
        const { mensaje_correo, dias_previos_de_publicacion, validar_presupuesto } = req.body;
        await pool.query('UPDATE pac.pac_empresa SET mensaje_correo = $1, dias_previos_de_publicacion = $2, validar_presupuesto = $3 WHERE id_empresa = 1', [mensaje_correo, dias_previos_de_publicacion, validar_presupuesto]);
        return res.status(200).json({ message: 'Empresa actualizada con éxito' });
    } catch (error) {
        console.error(error.stack);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});


app.post('/guardarEmpresa', upload.single('imagen_empresa'), async (req, res) => {
    try {
      const { nombre_empresa, ruc_empresa, logo_empresa } = req.body;
  
      // Obtener el archivo PDF desde la solicitud
      const pdfData = req.file.buffer;
  
      // Insertar datos en la base de datos
      const query = 'INSERT INTO pac.pac_empresa (id_empresa, nombre_empresa, logo_empresa, ruc_empresa, imagen_empresa) VALUES (1, $1, $2, $3, $4)';
      const values = [nombre_empresa, ruc_empresa, logo_empresa, pdfData];
  
      await pool.query(query, values);
      res.status(200).json({ message: 'Empresa enviada con Éxito' });
    } catch (error) {
      console.error('Error al registrar empresa:', error);
      res.status(500).json({ message: 'Error al registrar empresa' });
    }
});

app.get('/obtener_cpc/', async (req, res) => {
    try {
        const nro_cpc = await pool.query('SELECT count(*) FROM pac.pac_cpc');
        if (nro_cpc.rows.length === 0) {
            return res.status(404).json({ message: 'No existen datos' });
        }
        try {
            const cpc = await pool.query('SELECT cp_codigo as index, cp_descripcion as opcion FROM pac.pac_cpc');
            return res.json(cpc.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtenerReformas/:estado/:valor/:user', async (req, res) => {
    try {
        const { estado, valor, user } = req.params;
        console.log(estado);
        console.log(valor);
        const nro_reformas = await pool.query('SELECT count(*) FROM pac.pac_reformas_pac');
        if (nro_reformas.rows.length === 0) {
            return res.status(404).json({ message: 'No existen datos' });
        }
        try {
            if(estado === 'estado_revisor'){
                const reformas = await pool.query('SELECT * FROM pac.pac_reformas_pac WHERE estado_revisor = $1 and usr_creacion= $2 ORDER BY id_proceso', [valor, user]);
                return res.json(reformas.rows);
            }
            if(estado === 'estado_aprobador'){
                const reformas = await pool.query('SELECT * FROM pac.pac_reformas_pac WHERE estado_aprobador = $1 and usr_creacion= $2 ORDER BY id_proceso', [valor, user]);
                return res.json(reformas.rows);
            }
            if(estado === 'estado_consolidador'){
                const reformas = await pool.query('SELECT * FROM pac.pac_reformas_pac WHERE estado_consolidador = $1 and usr_creacion= $2 ORDER BY id_proceso', [valor, user]);
                return res.json(reformas.rows);
            }
            if(estado === 'estado_autorizador'){
                const reformas = await pool.query('SELECT * FROM pac.pac_reformas_pac WHERE estado_autorizador = $1 and usr_creacion= $2 ORDER BY id_proceso', [valor, user]);
                return res.json(reformas.rows);
            }    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_fase_preparatoria/:fase_preparatoria/:catalogo_electronico/:departamento/:rol/:correo', async (req, res) => {
    try {
        const { fase_preparatoria, catalogo_electronico, departamento, rol, correo } = req.params;
        if(rol=='Administrador'){
            const reformas = await pool.query('SELECT * FROM pac.pac_procesos WHERE estado_fase_preparatoria = $1 and catalogo_electronico = $2 and eliminado = $3', [fase_preparatoria, catalogo_electronico, 'NO']);
            return res.json(reformas.rows);
        }
        if(rol=='Elaborador'){
            const reformas = await pool.query('SELECT * FROM pac.pac_procesos WHERE estado_fase_preparatoria = $1 and catalogo_electronico = $2 and eliminado = $3 and funcionario_responsable = $4', [fase_preparatoria, catalogo_electronico, 'NO', correo]);
            return res.json(reformas.rows);
        }
        const reformas = await pool.query('SELECT * FROM pac.pac_procesos WHERE estado_fase_preparatoria = $1 and catalogo_electronico = $2 and eliminado = $3 and id_departamento = $4', [fase_preparatoria, catalogo_electronico, 'NO', departamento]);
        return res.json(reformas.rows);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_procesos_desiertos/', async (req, res) => {
    try {
        const reformas = await pool.query('SELECT * FROM pac.pac_procesos WHERE estado_fase_preparatoria = $1 and eliminado = $2', ['PUBLICADO - DESIERTO', 'NO']);
        return res.json(reformas.rows);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

app.get('/obtener_fase_preparatoria_infimas/:fase_preparatoria/:departamento/:rol/:correo', async (req, res) => {
    try {
        const { fase_preparatoria, departamento, rol, correo } = req.params;
        if (rol === 'Administrador') {
            const reformas = await pool.query('SELECT ROW_NUMBER() OVER (ORDER BY a.id_infima) AS row_number, a.*, d.nombre_direccion FROM pac.pac_infimas_cuantias a LEFT JOIN pac.pac_direcciones d ON a.id_direccion = d.id_direccion WHERE a.estado = $1 ORDER BY id_infima', [fase_preparatoria]);
            return res.json(reformas.rows);
        }
        if (rol === 'Elaborador') {
            const reformas = await pool.query('SELECT ROW_NUMBER() OVER (ORDER BY a.id_infima) AS row_number, a.*, d.nombre_direccion FROM pac.pac_infimas_cuantias a LEFT JOIN pac.pac_direcciones d ON a.id_direccion = d.id_direccion WHERE a.estado = $1 AND a.funcionario_responsable = $2 ORDER BY id_infima', [fase_preparatoria, correo]);
            return res.json(reformas.rows);
        }
        const reformas = await pool.query('SELECT ROW_NUMBER() OVER (ORDER BY a.id_infima) AS row_number, a.*, d.nombre_direccion FROM pac.pac_infimas_cuantias a LEFT JOIN pac.pac_direcciones d ON a.id_direccion = d.id_direccion WHERE a.estado = $1 AND a.id_departamento = $2 ORDER BY id_infima', [fase_preparatoria, departamento]);
        return res.json(reformas.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor: ' + error });
    }
});

app.get('/obtener_fases/:tipo_compra', async (req, res) => {
    try {
        const { tipo_compra } = req.params;
        const query = 'SELECT DISTINCT fase_preparatoria FROM pac.pac_doc_generales WHERE tipo_compra = $1';
        const cpc = await pool.query(query, [tipo_compra]);
        const fases = ['Elaboración de documentos', ...cpc.rows.map(row => row.fase_preparatoria)];
        
        return res.json(fases);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor: ' + error });
    }
});


app.get('/obtener_Unidades/', async (req, res) => {
    try {
        try {
            const cpc = await pool.query('SELECT * FROM pac.pac_unidades ORDER BY id ASC ');
            return res.json(cpc.rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
    }
});

// Ruta para subir archivos a carpetas en el servidor
app.post('/subirArchivoProceso', uploadToFolderProceso.single('pdf'), (req, res) => {
    // Lógica para guardar en carpeta en el servidor
    res.send('Archivo PDF subido a la carpeta del proceso exitosamente');
});

// Ruta para subir archivos a carpetas en el servidor
app.post('/subirArchivoInfima', uploadToFolderInfima.single('pdf'), (req, res) => {
    // Lógica para guardar en carpeta en el servidor
    res.send('Archivo PDF subido a la carpeta del proceso exitosamente');
});


app.post('/uploadProceso', uploadToFolderProceso.array('archivos'), (req, res) => {
    res.send('Archivos subidos exitosamente');
});

app.post('/uploadInfima', uploadToFolderInfima.array('archivos'), (req, res) => {
    res.send('Archivos subidos exitosamente');
});

app.get('/procesos/:pac_fase_preparatoria_pk', (req, res) => {
    const directorioArchivos = path.join(uploadsDirectoryProceso, req.params.pac_fase_preparatoria_pk);
    
    // Verificar si el directorio existe
    if (!fs.existsSync(directorioArchivos)) {
        console.error('El directorio de archivos no existe.');
        //res.status(404).send('El directorio de archivos no existe');
        return;
    }
    
    // Si el directorio existe, leer los archivos
    fs.readdir(directorioArchivos, (err, archivos) => {
      if (err) {
        console.error('Error al leer el directorio de archivos:', err);
        res.status(500).send('Error interno del servidor');
      } else {
        res.json(archivos);
      }
    });
});

app.get('/infimas/:id_infima', (req, res) => {
    const directorioArchivos = path.join(uploadsDirectoryInfima, req.params.id_infima);
    
    // Verificar si el directorio existe
    if (!fs.existsSync(directorioArchivos)) {
        console.error('El directorio de archivos no existe.');
        //res.status(404).send('El directorio de archivos no existe');
        return;
    }
    
    // Si el directorio existe, leer los archivos
    fs.readdir(directorioArchivos, (err, archivos) => {
      if (err) {
        console.error('Error al leer el directorio de archivos:', err);
        res.status(500).send('Error interno del servidor');
      } else {
        res.json(archivos);
      }
    });
});


app.listen(5000, () => {
    console.log('Servidor en ejecución en el puerto 5000');
    console.log(currentDirectory);
});
