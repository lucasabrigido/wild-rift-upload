export default (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].indexOf(req.method.toUpperCase()) > -1) {
        res.set('Cache-Control', 'no-cache,no-store');
        res.set('Pragma', 'no-cache');
    }

    next();
};
