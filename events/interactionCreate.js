let hastebin = require('hastebin');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId == "open-ticket") {
      if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id)) {
        return interaction.reply({
          content: 'Você já criou um ticket!',
          ephemeral: true
        });
      };

      interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
        parent: client.config.parentOpened,
        topic: interaction.user.id,
        permissionOverwrites: [{
            id: interaction.user.id,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: client.config.roleSupport,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
        ],
        type: 'text',
      }).then(async c => {
        interaction.reply({
          content: `ticket criado! <#${c.id}>`,
          ephemeral: true
        });

        const embed = new client.discord.MessageEmbed()
          .setColor('6d6ee8')
          .setAuthor('Ticket', 'https://images-ext-1.discordapp.net/external/_f2eZg_kulKwB5dnsjpdDRgzXzo81sDl3_SUddZ_1_0/%3Fsize%3D2048/https/cdn.discordapp.com/icons/978660471286665256/7e6391e8eb99e881b2821d011523ee54.png')
          .setDescription('Selecione a categoria do seu ticket')
          .setFooter('Carlin', 'https://images-ext-1.discordapp.net/external/_f2eZg_kulKwB5dnsjpdDRgzXzo81sDl3_SUddZ_1_0/%3Fsize%3D2048/https/cdn.discordapp.com/icons/978660471286665256/7e6391e8eb99e881b2821d011523ee54.png')
          .setTimestamp();

        const row = new client.discord.MessageActionRow()
          .addComponents(
            new client.discord.MessageSelectMenu()
            .setCustomId('category')
            .setPlaceholder('Selecione a categoria do ticket')
            .addOptions([{
                label: 'Financeiro',
                value: 'Financeiro',
                emoji: '🪙',
              },
              {
                label: 'Suporte',
                value: 'Suporte',
                emoji: '💡',
              },
              {
                label: 'Outros',
                value: 'Outros',
                emoji: '📔',
              },
            ]),
          );

        msg = await c.send({
          content: `<@!${interaction.user.id}>`,
          embeds: [embed],
          components: [row]
        });

        const collector = msg.createMessageComponentCollector({
          componentType: 'SELECT_MENU',
          time: 20000
        });

        collector.on('collect', i => {
          if (i.user.id === interaction.user.id) {
            if (msg.deletable) {
              msg.delete().then(async () => {
                const embed = new client.discord.MessageEmbed()
                  .setColor('6d6ee8')
                  .setAuthor('Ticket', 'https://images-ext-1.discordapp.net/external/_f2eZg_kulKwB5dnsjpdDRgzXzo81sDl3_SUddZ_1_0/%3Fsize%3D2048/https/cdn.discordapp.com/icons/978660471286665256/7e6391e8eb99e881b2821d011523ee54.png')
                  .setDescription(`<@!${interaction.user.id}> Criou um ticket ${i.values[0]}`)
                  .setFooter('Carlin', 'https://images-ext-1.discordapp.net/external/_f2eZg_kulKwB5dnsjpdDRgzXzo81sDl3_SUddZ_1_0/%3Fsize%3D2048/https/cdn.discordapp.com/icons/978660471286665256/7e6391e8eb99e881b2821d011523ee54.png')
                  .setTimestamp();

                const row = new client.discord.MessageActionRow()
                  .addComponents(
                    new client.discord.MessageButton()
                    .setCustomId('close-ticket')
                    .setLabel('Fechar ticket')
                    .setEmoji('899745362137477181')
                    .setStyle('DANGER'),
                  );

                const opened = await c.send({
                  content: `<@&${client.config.roleSupport}>`,
                  embeds: [embed],
                  components: [row]
                });

                opened.pin().then(() => {
                  opened.channel.bulkDelete(1);
                });
              });
            };
            if (i.values[0] == 'transacao') {
              c.edit({
                parent: client.config.parenttransacaos
              });
            };
            if (i.values[0] == 'suporte') {
              c.edit({
                parent: client.config.parentsuporte
              });
            };
            if (i.values[0] == 'outros') {
              c.edit({
                parent: client.config.parentoutross
              });
            };
          };
        });

        collector.on('end', collected => {
          if (collected.size < 1) {
            c.send(`Nenhuma categoria selecionada. Fechando o ticket...`).then(() => {
              setTimeout(() => {
                if (c.deletable) {
                  c.delete();
                };
              }, 5000);
            });
          };
        });
      });
    };

    if (interaction.customId == "close-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
          .setCustomId('confirm-close')
          .setLabel('Fechar ticket')
          .setStyle('DANGER'),
          new client.discord.MessageButton()
          .setCustomId('no')
          .setLabel('Cancelar fechamento')
          .setStyle('SECONDARY'),
        );

      const verif = await interaction.reply({
        content: 'Tem certeza de que deseja fechar o ticket?',
        components: [row]
      });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 10000
      });

      collector.on('collect', i => {
        if (i.customId == 'confirm-close') {
          interaction.editReply({
            content: `Ticket fechado por <@!${interaction.user.id}>`,
            components: []
          });

          chan.edit({
              name: `fechado-${chan.name}`,
              permissionOverwrites: [
                {
                  id: client.users.cache.get(chan.topic),
                  deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: client.config.roleSupport,
                  allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: interaction.guild.roles.everyone,
                  deny: ['VIEW_CHANNEL'],
                },
              ],
            })
            .then(async () => {
              const embed = new client.discord.MessageEmbed()
                .setColor('6d6ee8')
                .setAuthor('Ticket', 'https://images-ext-1.discordapp.net/external/_f2eZg_kulKwB5dnsjpdDRgzXzo81sDl3_SUddZ_1_0/%3Fsize%3D2048/https/cdn.discordapp.com/icons/978660471286665256/7e6391e8eb99e881b2821d011523ee54.png')
                .setDescription('```Controle de tickets```')
                .setFooter('Carlin', 'https://images-ext-1.discordapp.net/external/_f2eZg_kulKwB5dnsjpdDRgzXzo81sDl3_SUddZ_1_0/%3Fsize%3D2048/https/cdn.discordapp.com/icons/978660471286665256/7e6391e8eb99e881b2821d011523ee54.png')
                .setTimestamp();

              const row = new client.discord.MessageActionRow()
                .addComponents(
                  new client.discord.MessageButton()
                  .setCustomId('delete-ticket')
                  .setLabel('Excluir Ticket')
                  .setEmoji('🗑️')
                  .setStyle('DANGER'),
                );

              chan.send({
                embeds: [embed],
                components: [row]
              });
            });

          collector.stop();
        };
        if (i.customId == 'no') {
          interaction.editReply({
            content: 'Fechando o ticket cancelado !',
            components: []
          });
          collector.stop();
        };
      });

      collector.on('end', (i) => {
        if (i.size < 1) {
          interaction.editReply({
            content: 'Fechando o ticket cancelado !',
            components: []
          });
        };
      });
    };

    if (interaction.customId == "delete-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      interaction.reply({
        content: 'Salvando as mensagens...'
      });

      chan.messages.fetch().then(async (messages) => {
        let a = messages.filter(m => m.author.bot !== true).map(m =>
          `${new Date(m.createdTimestamp).toLocaleString('fr-FR')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
        ).reverse().join('\n');
        if (a.length < 1) a = "Nothing"
        hastebin.createPaste(a, {
            contentType: 'text/plain',
            server: 'https://hastebin.com'
          }, {})
          .then(function (urlToPaste) {
            const embed = new client.discord.MessageEmbed()
              .setAuthor('Registro do ticket', 'https://images-ext-1.discordapp.net/external/_f2eZg_kulKwB5dnsjpdDRgzXzo81sDl3_SUddZ_1_0/%3Fsize%3D2048/https/cdn.discordapp.com/icons/978660471286665256/7e6391e8eb99e881b2821d011523ee54.png')
              .setDescription(`📰 Registros do ticket \`${chan.id}\` criado por <@!${chan.topic}> e deletado por <@!${interaction.user.id}>\n\nLogs: [**Clique aqui para ver os registros**](${urlToPaste})`)
              .setColor('2f3136')
              .setTimestamp();

            const embed2 = new client.discord.MessageEmbed()
              .setAuthor('Logs Ticket', 'https://images-ext-1.discordapp.net/external/_f2eZg_kulKwB5dnsjpdDRgzXzo81sDl3_SUddZ_1_0/%3Fsize%3D2048/https/cdn.discordapp.com/icons/978660471286665256/7e6391e8eb99e881b2821d011523ee54.png')
              .setDescription(`📰 Registros do ticket \`${chan.id}\`: [**Clique aqui para ver os logs**](${urlToPaste})`)
              .setColor('2f3136')
              .setTimestamp();

            client.channels.cache.get(client.config.logsTicket).send({
              embeds: [embed]
            });
            client.users.cache.get(chan.topic).send({
              embeds: [embed2]
            }).catch(() => {console.log('Eu posso\'mande uma dm pra ele :(')});
            chan.send('Excluindo o canal...');

            setTimeout(() => {
              chan.delete();
            }, 5000);
          });
      });
    };
  },
};
