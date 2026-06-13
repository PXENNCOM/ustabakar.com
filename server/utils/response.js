const success = (res, data = null, message = 'Başarılı', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const error = (res, message = 'Bir hata oluştu', statusCode = 400, errors = null) => {
  return res.status(statusCode).json({ success: false, message, errors });
};

module.exports = { success, error };
