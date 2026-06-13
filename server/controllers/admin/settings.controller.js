const { Setting, ReportCategory, ReportQuestion, QuestionOption, ServicePackage, PackageCategory, MasterExpertise } = require('../../models');
const { success, error } = require('../../utils/response');

exports.list = async (req, res, next) => {
  try {
    const settings = await Setting.findAll();
    const result = {};
    settings.forEach(s => result[s.key] = s.value);
    success(res, result);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { value } = req.body;
    const [setting] = await Setting.upsert({ key: req.params.key, value, updated_at: new Date() });
    success(res, setting);
  } catch (err) { next(err); }
};

// Rapor kategorileri
exports.listCategories = async (req, res, next) => {
  try {
    const cats = await ReportCategory.findAll({ order: [['order_index', 'ASC']] });
    success(res, cats);
  } catch (err) { next(err); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, order_index } = req.body;
    if (!name) return error(res, 'Kategori adı zorunlu', 400);
    const cat = await ReportCategory.create({ name, order_index: order_index || 0 });
    success(res, cat, 'Kategori oluşturuldu', 201);
  } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const cat = await ReportCategory.findByPk(req.params.id);
    if (!cat) return error(res, 'Kategori bulunamadı', 404);
    await cat.update(req.body);
    success(res, cat);
  } catch (err) { next(err); }
};

// Sorular
exports.listQuestions = async (req, res, next) => {
  try {
    const questions = await ReportQuestion.findAll({
      where: { category_id: req.params.categoryId },
      include: [{ model: QuestionOption, as: 'options', order: [['order_index', 'ASC']] }],
      order: [['order_index', 'ASC']],
    });
    success(res, questions);
  } catch (err) { next(err); }
};

exports.createQuestion = async (req, res, next) => {
  try {
    const { question_text, answer_type, order_index } = req.body;
    if (!question_text) return error(res, 'Soru metni zorunlu', 400);
    const q = await ReportQuestion.create({
      category_id: req.params.categoryId, question_text,
      answer_type: answer_type || 'open', order_index: order_index || 0,
    });
    success(res, q, 'Soru oluşturuldu', 201);
  } catch (err) { next(err); }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const q = await ReportQuestion.findByPk(req.params.id);
    if (!q) return error(res, 'Soru bulunamadı', 404);
    await q.update(req.body);
    success(res, q);
  } catch (err) { next(err); }
};

// Seçenekler
exports.listOptions = async (req, res, next) => {
  try {
    const opts = await QuestionOption.findAll({
      where: { question_id: req.params.questionId }, order: [['order_index', 'ASC']],
    });
    success(res, opts);
  } catch (err) { next(err); }
};

exports.createOption = async (req, res, next) => {
  try {
    const { option_text, order_index } = req.body;
    if (!option_text) return error(res, 'Seçenek metni zorunlu', 400);
    const opt = await QuestionOption.create({ question_id: req.params.questionId, option_text, order_index: order_index || 0 });
    success(res, opt, 'Seçenek oluşturuldu', 201);
  } catch (err) { next(err); }
};

exports.deleteOption = async (req, res, next) => {
  try {
    await QuestionOption.destroy({ where: { id: req.params.id } });
    success(res, null, 'Seçenek silindi');
  } catch (err) { next(err); }
};

// Servis paketleri
exports.listPackages = async (req, res, next) => {
  try {
    const pkgs = await ServicePackage.findAll({
      include: [{ model: PackageCategory, as: 'categories', include: [{ model: ReportCategory, as: 'category' }] }],
      order: [['order_index', 'ASC']],
    });
    success(res, pkgs);
  } catch (err) { next(err); }
};

exports.createPackage = async (req, res, next) => {
  try {
    const { name, description, price, category_ids, order_index } = req.body;
    if (!name || !price) return error(res, 'Paket adı ve fiyat zorunlu', 400);
    const pkg = await ServicePackage.create({ name, description, price, order_index: order_index || 0 });
    if (category_ids && category_ids.length) {
      await PackageCategory.bulkCreate(category_ids.map(id => ({ package_id: pkg.id, category_id: id })));
    }
    success(res, pkg, 'Paket oluşturuldu', 201);
  } catch (err) { next(err); }
};

exports.updatePackage = async (req, res, next) => {
  try {
    const pkg = await ServicePackage.findByPk(req.params.id);
    if (!pkg) return error(res, 'Paket bulunamadı', 404);
    const { category_ids, ...rest } = req.body;
    await pkg.update(rest);
    if (category_ids) {
      await PackageCategory.destroy({ where: { package_id: pkg.id } });
      await PackageCategory.bulkCreate(category_ids.map(id => ({ package_id: pkg.id, category_id: id })));
    }
    success(res, pkg);
  } catch (err) { next(err); }
};

// Uzmanlık alanları
exports.listExpertises = async (req, res, next) => {
  try {
    const list = await MasterExpertise.findAll({ order: [['order_index', 'ASC']] });
    success(res, list);
  } catch (err) { next(err); }
};

exports.createExpertise = async (req, res, next) => {
  try {
    const { name, order_index } = req.body;
    if (!name) return error(res, 'Uzmanlık adı zorunlu', 400);
    const exp = await MasterExpertise.create({ name, order_index: order_index || 0 });
    success(res, exp, 'Uzmanlık alanı oluşturuldu', 201);
  } catch (err) { next(err); }
};

exports.updateExpertise = async (req, res, next) => {
  try {
    const exp = await MasterExpertise.findByPk(req.params.id);
    if (!exp) return error(res, 'Bulunamadı', 404);
    await exp.update(req.body);
    success(res, exp);
  } catch (err) { next(err); }
};

// ── Araç Yönetimi ─────────────────────────────────────────────────────────
const { sequelize } = require('../../models');

exports.listBrands = async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = search ? `WHERE adi LIKE '%${search}%'` : '';
    const [brands] = await sequelize.query(
      `SELECT id, marka_kodu, adi FROM arac_markalar ${where} ORDER BY adi ASC`
    );
    success(res, brands);
  } catch (err) { next(err); }
};

exports.createBrand = async (req, res, next) => {
  try {
    const { adi } = req.body;
    if (!adi) return error(res, 'Marka adı zorunludur', 400);
    const [[{ max_kod }]] = await sequelize.query('SELECT MAX(marka_kodu) as max_kod FROM arac_markalar');
    const yeni_kod = (max_kod || 0) + 1;
    await sequelize.query(
      'INSERT INTO arac_markalar (marka_kodu, adi) VALUES (?, ?)',
      { replacements: [yeni_kod, adi.toUpperCase()] }
    );
    success(res, { marka_kodu: yeni_kod }, 'Marka eklendi', 201);
  } catch (err) { next(err); }
};

exports.updateBrand = async (req, res, next) => {
  try {
    const { adi } = req.body;
    await sequelize.query(
      'UPDATE arac_markalar SET adi = ? WHERE id = ?',
      { replacements: [adi.toUpperCase(), req.params.id] }
    );
    success(res, null, 'Marka güncellendi');
  } catch (err) { next(err); }
};

exports.listModels = async (req, res, next) => {
  try {
    const [models] = await sequelize.query(
      'SELECT id, model_kodu, adi FROM arac_modeller WHERE marka_kodu = ? ORDER BY adi ASC',
      { replacements: [req.params.markaKodu] }
    );
    success(res, models);
  } catch (err) { next(err); }
};

exports.createModel = async (req, res, next) => {
  try {
    const { adi } = req.body;
    if (!adi) return error(res, 'Model adı zorunludur', 400);
    const [[{ max_kod }]] = await sequelize.query('SELECT MAX(model_kodu) as max_kod FROM arac_modeller');
    const yeni_kod = (max_kod || 0) + 1;
    await sequelize.query(
      'INSERT INTO arac_modeller (model_kodu, marka_kodu, adi) VALUES (?, ?, ?)',
      { replacements: [yeni_kod, req.params.markaKodu, adi.toUpperCase()] }
    );
    success(res, { model_kodu: yeni_kod }, 'Model eklendi', 201);
  } catch (err) { next(err); }
};

exports.updateModel = async (req, res, next) => {
  try {
    const { adi } = req.body;
    await sequelize.query(
      'UPDATE arac_modeller SET adi = ? WHERE id = ?',
      { replacements: [adi.toUpperCase(), req.params.id] }
    );
    success(res, null, 'Model güncellendi');
  } catch (err) { next(err); }
};

exports.listYears = async (req, res, next) => {
  try {
    const [years] = await sequelize.query(
      'SELECT id, adi FROM arac_model_yillari WHERE model_kodu = ? ORDER BY adi DESC',
      { replacements: [req.params.modelKodu] }
    );
    success(res, years);
  } catch (err) { next(err); }
};

exports.createYear = async (req, res, next) => {
  try {
    const { adi } = req.body;
    if (!adi) return error(res, 'Yıl zorunludur', 400);
    await sequelize.query(
      'INSERT INTO arac_model_yillari (model_kodu, adi) VALUES (?, ?)',
      { replacements: [req.params.modelKodu, adi] }
    );
    success(res, null, 'Yıl eklendi', 201);
  } catch (err) { next(err); }
};

exports.deleteYear = async (req, res, next) => {
  try {
    await sequelize.query('DELETE FROM arac_model_yillari WHERE id = ?', { replacements: [req.params.id] });
    success(res, null, 'Yıl silindi');
  } catch (err) { next(err); }
};