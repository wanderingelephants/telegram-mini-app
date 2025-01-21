/*export function useAnalytics() {
    const trackEvent = (eventName, parameters = {}) => {
      gtag('event', eventName, {
        ...parameters,
        timestamp: new Date().toISOString()
      })
    }
  
    const trackButtonClick = (buttonName, componentName) => {
      trackEvent('button_click', {
        button_name: buttonName,
        component_name: componentName,
        page_path: window.location.pathname
      })
    }
  
    const trackMenuClick = (menuItem) => {
      trackEvent('menu_click', {
        menu_item: menuItem,
        previous_page: window.location.pathname
      })
    }
  
    const trackUserEngagement = (action, content) => {
      trackEvent('user_engagement', {
        action_type: action,
        content_type: content,
        page_path: window.location.pathname
      })
    }
  
    return {
      trackEvent,
      trackButtonClick,
      trackMenuClick,
      trackUserEngagement
    }
  }*/