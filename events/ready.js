const { Guild } = require("discord.js");
const { Orders, Clients } = require("../utils/api");

module.exports = {
  name: "ready",
  execute: async (client) => {
    console.log("Esse bot foi criado por Carlin");
    const channels = client.channels.cache;
    const guild = client.guilds.cache.get("978660471286665256");
    const oniChan = channels.get(client.config.ticketChannel);

    async function createChannel(name, topic, category, order) {
      const Channel = channels.get(`ticket-${name.replace(" ", "-")}`);
      if (Channel) return Channel;

      console.log(name, topic, category, order);

      await guild.channels.create(`ticket-${name.replace(" ", "-")}`, {
        parent: client.config.parentOpened,
        topic: topic,
        permissionOverwrites: [
          {
            id: client.user.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
          },
          {
            id: category,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
          },
          {
            id: guild.roles.everyone,
            deny: ["VIEW_CHANNEL"]
          }
        ],
        type: "text"
      });

      let channel = channels.get(`ticket-${name.replace(" ", "-")}`);
      console.log(channel);
      await Orders.updateOrder(order, { channel: channel.id });
      return channel;
    }

    /**
     * SOCKETS!
     */
    client.io.emit("connectAPI", "Discord");
    client.io.on("messageToDIS", async (data) => {
      const { client, order, message } = data;
      const clientAPI = await Clients.getClient({ client });

      const orderAPI = await Orders.getOrder(client);

      console.log(orderAPI.order);

      const channel = createChannel(
        clientAPI.client.name,
        orderAPI.order.subject,
        orderAPI.order.category,
        orderAPI.order
      );
      channel.send(message);
    });

    function sendTicketMSG() {
      const embed = new client.discord.MessageEmbed()
        .setColor("6d6ee8")
        .setAuthor({
          name: "hifuzion suporte",
          iconURL:
            "https://images-ext-1.discordapp.net/external/_f2eZg_kulKwB5dnsjpdDRgzXzo81sDl3_SUddZ_1_0/%3Fsize%3D2048/https/cdn.discordapp.com/icons/978660471286665256/7e6391e8eb99e881b2821d011523ee54.png",
          url: "https://hifuzion.com.br"
        })
        .setDescription(
          "Clique no botão abaixo para abrir um suporte, e espere ser atendido por alguém do suporte."
        )
        .setFooter(client.config.footerText, client.user.avatarURL());
      const row = new client.discord.MessageActionRow().addComponents(
        new client.discord.MessageButton()
          .setCustomId("open-ticket")
          .setLabel("Abra um suporte")
          .setEmoji("✉️")
          .setStyle("PRIMARY")
      );

      oniChan.send({
        embeds: [embed],
        components: [row]
      });
    }

    const toDelete = 10000;

    async function fetchMore(channel, limit) {
      if (!channel) {
        throw new Error(`Canal esperado, tem ${typeof channel}.`);
      }
      if (limit <= 100) {
        return channel.messages.fetch({
          limit
        });
      }

      let collection = [];
      let lastId = null;
      let options = {};
      let remaining = limit;

      while (remaining > 0) {
        options.limit = remaining > 100 ? 100 : remaining;
        remaining = remaining > 100 ? remaining - 100 : 0;

        if (lastId) {
          options.before = lastId;
        }

        let messages = await channel.messages.fetch(options);

        if (!messages.last()) {
          break;
        }

        collection = collection.concat(messages);
        lastId = messages.last().id;
      }
      collection.remaining = remaining;

      return collection;
    }

    const list = await fetchMore(oniChan, toDelete);

    let i = 1;

    list.forEach((underList) => {
      underList.forEach((msg) => {
        i++;
        if (i < toDelete) {
          setTimeout(function () {
            msg.delete();
          }, 1000 * i);
        }
      });
    });

    setTimeout(() => {
      sendTicketMSG();
    }, i);
  }
};
