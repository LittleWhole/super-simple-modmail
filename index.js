const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = "TOKEN GOES HERE";

client.login(TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}! All systems look ok.`);
  client.user.setActivity("for DMs - DM me for modmail", { type: "WATCHING" });
});

client.on('message', message => {
  if (message.guild === null) return modmail(client, message);
  if (message.guild.id === "GUILD ID GOES HERE" && message.author.id !== "BOT ID GOES HERE") {
    if (message.content === "close") {
      let closeEmbed = new Discord.MessageEmbed()
      .setAuthor("From: " + message.author.username, message.author.avatarURL())
      .setDescription("The modmail ticket has been closed! We hope your experience with modmail has been positive!")
      .setColor("#dd4444")
      .setFooter("Modmail Closed")
      .setTimestamp();
      client.users.fetch(message.channel.name).then(u => u.send({ embed: closeEmbed}));
      return message.channel.delete();
    }
    let modmailEmbed = new Discord.MessageEmbed()
    .setAuthor("From: " + message.author.username, message.author.avatarURL())
    .setDescription(message.content)
    .setColor("#44dd44")
    .setFooter("Modmail")
    .setTimestamp();
    client.users.fetch(message.channel.name).then(u => u.send({ embed: modmailEmbed}));
    if (message.attachments.size > 0) client.users.fetch(message.channel.name).then(u => u.send(message.attachments.array()[0]));
    return;
  }
});

async function modmail(client, message) {
  let modmailGuild = client.guilds.cache.get("GUILD ID GOES HERE");
  if (message.author.id === "BOT ID GOES HEWRE") return; // this makes sure that there is no infinite loop that happens when the bot sends a message; it will stop it from attempting to sending a message to itself
  if (!modmailGuild.channels.cache.find(channel => channel.name === message.author.id)) return modmailGuild.channels.create(message.author.id, { parent: "CATEGORY GOES HERE" }) // this will create a new channel for the person that messages if it doesn't exist already
    .then(modmailChannel => {
      modmailChannel.send(`New modmail opened with ${message.author} - this is their first time contacting modmail!`);
      modmailChannel.send(`__${message.author}:__ ${message.content}`);
      message.author.send("Thank you for contacting modmail! Your message has been recieved by the mods! You should get a response shortly!");
  });
  
  let modmailChannel = modmailGuild.channels.cache.find(channel => channel.name === message.author.id);
  modmailChannel.send(`__${message.author}:__ ${message.content}`);
  if (message.attachments.size > 0) modmailChannel.send(message.attachments.array()[0]);
}
