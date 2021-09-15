import express from 'express';
import { addPermission } from '../utils/permissions';
import migration from './migration';

const router = express.Router();

router.put('/migrations', async (req, res) => {
    await migration.runMigrations();

    res.send({ success: 'Banco Atualizado com sucesso!' });
});

router.put('/permissions', async (req, res) => {
    await addPermission();

    res.send({ success: 'Banco Atualizado com sucesso!' });
});

export default router;
