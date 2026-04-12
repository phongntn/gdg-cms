const eventPermissions = {
    view: {
        Member: ["notifyTo", "confirmed"]
    },
    edit: {
        Admin: ["author"],
        Leader: ["author"],
        Member: ["author"]
    },
    create: {
        Admin: ["author"],
        Leader: ["author"],
        Member: ["author"]
    }
};

module.exports = eventPermissions;