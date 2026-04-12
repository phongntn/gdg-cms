const filterFields = (data, deniedFields) => {
  if (Array.isArray(data)) {
    return data.map(item => filterFields(item, deniedFields));
  }

  if (!data || typeof data !== "object") {
    return data;
  }

  if (typeof data.toObject === "function") {
    data = data.toObject();
  }

  const filtered = { ...data };
  deniedFields.forEach(field => {
    delete filtered[field];
  });

  return filtered;
};

const restrictedResponse = (deniedFieldsByRole) => {
  return (req, res, next) => {

    const originalJson = res.json.bind(res);

    res.json = (data) => {
      const role = req.user?.role;
      const deniedFields = deniedFieldsByRole[role] || [];

      console.log("role:", role);
      console.log("deniedFields:", deniedFields);

      const filteredData = filterFields(data, deniedFields);

      console.log("filteredData:", filteredData);

      return originalJson(filteredData);
    };

    next();
  };
};

module.exports = restrictedResponse;