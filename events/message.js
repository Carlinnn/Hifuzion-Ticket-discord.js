const { Messages, Orders, Supporters } = require("../utils/api");

module.exports = {
  name: "messageCreate",
  execute: async (message, client) => {
    if (message.channel.id !== "979862673401471068") return;

    const Order = await Orders.getOrder({ channel: message.channel.id });
    const Supporter = await Supporters.getSupporter({
      discord: message.author.id
    });

    const { name: support } = Supporter.supporter;

    if (!Order.status == 200 || message.author.bot) return;
    client.io.emit("messageFromDIS", {
      client: Order.order.client,
      channel: message.channel.id,
      support: message.author.id,
      message: `*${support}* - Suporte\n\n${message.content}`
    });

    // Messages.send({
    //   client: message.author.id,
    //   order: "Asfdasa!@3123",
    //   message: message.content,
    //   support: message.author
    // });
  }
};
