import { posthog } from '@/lib/posthog'

type AuthenticationMethod = 'email_code' | 'oauth_google' | 'oauth_facebook' | 'oauth_apple'

export const posthogLogger = {
  authenticationCompleted(flow: 'sign_in' | 'sign_up', method: AuthenticationMethod) {
    posthog?.logger.info('authentication_completed', {
      authentication_flow: flow,
      authentication_method: method,
    })
  },

  languageSelectionCompleted(languageCode: string) {
    posthog?.logger.info('language_selection_completed', {
      language_code: languageCode,
    })
  },

  storyCompleted() {
    posthog?.logger.info('story_completed')
  },
}
