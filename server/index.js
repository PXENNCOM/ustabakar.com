require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

sequelize.authenticate()
  .then(() => {
    console.log('DB bağlantısı başarılı.');
    app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor.`));
  })
  .catch(err => {
    console.error('DB bağlantı hatası:', err);
    process.exit(1);
  });
