const { Op, literal } = require('sequelize');
const { Master, City, District, MasterExpertise, Assignment, Earning, Request } = require('../../models');
const { success, error } = require('../../utils/response');
const { paginate, paginatedResponse } = require('../../utils/pagination');

const SORT_OPTIONS = {
  newest:               ['created_at',    'DESC'],
  oldest:               ['created_at',    'ASC'],
  jobs_desc:            ['completedCount','DESC'],
  jobs_asc:             ['completedCount','ASC'],
  cancelled_desc:       ['cancelledCount','DESC'],
  monthly_avg_desc:     ['monthlyAvg',    'DESC'],
  monthly_avg_asc:      ['monthlyAvg',    'ASC'],
  total_earning_desc:   ['totalEarning',  'DESC'],
  completion_rate_desc: ['completionRate','DESC'],
  active_days_desc:     ['activeDays',    'DESC'],
};

const SQ = {
  completed: `(
    SELECT COUNT(*) FROM assignments
    WHERE assignments.master_id = Master.id
    AND   assignments.status = 'completed'
  )`,
  cancelled: `(
    SELECT COUNT(*) FROM assignments
    WHERE assignments.master_id = Master.id
    AND   assignments.status = 'cancelled'
  )`,
  activeAssignment: `(
    SELECT COUNT(*) FROM assignments
    WHERE assignments.master_id = Master.id
    AND   assignments.status = 'active'
  )`,
  monthlyAvg: `(
    SELECT COALESCE(
      SUM(net_amount) / GREATEST(TIMESTAMPDIFF(MONTH, Master.created_at, NOW()), 1),
      0
    )
    FROM earnings
    WHERE earnings.master_id = Master.id
  )`,
  totalEarning: `(
    SELECT COALESCE(SUM(net_amount), 0)
    FROM earnings
    WHERE earnings.master_id = Master.id
  )`,
  hasEarning: `(
    SELECT COUNT(*) FROM earnings
    WHERE earnings.master_id = Master.id
  )`,
  completionRate: `(
    SELECT CASE
      WHEN (
        SELECT COUNT(*) FROM assignments
        WHERE assignments.master_id = Master.id
        AND   assignments.status IN ('completed','cancelled')
      ) = 0 THEN 0
      ELSE ROUND(
        (SELECT COUNT(*) FROM assignments
         WHERE assignments.master_id = Master.id
         AND   assignments.status = 'completed') * 100.0 /
        (SELECT COUNT(*) FROM assignments
         WHERE assignments.master_id = Master.id
         AND   assignments.status IN ('completed','cancelled'))
      , 1)
    END
  )`,
  activeDays: `(DATEDIFF(NOW(), Master.created_at))`,
};

exports.list = async (req, res, next) => {
  try {
    const { limit, offset, page } = paginate(req.query);
    const {
      status, city_id, search, expertise_id,
      registered_by, date_from, date_to,
      sort                  = 'newest',
      job_count_min,
      job_count_max,
      cancelled_min,
      has_earnings,
      total_earning_min,
      has_active_assignment,
      completion_rate_min,
      active_days_min,
      active_days_max,
    } = req.query;

    const where = {};
    if (status)        where.status        = status;
    if (city_id)       where.city_id       = city_id;
    if (expertise_id)  where.expertise_id  = expertise_id;
    if (registered_by) where.registered_by = registered_by;

    if (search) {
      where[Op.or] = [
        { name:    { [Op.like]: `%${search}%` } },
        { surname: { [Op.like]: `%${search}%` } },
        { phone:   { [Op.like]: `%${search}%` } },
      ];
    }

    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = new Date(date_from);
      if (date_to) {
        const end = new Date(date_to);
        end.setHours(23, 59, 59);
        where.created_at[Op.lte] = end;
      }
    }

    const and = [];

    if (job_count_min)
      and.push(literal(`${SQ.completed} >= ${parseInt(job_count_min)}`));
    if (job_count_max)
      and.push(literal(`${SQ.completed} <= ${parseInt(job_count_max)}`));
    if (cancelled_min)
      and.push(literal(`${SQ.cancelled} >= ${parseInt(cancelled_min)}`));
    if (has_earnings === 'yes')
      and.push(literal(`${SQ.hasEarning} > 0`));
    if (has_earnings === 'no')
      and.push(literal(`${SQ.hasEarning} = 0`));
    if (total_earning_min)
      and.push(literal(`${SQ.totalEarning} >= ${parseFloat(total_earning_min)}`));
    if (has_active_assignment === 'yes')
      and.push(literal(`${SQ.activeAssignment} > 0`));
    if (has_active_assignment === 'no')
      and.push(literal(`${SQ.activeAssignment} = 0`));
    if (completion_rate_min)
      and.push(literal(`${SQ.completionRate} >= ${parseFloat(completion_rate_min)}`));
    if (active_days_min)
      and.push(literal(`${SQ.activeDays} >= ${parseInt(active_days_min)}`));
    if (active_days_max)
      and.push(literal(`${SQ.activeDays} <= ${parseInt(active_days_max)}`));

    if (and.length) where[Op.and] = and;

    const sortDef = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;
    const isSubSort = ['completedCount','cancelledCount','monthlyAvg','totalEarning','completionRate','activeDays'].includes(sortDef[0]);
    const order = isSubSort
      ? [[literal(sortDef[0]), sortDef[1]]]
      : [[sortDef[0], sortDef[1]]];

    const { count, rows } = await Master.findAndCountAll({
      where,
      attributes: {
        include: [
          [literal(SQ.completed),        'completedCount'],
          [literal(SQ.cancelled),        'cancelledCount'],
          [literal(SQ.monthlyAvg),       'monthlyAvg'],
          [literal(SQ.totalEarning),     'totalEarning'],
          [literal(SQ.completionRate),   'completionRate'],
          [literal(SQ.activeDays),       'activeDays'],
          [literal(SQ.activeAssignment), 'activeAssignmentCount'],
        ],
      },
      include: [
        { model: City,            attributes: ['id', 'name'] },
        { model: District,        attributes: ['id', 'name'] },
        { model: MasterExpertise, as: 'expertise', attributes: ['id', 'name'] },
      ],
      order,
      limit,
      offset,
      subQuery: false,
    });

    success(res, paginatedResponse(rows, count, page, limit));
  } catch (err) { next(err); }
};

exports.applications = async (req, res, next) => {
  try {
    const { limit, offset, page } = paginate(req.query);
    const { count, rows } = await Master.findAndCountAll({
      where: { status: 'pending' },
      include: [
        { model: City,            attributes: ['id', 'name'] },
        { model: MasterExpertise, as: 'expertise', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });
    success(res, paginatedResponse(rows, count, page, limit));
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const master = await Master.findByPk(req.params.id, {
      include: [
        { model: City,            attributes: ['id', 'name'] },
        { model: District,        attributes: ['id', 'name'] },
        { model: MasterExpertise, as: 'expertise', attributes: ['id', 'name'] },
      ],
    });
    if (!master) return error(res, 'Usta bulunamadı', 404);

    // ── Paralel sorgular ──────────────────────────────────────────────────────
    const [
      completedCount,
      cancelledCount,
      activeAssignmentCount,
      totalEarning,
      pendingEarning,
      rawAssignments,
    ] = await Promise.all([
      Assignment.count({ where: { master_id: master.id, status: 'completed' } }),
      Assignment.count({ where: { master_id: master.id, status: 'cancelled' } }),
      Assignment.count({ where: { master_id: master.id, status: 'active' } }),
      Earning.sum('net_amount', { where: { master_id: master.id } }),
      Earning.sum('net_amount', { where: { master_id: master.id, status: 'pending' } }),
      // assigned_at kullan — created_at yok assignments tablosunda
      Assignment.findAll({
        where: { master_id: master.id },
        order: [['assigned_at', 'DESC']],
        limit: 10,
      }),
    ]);

    // ── Son işlere Request ve Earning ekle ────────────────────────────────────
    const requestIds = [...new Set(rawAssignments.map((a) => a.request_id).filter(Boolean))];
    const requestMap = {};
    const earningMap = {};

    const assignmentIds = rawAssignments.map((a) => a.id);

    if (requestIds.length > 0) {
      const [requests, earnings] = await Promise.all([
        Request.findAll({
          where:      { id: requestIds },
          attributes: ['id', 'brand', 'model', 'year', 'city_id'],
          include:    [{ model: City, attributes: ['id', 'name'] }],
        }),
        Earning.findAll({
          where:      { assignment_id: assignmentIds },
          attributes: ['id', 'assignment_id', 'net_amount', 'status'],
        }),
      ]);

      requests.forEach((r) => { requestMap[r.id] = r.toJSON(); });
      // assignment_id üzerinden map et
      earnings.forEach((e) => { earningMap[e.assignment_id] = e.toJSON(); });
    }

    const recentAssignments = rawAssignments.map((a) => ({
      ...a.toJSON(),
      Request: requestMap[a.request_id] || null,
      Earning: earningMap[a.id] || null,
    }));

    // ── Hesaplanan alanlar ────────────────────────────────────────────────────
    const totalFinished  = completedCount + cancelledCount;
    const completionRate = totalFinished > 0
      ? Math.round((completedCount / totalFinished) * 1000) / 10
      : 0;

    const activeDays = Math.floor(
      (Date.now() - new Date(master.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    const monthlyAvg = activeDays > 0
      ? Math.round((totalEarning || 0) / Math.max(activeDays / 30, 1))
      : 0;

    success(res, {
      ...master.toJSON(),
      completedCount,
      cancelledCount,
      activeAssignmentCount,
      completionRate,
      activeDays,
      monthlyAvg,
      totalEarning:      totalEarning  || 0,
      pendingEarning:    pendingEarning || 0,
      recentAssignments,
    });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, surname, phone } = req.body;
    if (!name || !surname || !phone) return error(res, 'Ad, soyad ve telefon zorunludur', 400);
    const exists = await Master.findOne({ where: { phone } });
    if (exists) return error(res, 'Bu telefon zaten kayıtlı', 409);
    const master = await Master.create({ ...req.body, status: 'active', registered_by: 'admin' });
    success(res, master, 'Usta oluşturuldu', 201);
  } catch (err) { next(err); }
};

exports.approve = async (req, res, next) => {
  try {
    const master = await Master.findByPk(req.params.id);
    if (!master) return error(res, 'Usta bulunamadı', 404);
    await master.update({ status: 'active' });
    success(res, null, 'Usta onaylandı');
  } catch (err) { next(err); }
};

exports.reject = async (req, res, next) => {
  try {
    const master = await Master.findByPk(req.params.id);
    if (!master) return error(res, 'Usta bulunamadı', 404);
    await master.update({ status: 'rejected' });
    success(res, null, 'Başvuru reddedildi');
  } catch (err) { next(err); }
};

exports.deactivate = async (req, res, next) => {
  try {
    const master = await Master.findByPk(req.params.id);
    if (!master) return error(res, 'Usta bulunamadı', 404);
    await master.update({ status: 'passive' });
    success(res, null, 'Usta pasife alındı');
  } catch (err) { next(err); }
};

exports.activate = async (req, res, next) => {
  try {
    const master = await Master.findByPk(req.params.id);
    if (!master) return error(res, 'Usta bulunamadı', 404);
    await master.update({ status: 'active' });
    success(res, null, 'Usta aktif edildi');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const master = await Master.findByPk(req.params.id);
    if (!master) return error(res, 'Usta bulunamadı', 404);
    await master.update({ status: 'deleted' });
    success(res, null, 'Usta sistemden kaldırıldı');
  } catch (err) { next(err); }
};

exports.markPaid = async (req, res, next) => {
  try {
    await Earning.update(
      { status: 'paid', paid_at: new Date(), paid_by: req.user.id },
      { where: { master_id: req.params.id, status: 'pending' } }
    );
    success(res, null, 'Ödeme yapıldı olarak işaretlendi');
  } catch (err) { next(err); }
};