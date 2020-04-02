
exports.up = function (knex) {
  return knex.schema.createTable('horario', function (table) {
    table.string('id').primary();
    table.string('usuario_id').notNullable();
    table.datetime('data').notNullable();
    table.time('entrada');
    table.time('almoco');
    table.time('retorno');
    table.time('saida');
    table.time('atraso');
    table.time('hora_extra');

    table.foreign('usuario_id').references('id').inTable('usuario');
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('horario');
};
