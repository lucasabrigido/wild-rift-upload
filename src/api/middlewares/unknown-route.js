import { NotFoundError } from '../utils/errors';

export default function(req, res, next) {
    next(new NotFoundError('Rota não encontrada'));
}
