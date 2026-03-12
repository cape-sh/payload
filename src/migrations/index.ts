import * as migration_20260213_172637_initial from './20260213_172637_initial';
import * as migration_20260312_064345_add_pages_resources from './20260312_064345_add_pages_resources';

export const migrations = [
  {
    up: migration_20260213_172637_initial.up,
    down: migration_20260213_172637_initial.down,
    name: '20260213_172637_initial',
  },
  {
    up: migration_20260312_064345_add_pages_resources.up,
    down: migration_20260312_064345_add_pages_resources.down,
    name: '20260312_064345_add_pages_resources'
  },
];
