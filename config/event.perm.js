const eventPermissions = {
    view: {
        Member: ["notifyTo", "confirmed"]
    },
    edit: {
        Admin: ["author", "vote"],
        Leader: ["author", "vote"]
    },
    create: {
        Admin: ["author", "vote"],
        Leader: ["author", "vote"]
    }
};

module.exports = eventPermissions;