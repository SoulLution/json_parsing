module.exports = function(req, res, next) {

	res.header("X-powered-by", "Blood, sweat, and tears")
	res.header('Cache-Control', 'no-cache');
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
	next();
}
