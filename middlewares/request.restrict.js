const restrictedRequest = (deniedFieldsByRole) => {
  return (req, res, next) => {
    const role = req.user?.role;
    const deniedFields = deniedFieldsByRole[role] || [];
    const bodyKeys = Object.keys(req.body);

    const forbidden = bodyKeys.filter(key => deniedFields.includes(key));

    if (forbidden.length > 0) {
      return res.status(403).json({
        message: `Fields restricted: ${forbidden.join(", ")}`
      });
    }

    next();
  };
};

module.exports = restrictedRequest;
