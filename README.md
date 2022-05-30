# Ticket Bot

Ticket Bot é um bot de tickets de discord com botões feitos com Discord.js v13

![](https://ticketsbot.net/assets/img/logo-trans.webp)

## Como instalar ?

Você precisa ter o Node.JS 16+
``````bash
git clone https://github.com/Carlinnn/ticketbot
cd ticket-bot
npm i
``````

## Como configurar?

```json
//config.json
{
  "clientId": "ID do bot",


  "parentOpened": "id da categoria quando um ticket é aberto",
  "parentTransactions": "id da categoria quando um ticket é uma transação de ticket",
  "parentJeux": "id da categoria quando um ticket é um ticket Hospedagens",
  "parentAutres": "id da categoria quando um ticket é um ticket Outros",

  "roleSupport": "id do suporte da função",

  "logsTicket": "id do canal de registros de tickets",
  "ticketChannel": "id do canal para onde é enviado o embed para criar um ticket",
  
  "footerText": "o rodapé das incorporações"
}
```

```json
//token.json
{
  "token": "token do seu bot de discord"
}
```
