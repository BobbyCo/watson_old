module.exports = (sequelize, DataTypes) => {
    return sequelize.define('reminders', {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
            autoincrement: true
        },
        channel_id: DataTypes.INTEGER,
        desc: DataTypes.TEXT,
        frequency: DataTypes.INTEGER
	}, {
		timestamps: false,
	});
}