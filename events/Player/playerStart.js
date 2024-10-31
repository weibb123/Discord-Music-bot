const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

module.exports = (queue, track) => {
  if (!client.config.app.loopMessage && queue.repeatMode !== 0) return;

  let EmojiState = client.config.app.enableEmojis;

  const emojis = client.config.emojis;

  emojis ? EmojiState = EmojiState : EmojiState = false;


  (async () => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: await (
          `为你播放 <${track.title}> 在 ${queue.channel.name}频道 🎧`
        ),
        iconURL: track.thumbnail,
      })
      .setColor("#2f3136");

    const back = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.back : ('Back'))
      .setCustomId('back')
      .setStyle('Primary');

    const skip = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.skip : ('Skip'))
      .setCustomId('skip')
      .setStyle('Primary');

    const resumepause = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.ResumePause : ('Resume & Pause'))
      .setCustomId('resume&pause')
      .setStyle('Danger');

    const loop = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.loop : ('Loop'))
      .setCustomId('loop')
      .setStyle('Danger');

    const row1 = new ActionRowBuilder().addComponents(
      back,
      loop,
      resumepause,
      skip
    );
    queue.metadata.channel.send({ embeds: [embed], components: [row1] });
  })();
};