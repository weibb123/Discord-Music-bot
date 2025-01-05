const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {

    // Get the user who triggered the command through the interaction object
    const userMention = `<@${inter.member.id}>`;
    if (!queue?.isPlaying()) {
        return inter.editReply({
            content: await Translate(`No music currently playing... try again ? <❌>`)
        });
    }

    const resumed = queue.node.resume();
    let message = await Translate(`${userMention}, 牛马工作了 | <${queue.currentTrack.title}> resumed <✅>`);

    if (!resumed) {
        queue.node.pause();
        message = await Translate(`${userMention}, 你不让我唱了吗 | <${queue.currentTrack.title}> paused <✅>`);
    }

    return inter.editReply({ content: message });
}