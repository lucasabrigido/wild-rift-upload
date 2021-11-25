import db from './index';

export default class DbService {
    static async migrate() {
        await db.migrate.latest({
            migrationSource: new WebpackMigrationSource(require.context('../../../migrations', false, /.js$/)),
        });
    }

    static async list() {
        const [completed, pending] = await db.migrate.list({
            migrationSource: new WebpackMigrationSource(require.context('../../../migrations', false, /.js$/)),
        });
        return {completed, pending};
    }

    static async down() {
        await db.migrate.down({
            migrationSource: new WebpackMigrationSource(require.context('../../../migrations', false, /.js$/)),
        });
    }

    static async up() {
        await db.migrate.up({
            migrationSource: new WebpackMigrationSource(require.context('../../../migrations', false, /.js$/)),
        });
    }
}

class WebpackMigrationSource {
    constructor(migrationContext) {
        this.migrationContext = migrationContext;
    }

    getMigrations() {
        return Promise.resolve(this.migrationContext.keys().sort());
    }

    getMigrationName(migration) {
        return migration;
    }

    getMigration(migration) {
        return this.migrationContext(migration);
    }
}
