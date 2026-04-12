const postPermissions = {
    edit: {
        Admin: ["author", "vote"],
        Leader: ["author", "vote"],
        Member: ["author", "vote"]
    },
    create: {
        Admin: ["author", "vote"],
        Leader: ["author", "vote"],
        Member: ["author", "vote"]
    }
};

module.exports = postPermissions;