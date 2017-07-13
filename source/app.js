(function () {
  'use strict'

  if (!document.addEventListener) return

  var fullRe = /(?:https?:\/\/)?(?:www\.)?youtube.com\/(watch|playlist)\?(v|list)=([a-zA-Z0-9\-_]+)/i
  var shortRe = /(?:https?:\/\/)?youtu.be\/([a-zA-Z0-9]+)(?:\?list=([a-zA-Z0-9\-_]+))?/i
  var options = INSTALL_OPTIONS
  var container

  function parseURL (url) {
    var match = fullRe.exec(url)
    var type = 'watch'
    var id

    if (match) {
      type = match[1]
      id = match[3]
    } else {
      match = shortRe.exec(url)

      if (!match) { return null }

      if (match[2]) {
        type = 'playlist'
        id = match[2]
      } else {
        id = match[1]
      }
    }

    return {type: type, id: id}
  }

  function updateElement () {
    container = INSTALL.createElement(options.location, container)
    var content = ''

    if (!container) return

    for (var i = 0; i < options.embeds.length; i++) {
      if (!options.embeds[i].url) continue

      var info = parseURL(options.embeds[i].url)

      if (!info) continue

      var embed = 'https://www.youtube.com/embed'

      if (info.type === 'watch') {
        embed += '/' + info.id + '?'
      } else {
        embed += '?listType=playlist&list=' + info.id + '&'
      }

      if (options.embeds[i].autoplay) {
        embed += 'autoplay=1'
      }

      content += '<iframe type="text/html" style="max-width: 100%" width="640" height="390" src="' + embed + '" frameborder="0"></iframe>'
    }

    container.innerHTML = content
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateElement)
  } else {
    updateElement()
  }
}())
