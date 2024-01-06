const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors')


const app = express();
app.use(bodyParser.json(), cors());
app.options('*', cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'clonada',
    password: 'accit.2023',
    port: 5433,
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


        const { nombres, apellidos, correo, contrasena, departamento } = req.body;

        // Comprobar si el nombre de usuario ya existe
        const userExists = await pool.query('SELECT * FROM pac.pac_usuarios WHERE correo_usuario = $1', [correo]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        try {
            // Insertar el nuevo usuario en la base de datos
            await pool.query('INSERT INTO pac.pac_usuarios (nombres_usuario, apellidos_usuario, correo_usuario, contrasena_usuario, depar_usuario) VALUES ($1, $2, $3, $4, $5)', [nombres, apellidos, correo, hashedPassword, departamento]);
            return res.status(201).json({ message: 'Usuario registrado con éxito' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor:' + error });
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

app.get('/obtener_procesos/:correo', async (req, res) => {
    try {
        const { correo } = req.params;
        // Comprobar si el usuario tiene procesos
        const nro_procesos = await pool.query('SELECT COUNT(*) FROM pac.pac_procesos WHERE funcionario_responsable = $1', [correo]);
        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron procesos para su usuario' });
        }
        try {
            // Obtener los procesos del usuario
            const procesos = await pool.query("SELECT  ROW_NUMBER() OVER (ORDER BY a.id_proceso) AS row_number,a.* FROM pac.pac_procesos a,(SELECT b.ID_PROCESO id_proceso, MAX(b.VERSION_PROCESO) version_proceso FROM pac.pac_procesos b group by b.id_proceso) b WHERE funcionario_responsable = $1 and b.ID_PROCESO=a.ID_PROCESO and b.VERSION_PROCESO=a.VERSION_PROCESO and a.eliminado='NO' order by a.id_proceso asc", [correo]);
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
        const nro_procesos = await pool.query('SELECT * FROM pac.pac_procesos WHERE id_proceso = $1', [id_proceso]);

        if (nro_procesos.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontro el proceso' });
        }
        try {
            // Obtener los procesos del usuario
            const procesos = await pool.query('SELECT * FROM pac.pac_procesos WHERE id_proceso = $1', [id_proceso]);
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

app.get('/obtener_id_proceso/', async (req, res) => {
    try{
        const id_proceso = await pool.query('SELECT nextval(\'pac.pac_procesos_id_proceso_seq\')');
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

app.get('/obtenerPartidaPresupuestaria/:codigo_partida/:actividad', async (req, res) => {
    try {
        const { codigo_partida, actividad } = req.params;
        const partidas = await pool.query('SELECT * FROM pac.pac_partidas_presupuestarias WHERE codigo_partida = $1 and actividad = $2', [codigo_partida, actividad]);
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

app.listen(5000, () => {
    console.log('Servidor en ejecución en el puerto 5000');
});
