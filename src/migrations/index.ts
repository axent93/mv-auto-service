import * as migration_20260301_224721 from './20260301_224721';

export const migrations = [
  {
    up: migration_20260301_224721.up,
    down: migration_20260301_224721.down,
    name: '20260301_224721'
  },
];
