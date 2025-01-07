const { EmbedBuilder, InteractionType } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');


module.exports = async (client, inter) => {

    if (inter.type === InteractionType.ApplicationCommand) {
        const DJ = client.config.opt.DJ;
        const command = client.commands.get(inter.commandName);
        const errorEmbed = new EmbedBuilder().setColor('#ff0000');

        // check if command exists first
        if (!command) {
            await inter.reply({
                embeds: [errorEmbed.setDescription(await Translate('<❌> | Error!'))],
                ephemeral: false
            });
            return;
        }

        // handle different types of commands
        const question = inter.options.getString('question');
        if (question) {
            // For ask command
            await inter.reply({
                content: `您问了: "${question}"\n\n虽然我是AI但我也要思考一下...🤔`,
                ephemeral: false // make it visible to everyone
            });
        } else {
            // for all other commands (include play)
            await inter.deferReply({ ephemeral: false });
        }

        // handle voice channel validation
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

        await inter.deferReply({ ephemeral: false });

        const queue = useQueue(inter.guild);
        const path = `../../buttons/${customId}.js`;

        delete require.cache[require.resolve(path)];
        const button = require(path);
        if (button) return button({ client, inter, customId, queue });
    }
};
