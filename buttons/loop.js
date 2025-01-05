const { QueueRepeatMode } = require('discord-player');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {

    const userMention = `<@${inter.member.id}>`;

    const methods = ['disabled', 'track', 'queue'];

    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`No music currently playing... try again ? <❌>`) });

    if (queue.repeatMode === 2) {
        queue.setRepeatMode(QueueRepeatMode.OFF);
    } else {
        queue.setRepeatMode(queue.repeatMode + 1);
    }

    const trackName = queue.currentTrack.title;

    return inter.editReply({
        content: await Translate(`${userMention}, 你想唱死我莫 | <**${methods[queue.repeatMode]}**> <${trackName}> loop<✅>`) 
    });
}