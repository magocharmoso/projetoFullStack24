const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ====== CONEXÃO MONGODB ======
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://jaismpbs_db_user:6ViyicakWK10L5Sy@taxisteste.xu0h1re.mongodb.net/?appName=TaxisTeste";

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Conectado ao MongoDB Atlas'))
  .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

// ====== SCHEMA TAXI ======
const taxiSchema = new mongoose.Schema({
  matricula: { type: String, required: true, unique: true },
  modelo: { type: String, required: true },
  disponivel: { type: Boolean, default: true },
  criadoEm: { type: Date, default: Date.now }
});

const Taxi = mongoose.model('Taxi', taxiSchema);

// ====== ROTAS CRUD ======

// GET - Listar todos os táxis
app.get('/taxis', async (req, res) => {
  try {
    const taxis = await Taxi.find();
    res.json(taxis);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST - Criar novo táxi
app.post('/taxis', async (req, res) => {
  try {
    const novoTaxi = new Taxi(req.body);
    await novoTaxi.save();
    res.status(201).json(novoTaxi);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// PUT - Atualizar um táxi
app.put('/taxis/:id', async (req, res) => {
  try {
    const taxi = await Taxi.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!taxi) return res.status(404).json({ erro: 'Táxi não encontrado' });
    res.json(taxi);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// DELETE - Apagar um táxi
app.delete('/taxis/:id', async (req, res) => {
  try {
    const taxi = await Taxi.findByIdAndDelete(req.params.id);
    if (!taxi) return res.status(404).json({ erro: 'Táxi não encontrado' });
    res.json({ mensagem: 'Táxi apagado com sucesso' });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.listen(3000, () => {
  console.log('');
  console.log('🚀 ========================');
  console.log('   MEAN Stack Online');
  console.log('========================');
  console.log('📱 Frontend:  http://localhost:4200');
  console.log('⚙️  Backend:   http://localhost:3000');
  console.log('🍃 Database: MongoDB Atlas');
  console.log('======================== 🚀');
  console.log('');
});
