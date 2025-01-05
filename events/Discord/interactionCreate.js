const { EmbedBuilder, InteractionType } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = async (client, inter) => {

    // ephemeral: true means that the response is only visible to the user who triggered the command
    await inter.deferReply({ ephemeral: false });

    if (inter.type === InteractionType.ApplicationCommand) {
        const DJ = client.config.opt.DJ;
        const command = client.commands.get(inter.commandName);

        const errorEmbed = new EmbedBuilder().setColor('#ff0000');

        if (!command) {
            errorEmbed.setDescription(await Translate('<❌> | Error!'));
            inter.editReply({ embeds: [errorEmbed], ephemeral: false });
            return client.slash.delete(inter.commandName);
        }
        if (command.voiceChannel) {
            if (!inter.member.voice.channel) {
                errorEmbed.setDescription(await Translate(`<❌> | 你不在频道`));
                return inter.editReply({ embeds: [errorEmbed], ephemeral: false });
            }

            if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) {
                errorEmbed.setDescription(await Translate(`<❌> | 你不在同一个频道`));
                return inter.editReply({ embeds: [errorEmbed], ephemeral: false });
            }
        }

        command.execute({ inter, client });
    } else if (inter.type === InteractionType.MessageComponent) {
        const customId = inter.customId;
        if (!customId) return;

        const queue = useQueue(inter.guild);
        const path = `../../buttons/${customId}.js`;

        delete require.cache[require.resolve(path)];
        const button = require(path);
        if (button) return button({ client, inter, customId, queue });
    }
}
