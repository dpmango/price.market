export const scrollToElement = (
  id: string,
  mindHeader = true,
  page: boolean = false,
  speed = 500
) => {
  if (!page) {
    const element = document.getElementById(id)
    if (!element) return

    let headerOffset = 0
    if (typeof mindHeader === 'boolean') {
      headerOffset = window.innerWidth > 767 ? 66 + 24 : 56 + 20
    } else if (typeof mindHeader === 'number') {
      headerOffset = mindHeader
    }

    const targetTop = element.getBoundingClientRect().top + window.pageYOffset - headerOffset

    scrollWithSpeed(targetTop, speed)
  } else {
    window.location.href = `/${page}#${id}`
  }
}

export const scrollWithSpeed = (to: number, duration: number = 500, el?: HTMLElement) => {
  const element = el || document.documentElement
  const start = element.scrollTop
  const change = to - start
  const startDate = +new Date()
  const easeInOutQuad = (t: any, b: any, c: any, d: any) => {
    t /= d / 2
    if (t < 1) {
      return (c / 2) * t * t + b
    }
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  const animateScroll = () => {
    const currentDate = +new Date()
    const currentTime = currentDate - startDate

    element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration), 10)
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll)
    } else {
      element.scrollTop = to
    }
  }
  animateScroll()
}

export const getElementTop = (elem: HTMLElement) => {
  const box = elem.getBoundingClientRect()

  const body = document.documentElement

  const scrollTop = body.scrollTop
  const clientTop = body.clientTop || 0

  const top = box.top + box.height + scrollTop - clientTop

  return Math.round(top)
}

export const lockBody = () => {
  const body = document.querySelector('body')
  if (!body) return

  body.classList.add('js-locked')

  const div = document.createElement('div')
  div.style.overflowY = 'scroll'
  div.style.width = '50px'
  div.style.height = '50px'

  document.body.append(div)
  const scrollWidth = div.offsetWidth - div.clientWidth

  div.remove()
  body.style.marginRight = scrollWidth + 'px'
}

export const unlockBody = () => {
  const body = document.querySelector('body')
  if (!body) return

  body.classList.remove('js-locked')
  body.removeAttribute('style')
}
