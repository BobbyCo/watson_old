module.exports = (sequelize, DataTypes) => {
    return sequelize.define('polls', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
        content: DataTypes.TEXT,
        num_options: DataTypes.INTEGER,
        data: DataTypes.TEXT
	}, {
		timestamps: false,
	});
}