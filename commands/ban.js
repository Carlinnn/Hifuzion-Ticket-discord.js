const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banir uma pessoa')
    .addUserOption(option =>
      option.setName('target')
      .setDescription('Membro para banir')
      .setRequired(true))
    .addStringOption(option =>
      option.setName('raison')
      .setDescription('Motivo do ban')
      .setRequired(false)),
  async execute(interaction, client) {
    const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
    const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

    if (!executer.permissions.has(client.discord.Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({
      content: 'Você não tem a permissão necessária para executar este comando! (`BAN_MEMBERS`)',
      ephemeral: true
    });

    if (user.roles.highest.rawPosition > executer.roles.highest.rawPosition) return interaction.reply({
      content: 'A pessoa que você quer banir está acima de você!',
      ephemeral: true
    });

    if (!user.bannable) return interaction.reply({
      content: 'A pessoa que você quer banir está acima de mim! Então não posso bani-lo.',
      ephemeral: true
    });

    if (interaction.options.getString('raison')) {
      user.ban({
        reason: interaction.options.getString('raison'),
        days: 1
      });
      interaction.reply({
        content: `**${user.user.tag}** Foi banido com sucesso!`
      });
    } else {
      user.ban({
        days: 1
      });
      interaction.reply({
        content: `**${user.user.tag}** Foi banido com sucesso!`
      });
    };
  },
};