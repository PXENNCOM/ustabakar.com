const { City, District, ServicePackage, MasterExpertise } = require('../models');
const sequelize = require('../config/database');
const { success, error } = require('../utils/response');
const router = require('express').Router();

router.get('/cities', async (req, res, next) => {
  try {
    const cities = await City.findAll({ order: [['name', 'ASC']] });
    success(res, cities);
  } catch (err) { next(err); }
});

router.get('/cities/:cityId/districts', async (req, res, next) => {
  try {
    const districts = await District.findAll({
      where: { city_id: req.params.cityId },
      order: [['name', 'ASC']],
    });
    success(res, districts);
  } catch (err) { next(err); }
});

router.get('/packages', async (req, res, next) => {
  try {
    const { PackageCategory, ReportCategory } = require('../models');
    const packages = await ServicePackage.findAll({
      where: { is_active: true },
      include: [{
        model: PackageCategory,
        as: 'categories',
        include: [{ model: ReportCategory, as: 'category' }],
      }],
      order: [['order_index', 'ASC']],
    });
    success(res, packages);
  } catch (err) { next(err); }
});

router.get('/expertises', async (req, res, next) => {
  try {
    const list = await MasterExpertise.findAll({
      where: { is_active: true },
      order: [['order_index', 'ASC']],
    });
    success(res, list);
  } catch (err) { next(err); }
});


router.get('/report-categories', async (req, res, next) => {
  try {
    const { ReportCategory, ReportQuestion, QuestionOption, PackageCategory } = require('../models');
    const { package_id } = req.query;

    let categoryIds = null;
    if (package_id) {
      const pkgCats = await PackageCategory.findAll({ where: { package_id } });
      categoryIds = pkgCats.map((pc) => pc.category_id);
    }

    const where = { is_active: true };
    if (categoryIds) where.id = categoryIds;

    const cats = await ReportCategory.findAll({
      where,
      include: [{
        model: ReportQuestion,
        as: 'questions',
        where: { is_active: true },
        required: false,
        include: [{ model: QuestionOption, as: 'options' }],
        order: [['order_index', 'ASC']],
      }],
      order: [['order_index', 'ASC']],
    });
    success(res, cats);
  } catch (err) { next(err); }
});


router.get('/brands', async (req, res, next) => {
  try {
    const [brands] = await sequelize.query(
      'SELECT id, marka_kodu, adi FROM arac_markalar ORDER BY adi ASC'
    );
    success(res, brands);
  } catch (err) { next(err); }
});

router.get('/models/:markaKodu', async (req, res, next) => {
  try {
    const [models] = await sequelize.query(
      'SELECT id, model_kodu, adi FROM arac_modeller WHERE marka_kodu = ? ORDER BY adi ASC',
      { replacements: [req.params.markaKodu] }
    );
    success(res, models);
  } catch (err) { next(err); }
});

router.get('/years/:modelKodu', async (req, res, next) => {
  try {
    const [years] = await sequelize.query(
      'SELECT id, adi FROM arac_model_yillari WHERE model_kodu = ? ORDER BY adi DESC',
      { replacements: [req.params.modelKodu] }
    );
    success(res, years);
  } catch (err) { next(err); }
});

module.exports = router;