const router = require('express').Router();
const c = require('../../controllers/admin/settings.controller');

router.get('/', c.list);
router.put('/:key', c.update);

// Rapor kategorileri yönetimi
router.get('/report-categories', c.listCategories);
router.post('/report-categories', c.createCategory);
router.put('/report-categories/:id', c.updateCategory);

// Soru yönetimi
router.get('/report-categories/:categoryId/questions', c.listQuestions);
router.post('/report-categories/:categoryId/questions', c.createQuestion);
router.put('/questions/:id', c.updateQuestion);

// Seçenek yönetimi
router.get('/questions/:questionId/options', c.listOptions);
router.post('/questions/:questionId/options', c.createOption);
router.delete('/options/:id', c.deleteOption);

// Servis paketleri yönetimi
router.get('/packages', c.listPackages);
router.post('/packages', c.createPackage);
router.put('/packages/:id', c.updatePackage);

// Uzmanlık alanları yönetimi
router.get('/expertises', c.listExpertises);
router.post('/expertises', c.createExpertise);
router.put('/expertises/:id', c.updateExpertise);

// Araç yönetimi
router.get('/brands', c.listBrands);
router.post('/brands', c.createBrand);
router.put('/brands/:id', c.updateBrand);

router.get('/brands/:markaKodu/models', c.listModels);
router.post('/brands/:markaKodu/models', c.createModel);
router.put('/models/:id', c.updateModel);

router.get('/models/:modelKodu/years', c.listYears);
router.post('/models/:modelKodu/years', c.createYear);
router.delete('/years/:id', c.deleteYear);

module.exports = router;
