const userPermissions = {
    create: {
        Admin: [],
        Leader: [],
        Member: ["role", "specialty", "major"]
    },
    edit: {
        Admin: [],
        Leader: [],
        Member: ["role", "specialty", "major"]
    }
};

module.exports = userPermissions;