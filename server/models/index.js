const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING(100),
  email: { type: DataTypes.STRING(150), unique: true },
  password_hash: DataTypes.STRING(255),
  failed_login_attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  locked_until: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'admins', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

const City = sequelize.define('City', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING(100),
}, { tableName: 'cities', timestamps: false });

const District = sequelize.define('District', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  city_id: DataTypes.INTEGER,
  name: DataTypes.STRING(100),
}, { tableName: 'districts', timestamps: false });

const MasterExpertise = sequelize.define('MasterExpertise', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING(100),
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'master_expertises', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING(100),
  surname: DataTypes.STRING(100),
  phone: { type: DataTypes.STRING(20), unique: true },
  phone_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  city_id: { type: DataTypes.INTEGER, allowNull: true },
  status: { type: DataTypes.STRING(20), defaultValue: 'active' },
}, { tableName: 'customers', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

const Master = sequelize.define('Master', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING(100),
  surname: DataTypes.STRING(100),
  tc: { type: DataTypes.STRING(11), allowNull: true },
  phone: { type: DataTypes.STRING(20), unique: true },
  phone_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  city_id: { type: DataTypes.INTEGER, allowNull: true },
  district_id: { type: DataTypes.INTEGER, allowNull: true },
  expertise_id: { type: DataTypes.INTEGER, allowNull: true },
  equipment: { type: DataTypes.TEXT, allowNull: true },
  experience: { type: DataTypes.TEXT, allowNull: true },
  reference: { type: DataTypes.TEXT, allowNull: true },
  certificate_url: { type: DataTypes.STRING(500), allowNull: true },
  profile_photo_url: { type: DataTypes.STRING(500), allowNull: true },
  status: { type: DataTypes.STRING(20), defaultValue: 'pending' },
  registered_by: { type: DataTypes.STRING(20), defaultValue: 'app' },
}, { tableName: 'masters', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

const ServicePackage = sequelize.define('ServicePackage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING(150),
  description: { type: DataTypes.TEXT, allowNull: true },
  price: DataTypes.DECIMAL(10, 2),
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'service_packages', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

const PackageCategory = sequelize.define('PackageCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  package_id: DataTypes.INTEGER,
  category_id: DataTypes.INTEGER,
}, { tableName: 'package_categories', timestamps: false });

const Request = sequelize.define('Request', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_id: DataTypes.INTEGER,
  city_id: DataTypes.INTEGER,
  package_id: { type: DataTypes.INTEGER, allowNull: true },
  entry_type: DataTypes.STRING(10),
  listing_url: { type: DataTypes.STRING(1000), allowNull: true },
  brand: { type: DataTypes.STRING(100), allowNull: true },
  model: { type: DataTypes.STRING(100), allowNull: true },
  year: { type: DataTypes.INTEGER, allowNull: true },
  seller_district_id: { type: DataTypes.INTEGER, allowNull: true },
  seller_name: { type: DataTypes.STRING(200), allowNull: true },
  seller_phone: { type: DataTypes.STRING(20), allowNull: true },
  customer_note: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING(30), defaultValue: 'pending_payment' },
}, { tableName: 'requests', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

const RequestPhoto = sequelize.define('RequestPhoto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  request_id: DataTypes.INTEGER,
  url: DataTypes.STRING(500),
}, { tableName: 'request_photos', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  request_id: DataTypes.INTEGER,
  amount: DataTypes.DECIMAL(10, 2),
  method: DataTypes.STRING(20),
  status: { type: DataTypes.STRING(20), defaultValue: 'pending' },
  receipt_url: { type: DataTypes.STRING(500), allowNull: true },
  rejection_reason: { type: DataTypes.TEXT, allowNull: true },
  approved_by: { type: DataTypes.INTEGER, allowNull: true },
  paid_at: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'payments', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

const Assignment = sequelize.define('Assignment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  request_id: DataTypes.INTEGER,
  master_id: DataTypes.INTEGER,
  assigned_by: { type: DataTypes.INTEGER, allowNull: true },
  status: { type: DataTypes.STRING(20), defaultValue: 'active' },
  cancelled_reason: { type: DataTypes.TEXT, allowNull: true },
  assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  completed_at: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'assignments', timestamps: false });

const ReportCategory = sequelize.define('ReportCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING(150),
  order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'report_categories', timestamps: true, createdAt: 'created_at', updatedAt: false });

const ReportQuestion = sequelize.define('ReportQuestion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  category_id: DataTypes.INTEGER,
  question_text: DataTypes.TEXT,
  answer_type: { type: DataTypes.STRING(10), defaultValue: 'open' },
  order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'report_questions', timestamps: true, createdAt: 'created_at', updatedAt: false });

const QuestionOption = sequelize.define('QuestionOption', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  question_id: DataTypes.INTEGER,
  option_text: DataTypes.STRING(200),
  order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'question_options', timestamps: false });

const Report = sequelize.define('Report', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  assignment_id: DataTypes.INTEGER,
  plate: DataTypes.STRING(20),
  chassis_no: { type: DataTypes.STRING(50), allowNull: true },
  brand: { type: DataTypes.STRING(100), allowNull: true },
  model: { type: DataTypes.STRING(100), allowNull: true },
  year: { type: DataTypes.INTEGER, allowNull: true },
  color: { type: DataTypes.STRING(50), allowNull: true },
  transmission: { type: DataTypes.STRING(50), allowNull: true },
  engine_cc: { type: DataTypes.INTEGER, allowNull: true },
  km: { type: DataTypes.INTEGER, allowNull: true },
  master_note: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'reports', timestamps: true, createdAt: 'created_at', updatedAt: false });

const ReportAnswer = sequelize.define('ReportAnswer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  report_id: DataTypes.INTEGER,
  question_id: DataTypes.INTEGER,
  selected_option_id: { type: DataTypes.INTEGER, allowNull: true },
  open_text: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'report_answers', timestamps: false });

const ReportPhoto = sequelize.define('ReportPhoto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  report_id: DataTypes.INTEGER,
  url: DataTypes.STRING(500),
  order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'report_photos', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Earning = sequelize.define('Earning', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  master_id: DataTypes.INTEGER,
  assignment_id: DataTypes.INTEGER,
  gross_amount: DataTypes.DECIMAL(10, 2),
  commission_rate: DataTypes.DECIMAL(5, 2),
  commission_amount: DataTypes.DECIMAL(10, 2),
  net_amount: DataTypes.DECIMAL(10, 2),
  status: { type: DataTypes.STRING(20), defaultValue: 'pending' },
  paid_at: { type: DataTypes.DATE, allowNull: true },
  paid_by: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'earnings', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Ticket = sequelize.define('Ticket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sender_id: DataTypes.INTEGER,
  sender_type: DataTypes.STRING(20),
  message: DataTypes.TEXT,
  admin_note: { type: DataTypes.TEXT, allowNull: true },
  closed_by: { type: DataTypes.INTEGER, allowNull: true },
  status: { type: DataTypes.STRING(20), defaultValue: 'open' },
  closed_at: { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'tickets', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  receiver_id: DataTypes.INTEGER,
  receiver_type: DataTypes.STRING(20),
  title: DataTypes.STRING(200),
  body: DataTypes.TEXT,
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'notifications', timestamps: true, createdAt: 'created_at', updatedAt: false });

const SmsLog = sequelize.define('SmsLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  phone: DataTypes.STRING(20),
  message: DataTypes.TEXT,
  status: { type: DataTypes.STRING(20), defaultValue: 'sent' },
  sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'sms_logs', timestamps: false });

const Setting = sequelize.define('Setting', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  key: { type: DataTypes.STRING(100), unique: true },
  value: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'settings', timestamps: true, createdAt: false, updatedAt: 'updated_at' });

// İlişkiler
City.hasMany(District, { foreignKey: 'city_id' });
District.belongsTo(City, { foreignKey: 'city_id' });

City.hasMany(Customer, { foreignKey: 'city_id' });
Customer.belongsTo(City, { foreignKey: 'city_id' });

City.hasMany(Master, { foreignKey: 'city_id' });
Master.belongsTo(City, { foreignKey: 'city_id' });
District.hasMany(Master, { foreignKey: 'district_id' });
Master.belongsTo(District, { foreignKey: 'district_id' });
MasterExpertise.hasMany(Master, { foreignKey: 'expertise_id' });
Master.belongsTo(MasterExpertise, { foreignKey: 'expertise_id', as: 'expertise' });

Customer.hasMany(Request, { foreignKey: 'customer_id' });
Request.belongsTo(Customer, { foreignKey: 'customer_id' });
City.hasMany(Request, { foreignKey: 'city_id' });
Request.belongsTo(City, { foreignKey: 'city_id' });
ServicePackage.hasMany(Request, { foreignKey: 'package_id' });
Request.belongsTo(ServicePackage, { foreignKey: 'package_id', as: 'package' });

Request.hasMany(RequestPhoto, { foreignKey: 'request_id', as: 'photos' });
RequestPhoto.belongsTo(Request, { foreignKey: 'request_id' });

Request.hasOne(Payment, { foreignKey: 'request_id' });
Payment.belongsTo(Request, { foreignKey: 'request_id' });

Request.hasMany(Assignment, { foreignKey: 'request_id' });
Assignment.belongsTo(Request, { foreignKey: 'request_id' });
Master.hasMany(Assignment, { foreignKey: 'master_id' });
Assignment.belongsTo(Master, { foreignKey: 'master_id' });

Assignment.hasOne(Report, { foreignKey: 'assignment_id' });
Report.belongsTo(Assignment, { foreignKey: 'assignment_id' });

ReportCategory.hasMany(ReportQuestion, { foreignKey: 'category_id', as: 'questions' });
ReportQuestion.belongsTo(ReportCategory, { foreignKey: 'category_id', as: 'category' });

ReportQuestion.hasMany(QuestionOption, { foreignKey: 'question_id', as: 'options' });
QuestionOption.belongsTo(ReportQuestion, { foreignKey: 'question_id' });

Report.hasMany(ReportAnswer, { foreignKey: 'report_id', as: 'answers' });
ReportAnswer.belongsTo(Report, { foreignKey: 'report_id' });
ReportQuestion.hasMany(ReportAnswer, { foreignKey: 'question_id' });
ReportAnswer.belongsTo(ReportQuestion, { foreignKey: 'question_id', as: 'question' });
QuestionOption.hasMany(ReportAnswer, { foreignKey: 'selected_option_id' });
ReportAnswer.belongsTo(QuestionOption, { foreignKey: 'selected_option_id', as: 'selected_option' });

Report.hasMany(ReportPhoto, { foreignKey: 'report_id', as: 'photos' });
ReportPhoto.belongsTo(Report, { foreignKey: 'report_id' });

Master.hasMany(Earning, { foreignKey: 'master_id' });
Earning.belongsTo(Master, { foreignKey: 'master_id' });
Assignment.hasOne(Earning, { foreignKey: 'assignment_id' });
Earning.belongsTo(Assignment, { foreignKey: 'assignment_id' });

ServicePackage.hasMany(PackageCategory, { foreignKey: 'package_id', as: 'categories' });
PackageCategory.belongsTo(ServicePackage, { foreignKey: 'package_id' });
ReportCategory.hasMany(PackageCategory, { foreignKey: 'category_id' });
PackageCategory.belongsTo(ReportCategory, { foreignKey: 'category_id', as: 'category' });

module.exports = {
  sequelize,
  Admin, City, District, MasterExpertise,
  Customer, Master, ServicePackage, PackageCategory,
  Request, RequestPhoto, Payment, Assignment,
  ReportCategory, ReportQuestion, QuestionOption,
  Report, ReportAnswer, ReportPhoto,
  Earning, Ticket, Notification, SmsLog, Setting,
};
