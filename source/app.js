(function () {
  'use strict'

  if (!document.addEventListener) return

  var fullRe = /(?:https?:\/\/)?(?:www\.)?youtube.com\/(watch|playlist)\?(v|list)=([a-zA-Z0-9\-_]+)/i
  var shortRe = /(?:https?:\/\/)?youtu.be\/([a-zA-Z0-9]+)(?:\?list=([a-zA-Z0-9\-_]+))?/i
  var options = INSTALL_OPTIONS
  var previewCache = []

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
    previewCache = []

    options.embeds.forEach(function (embed) {
      if (!embed.url) return

      var container = INSTALL.createElement(embed.location)
      if (!container) return

      if (INSTALL_ID === 'preview') {
        previewCache.push(container)
      }

      var info = parseURL(embed.url)
      if (!info) return

      var iframeURL = 'https://www.youtube.com/embed'

      if (info.type === 'watch') {
        iframeURL += '/' + info.id + '?'
      } else {
        iframeURL += '?listType=playlist&list=' + info.id + '&'
      }

      if (embed.autoplay) {
        embed += 'autoplay=1'
      }

      container.innerHTML = '<iframe type="text/html" style="max-width: 100%" width="640" height="390" src="' + iframeURL + '" frameborder="0"></iframe>'
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateElement)
  } else {
    updateElement()
  }

  window.INSTALL_SCOPE = {
    setOptions: function setOptions (nextOptions) {
      previewCache.forEach(function (element) {
        INSTALL.createElement(null, element)
      })

      options = nextOptions

      updateElement()
    }
  }
}())
