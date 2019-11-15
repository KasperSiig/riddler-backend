module.exports = {
	mongodbMemoryServerOptions: {
		instance: {
			dbName: 'riddler',
			port: '0.0.0.0',
		},
		binary: {
			version: '4.0.3',
			skipMD5: true,
		},
		autoStart: false,
	},
};
