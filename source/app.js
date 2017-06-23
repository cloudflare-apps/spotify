(function () {
  'use strict'

  if (!window.addEventListener) return // Check for IE9+

  let options = INSTALL_OPTIONS
  let widgetElements = []

  const URL_PATTERN = new RegExp('spotify.com/(.+)')
  const PLAYER_SIZES = {
    small: {
      width: 300,
      height: 80
    },
    large: {
      width: 300,
      height: 380
    }
  }

  const FOLLOW_BUTTON_MODES = {
    small: 'basic',
    large: 'detail'
  }

  const SIZES = {
    playlist: PLAYER_SIZES,
    track: PLAYER_SIZES,
    artist: {
      small: {
        width: 200,
        height: 28
      },
      large: {
        width: 300,
        height: 56
      }
    }
  }

  const PLAYER_THEMES = {
    light: 'white',
    dark: 'black'
  }

  function parseURI (URI) {
    const URLMatch = URI.match(URL_PATTERN)

    if (URLMatch) {
      const segments = URLMatch[1].split('/')
      return ['spotify', ...segments].join(':')
    }

    return URI
  }

  const getURL = {
    artist (config) {
      const size = FOLLOW_BUTTON_MODES[config.size]
      const URI = parseURI(config.artist.URI)

      return `https://open.spotify.com/follow/1/?uri=${URI}&size=${size}&theme=${config.theme}`
    },
    playlist (config) {
      const theme = PLAYER_THEMES[config.theme]
      const URISource = config.playlist.URI === 'custom' ? config.playlist.customURI : config.playlist.URI
      const URI = parseURI(URISource)

      return `https://open.spotify.com/embed?uri=${URI}&theme=${theme}&view=${config.playlist.view}`
    },
    track (config) {
      const theme = PLAYER_THEMES[config.theme]
      const URI = parseURI(config.track.URI)

      return `https://open.spotify.com/embed?uri=${URI}&theme=${theme}`
    }
  }

  function updateElements () {
    widgetElements.forEach(element => {
      if (element.parentElement) element.parentElement.removeChild(element)
    })

    widgetElements = options.widgets
      .filter(config => {
        if (!document.querySelector(config.location.selector)) return false
        if (config.type === 'playlist' && config.playlist.URI === 'custom' && !config.playlist.customURI) return false
        if (config.type === 'track' && !config.track.URI) return false
        if (config.type === 'artist' && !config.artist.URI) return false

        return true
      })
      .map(config => {
        const container = INSTALL.createElement(config.location)
        container.setAttribute('app', 'spotify')
        container.setAttribute('data-position', config.position)
        container.setAttribute('data-type', config.position)

        const size = SIZES[config.type][config.size]
        const iframe = document.createElement('iframe')

        iframe.height = size.height
        iframe.width = size.width
        iframe.frameBorder = '0'
        iframe.setAttribute('allowtransparency', 'true')

        iframe.src = getURL[config.type](config)

        container.appendChild(iframe)

        return container
      })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateElements)
  } else {
    updateElements()
  }

  window.INSTALL_SCOPE = {
    setOptions (nextOptions) {
      options = nextOptions

      updateElements()
    }
  }
}())
