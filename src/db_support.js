const mongoose = require('mongoose');

const hijoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  run: { type: String, required: true },
  curso: { type: String, required: true },
  seccion: { type: String, required: true }
});

const padreSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  run: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: String,
  parentesco: { type: String, required: true }
});

const invitadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  run: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: String,
  parentesco: { type: String, required: true }
});

const familiaSchema = new mongoose.Schema({
  hijos: [hijoSchema],
  padres: [padreSchema],
  invitados: [invitadoSchema],
  fechaRegistro: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  photo: String,
  hijos: [hijoSchema],
  padres: [padreSchema],
  invitados: [invitadoSchema],
  fechaRegistro: { type: Date, default: Date.now },
  pagos: Object,
  correoEntradas: Object,
  estado_pago: Object,
  jornadasFiesta: Object,
  entradas_enviadas: Boolean,
  notificacion_enviada: Boolean,
  fecha_notificacion: Date,
  fecha_envio_entradas: Date
});

const deliverySchema = new mongoose.Schema({
  familia: String,
  nombre_completo: String, 
  bloques: Array, 
  serial: Number, 
  total: Number, 
  num_listado: Number, 
  curso: String, 
  jornada: String, 
  tipo: String,
  nombreArchivo: String,
  fecha_delivery: { type: Date, default: Date.now },
  hora_delivery: {
    type: String,
    default: () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }});

/// --------------------------------
const cursoSchema = new mongoose.Schema({
  id: String,
  estudiantesCurso: Object,      // e.g., "Básico", "Medio"
  listaCurso: Array,       // e.g., 1, 2, 3...
  prof_jefe: Array,
  numeroInvitados: Number,
  bloque: Object,
});

const pagosSchema = new mongoose.Schema({
  id: String,
  num_folio: Number,
  tipo: String,
  cuota_cpa: Boolean,
  monto: Number,
  cantidad_agendas: Number,
  entrega_agendas: Number,
  fecha: String,
  comentarios: String,
  entradas_pagadas: Number,
});

/// --------------------------------------
const registradosSchema = new mongoose.Schema({
  nombre: String,
  run: String,
  curso: String,
  seccion: String,
  tipo: String,
  parents: [String]
});

const cursoBloqueMapSchema = new mongoose.Schema({
  id: String,
  bloque: String,
  jornada: String,
  color: String
});

const registroEntradasSchema = new mongoose.Schema({
  id: String,
  registros: Object,
});

const password = encodeURIComponent(`${process.env.DB_PASSWORD}`);
const uri = `mongodb+srv://${process.env.DB_USER}:${password}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority&appName=${process.env.DB_NAME}`;

mongoose.connection.on('connected', () => {
  console.log('MongoDB conectado');
});

mongoose.connection.on('error', (err) => {
  console.error('Error en la conexión:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB desconectado');
});

async function connectToDB() {
  try {
    console.log(`uri: ${uri}`);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexión exitosa a MongoDB Atlas');
  } catch (err) {
    console.error('Error de conexión:', err);
  }
}

connectToDB();


//module.exports = mongoose.model('users', userSchema);

module.exports.usersDB = mongoose.model('users', userSchema);
//module.exports.listadoCursosDB = mongoose.model('listado_cursos', cursoSchema);
//module.exports.pagosDB = mongoose.model('pagos', pagosSchema);
//module.exports.cursoBloqueMap = mongoose.model('cursoBloqueMap', cursoBloqueMapSchema);
//module.exports.registroEntradasDB = mongoose.model('registro_entradas', registroEntradasSchema);
//module.exports.deliveryDB = mongoose.model('delivery_entradas', deliverySchema);

