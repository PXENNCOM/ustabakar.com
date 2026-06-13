const path = require('path');
const { Assignment, Report, ReportAnswer, ReportPhoto, Earning, Setting, Request } = require('../../models');
const { success, error } = require('../../utils/response');

exports.submit = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { plate, chassis_no, brand, model, year, color, transmission, engine_cc, km, master_note, answers } = req.body;

    if (!plate) return error(res, 'Plaka zorunludur', 400);

    const assignment = await Assignment.findOne({
      where: { id: assignmentId, master_id: req.user.id, status: 'active' },
    });
    if (!assignment) return error(res, 'Aktif görev bulunamadı', 404);

    const existing = await Report.findOne({ where: { assignment_id: assignmentId } });
    if (existing) return error(res, 'Bu görev için rapor zaten gönderildi', 400);

    const minPhotos = 1;
    if (!req.files || req.files.length < minPhotos) {
      return error(res, `En az ${minPhotos} fotoğraf yüklenmelidir`, 400);
    }

    const report = await Report.create({
      assignment_id: assignmentId, plate, chassis_no, brand, model,
      year: year ? parseInt(year) : null, color, transmission,
      engine_cc: engine_cc ? parseInt(engine_cc) : null,
      km: km ? parseInt(km) : null, master_note,
    });

    if (answers) {
      const parsedAnswers = typeof answers === 'string' ? JSON.parse(answers) : answers;
      if (parsedAnswers.length) {
        await ReportAnswer.bulkCreate(parsedAnswers.map(a => ({
          report_id: report.id,
          question_id: a.question_id,
          selected_option_id: a.selected_option_id || null,
          open_text: a.open_text || null,
        })));
      }
    }

    await ReportPhoto.bulkCreate(req.files.map((f, i) => ({
      report_id: report.id,
      url: `/uploads/reports/${path.basename(f.path)}`,
      order_index: i,
    })));

    // Kazanç hesapla
    const commissionRateSetting = await Setting.findOne({ where: { key: 'commission_rate' } });
    const commissionRate = parseFloat(commissionRateSetting?.value || 20);
    const requestData = await Request.findByPk(assignment.request_id, { include: ['package'] });
    const grossAmount = parseFloat(requestData?.package?.price || 1500);
    const commissionAmount = (grossAmount * commissionRate) / 100;
    const netAmount = grossAmount - commissionAmount;

    await Earning.create({
      master_id: req.user.id, assignment_id: assignmentId,
      gross_amount: grossAmount, commission_rate: commissionRate,
      commission_amount: commissionAmount, net_amount: netAmount, status: 'pending',
    });

    await assignment.update({ status: 'completed', completed_at: new Date() });
    await Request.update({ status: 'completed' }, { where: { id: assignment.request_id } });

    success(res, { report_id: report.id }, 'Rapor başarıyla gönderildi');
  } catch (err) { next(err); }
};
