(function () {
  'use strict'

  if (!window.addEventListener) return // Check for IE9+

  let options = INSTALL_OPTIONS
  let container

  const SIZES = {
    artist: {
      small: {
        width: 200,
        height: 25
      },
      large: {
        width: 300,
        height: 56
      }
    },
    player: {
      small: {
        width: 300,
        height: 80
      },
      large: {
        width: 300,
        height: 380
      }
    }
  }

  const PLAYER_THEMES = {
    light: 'white',
    dark: 'black'
  }

  const URLHelpers = {
    artist (config) {
      return `https://open.spotify.com/follow/1/?uri=spotify`
    },
    playlist (config) {
      const {id} = config
      const theme = PLAYER_THEMES[options.theme]

      return `https://open.spotify.com/embed?uri=spotify:playlist${id}&theme=${theme}&view=${options.view}`
    },
    track (config) {
      const {id} = config
      const theme = PLAYER_THEMES[options.theme]

      return `https://open.spotify.com/embed?uri=spotify:track${id}&theme=${theme}&view=${options.view}`
    }
  }

  function updateElement () {
    container = INSTALL.createElement(options.location, container)
    container.setAttribute('app', 'spotify')
    container.setAttribute('data-position', options.position)

    options.widgets.forEach(config => {
      const size = SIZES[config.type][options.size]
      const iframe = document.createElement('iframe')

      iframe.height = size.height
      iframe.width = size.width
      iframe.frameBorder = '0'
      iframe.setAttribute('allowtransparency', 'true')

      iframe.src = URLHelpers[config.type](config)

      container.appendChild(iframe)
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateElement)
  } else {
    updateElement()
  }

  window.INSTALL_SCOPE = {
    setOptions (nextOptions) {
      options = nextOptions

      updateElement()
    }
  }
}())
