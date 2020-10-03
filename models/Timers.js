module.exports = (sequelize, DataTypes) => {
    return sequelize.define('timers', {
		  channel_id: {
        type: DataTypes.STRING,
        unique: true
      },
      type: DataTypes.STRING,
      name: DataTypes.STRING,
      timestamp: DataTypes.STRING,
      event: DataTypes.BOOLEAN,
      event_content: DataTypes.TEXT,
      event_channel: DataTypes.STRING
	}, {
		timestamps: false,
	});
}