import AppStateClass from './app-store'

export const AppState = AppStateClass

export default {
  AppState,
}

export const createStoreMap = () => ({ appState: new AppState() })
