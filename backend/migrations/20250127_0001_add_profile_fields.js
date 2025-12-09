/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
  const hasFirstName = await knex.schema.hasColumn('users', 'first_name');
  const hasLastName = await knex.schema.hasColumn('users', 'last_name');
  const hasDateOfBirth = await knex.schema.hasColumn('users', 'date_of_birth');
  const hasAvatarUrl = await knex.schema.hasColumn('users', 'avatar_url');
  const hasTwoFactorEnabled = await knex.schema.hasColumn('users', 'two_factor_enabled');
  const hasLastLoginAt = await knex.schema.hasColumn('users', 'last_login_at');
  const hasEmailVerifiedAt = await knex.schema.hasColumn('users', 'email_verified_at');

  return knex.schema.alterTable('users', function (table) {
    // Add missing profile fields (only if they don't exist)
    if (!hasFirstName) {
      table.string('first_name', 60).after('name');
    }
    if (!hasLastName) {
      table.string('last_name', 60).after('first_name');
    }
    if (!hasDateOfBirth) {
      table.date('date_of_birth').after('last_name');
    }
    if (!hasAvatarUrl) {
      table.string('avatar_url', 255).after('date_of_birth');
    }
    if (!hasTwoFactorEnabled) {
      table.boolean('two_factor_enabled').defaultTo(false).after('avatar_url');
    }
    if (!hasLastLoginAt) {
      table.timestamp('last_login_at').nullable().after('two_factor_enabled');
    }
    if (!hasEmailVerifiedAt) {
      table.timestamp('email_verified_at').nullable().after('last_login_at');
    }

    // Add indexes for better performance
    table.index(['email_verified_at'], 'idx_users_email_verified');
    table.index(['last_login_at'], 'idx_users_last_login');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    // Remove indexes first
    table.dropIndex(['email_verified_at'], 'idx_users_email_verified');
    table.dropIndex(['last_login_at'], 'idx_users_last_login');

    // Remove columns
    table.dropColumn('first_name');
    table.dropColumn('last_name');
    table.dropColumn('date_of_birth');
    table.dropColumn('avatar_url');
    table.dropColumn('two_factor_enabled');
    table.dropColumn('last_login_at');
    table.dropColumn('email_verified_at');
  });
};
