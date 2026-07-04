const { Op, literal } = require('sequelize');
const {
  Request, Customer, Payment, Assignment,
  Master, City, ServicePackage, RequestPhoto, Report,
} = require('../../models');
const { success, error } = require('../../utils/response');
const { paginate, paginatedResponse } = require('../../utils/pagination');

const SORT_OPTIONS = {
  newest:        ['created_at',       'DESC'],
  oldest:        ['created_at',       'ASC'],
  updated:       ['updated_at',       'DESC'],
  amount_desc:   ['$Payment.amount$', 'DESC'],
  amount_asc:    ['$Payment.amount$', 'ASC'],
};

const SQ = {
  hasAssignment: `(
    SELECT COUNT(*) FROM assignments
    WHERE assignments.request_id = Request.id
    AND   assignments.status = 'active'
  )`,
  hasReport: `(
    SELECT COUNT(*) FROM assignments a
    INNER JOIN reports r ON r.assignment_id = a.id
    WHERE a.request_id = Request.id
  )`,
  hasPhotos: `(
    SELECT COUNT(*) FROM request_photos
    WHERE request_photos.request_id = Request.id
  )`,
};

exports.list = async (req, res, next) => {
  try {
    const { limit, offset, page } = paginate(req.query);
    const {
      status, city_id, search, entry_type,
      date_from, date_to,
      sort             = 'newest',
      // paket
      package_id,
      // ödeme
      payment_status,
      payment_method,
      amount_min,
      amount_max,
      // araç
      brand,
      year_from,
      year_to,
      // satıcı
      seller_search,
      // usta
      master_id,
      assigned_by,
      // varlık kontrolleri
      has_photos,
      has_report,
      has_customer_note,
    } = req.query;

    // ── Temel WHERE ──────────────────────────────────────────────────────────
    const where = {};
    if (status)     where.status     = status;
    if (city_id)    where.city_id    = city_id;
    if (entry_type) where.entry_type = entry_type;
    if (package_id) where.package_id = package_id;
    if (brand)      where.brand      = { [Op.like]: `%${brand}%` };

    if (year_from || year_to) {
      where.year = {};
      if (year_from) where.year[Op.gte] = parseInt(year_from);
      if (year_to)   where.year[Op.lte] = parseInt(year_to);
    }

    if (has_customer_note === 'yes')
      where.customer_note = { [Op.not]: null, [Op.ne]: '' };
    if (has_customer_note === 'no')
      where[Op.or] = [{ customer_note: null }, { customer_note: '' }];

    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = new Date(date_from);
      if (date_to) {
        const end = new Date(date_to);
        end.setHours(23, 59, 59);
        where.created_at[Op.lte] = end;
      }
    }

    // Müşteri arama
    if (search) {
      where[Op.or] = [
        { '$Customer.name$':    { [Op.like]: `%${search}%` } },
        { '$Customer.surname$': { [Op.like]: `%${search}%` } },
        { '$Customer.phone$':   { [Op.like]: `%${search}%` } },
      ];
    }

    // Satıcı arama
    if (seller_search) {
      where[Op.and] = where[Op.and] || [];
      where[Op.and].push({
        [Op.or]: [
          { seller_name:  { [Op.like]: `%${seller_search}%` } },
          { seller_phone: { [Op.like]: `%${seller_search}%` } },
        ],
      });
    }

    // ── Ödeme filtreleri (Payment join üzerinden) ────────────────────────────
    const paymentWhere = {};
    if (payment_status) paymentWhere.status = payment_status;
    if (payment_method) paymentWhere.method = payment_method;
    if (amount_min)     paymentWhere.amount = { ...paymentWhere.amount, [Op.gte]: parseFloat(amount_min) };
    if (amount_max)     paymentWhere.amount = { ...paymentWhere.amount, [Op.lte]: parseFloat(amount_max) };

    // ── Assignment filtreleri ────────────────────────────────────────────────
    const assignmentWhere = {};
    if (master_id)   assignmentWhere.master_id   = master_id;
    if (assigned_by) assignmentWhere.assigned_by = assigned_by;

    // ── Subquery WHERE filtreleri ────────────────────────────────────────────
    const and = where[Op.and] || [];

    if (has_photos === 'yes') and.push(literal(`${SQ.hasPhotos} > 0`));
    if (has_photos === 'no')  and.push(literal(`${SQ.hasPhotos} = 0`));

    if (has_report === 'yes') and.push(literal(`${SQ.hasReport} > 0`));
    if (has_report === 'no')  and.push(literal(`${SQ.hasReport} = 0`));

    if (and.length) where[Op.and] = and;

    // ── Sıralama ─────────────────────────────────────────────────────────────
    const sortDef = SORT_OPTIONS[sort] || SORT_OPTIONS.newest;
    const order   = [sortDef];

    // ── Include yapısı ───────────────────────────────────────────────────────
    const include = [
      { model: Customer,       attributes: ['id', 'name', 'surname', 'phone'] },
      { model: City,           attributes: ['id', 'name'] },
      { model: ServicePackage, as: 'package', attributes: ['id', 'name', 'price'] },
      {
        model: Payment,
        attributes: ['id', 'amount', 'method', 'status'],
        where: Object.keys(paymentWhere).length ? paymentWhere : undefined,
        required: Object.keys(paymentWhere).length > 0,
      },
      {
        model: Assignment,
        required: (master_id || assigned_by) ? true : false,
        where: Object.keys(assignmentWhere).length ? assignmentWhere : undefined,
        include: [{ model: Master, attributes: ['id', 'name', 'surname'] }],
      },
    ];

    const { count, rows } = await Request.findAndCountAll({
      where,
      include,
      order,
      limit,
      offset,
      subQuery: false,
      distinct: true,
    });

    success(res, paginatedResponse(rows, count, page, limit));
  } catch (err) { next(err); }
};

exports.detail = async (req, res, next) => {
  try {
    const request = await Request.findByPk(req.params.id, {
      include: [
        { model: Customer,       attributes: { exclude: ['created_at', 'updated_at'] } },
        { model: City,           attributes: ['id', 'name'] },
        { model: Payment },
        { model: ServicePackage, as: 'package' },
        {
          model: Assignment,
          include: [
            { model: Master,  attributes: ['id', 'name', 'surname', 'phone'] },
            { model: Report },
          ],
        },
        { model: RequestPhoto, as: 'photos' },
      ],
    });

    if (!request) return error(res, 'Talep bulunamadı', 404);
    success(res, request);
  } catch (err) { next(err); }
};

exports.assignMaster = async (req, res, next) => {
  try {
    const { master_id } = req.body;
    const request = await Request.findByPk(req.params.id);
    if (!request) return error(res, 'Talep bulunamadı', 404);
    if (request.status !== 'pending_assignment')
      return error(res, 'Bu talep usta ataması için uygun değil', 400);

    const master = await Master.findByPk(master_id);
    if (!master || master.status !== 'active')
      return error(res, 'Geçerli bir usta seçin', 400);

    await Assignment.create({
      request_id:  request.id,
      master_id,
      assigned_by: req.user.id,
      status:      'active',
    });

    await request.update({ status: 'assigned' });
    success(res, null, 'Usta atandı');
  } catch (err) { next(err); }
};

exports.cancelAssignment = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const assignment = await Assignment.findOne({
      where: { request_id: req.params.id, status: 'active' },
    });
    if (!assignment) return error(res, 'Aktif görev bulunamadı', 404);

    await assignment.update({ status: 'cancelled', cancelled_reason: reason || null });
    await Request.update({ status: 'pending_assignment' }, { where: { id: req.params.id } });

    success(res, null, 'Görev iptal edildi');
  } catch (err) { next(err); }
};