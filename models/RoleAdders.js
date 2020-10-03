module.exports = (sequelize, DataTypes) => {
    return sequelize.define('role_adders', {
        post_id: DataTypes.STRING,
        emoji: DataTypes.STRING,
        role: DataTypes.STRING
	}, {
		timestamps: false,
	});
}