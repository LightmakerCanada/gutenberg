const config = process.env.MOBILE ? require( './packages/react-native-editor/babel.config' ) : {
	presets: [ '@wordpress/babel-preset-default' ],
	plugins: [ 'babel-plugin-inline-json-import' ],
};
module.exports = function( api ) {
	api.cache( true );
	return config;
};