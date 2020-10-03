module.exports = (sequelize, DataTypes) => {
    return sequelize.define('channels', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		desc: DataTypes.TEXT,
        guild: DataTypes.STRING,
        channel: DataTypes.STRING
	}, {
		timestamps: false,
	});
}