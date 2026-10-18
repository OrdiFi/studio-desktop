import { isTauri } from '@tauri-apps/api/core'
import { check } from '@tauri-apps/plugin-updater'

export async function checkStudioUpdates(): Promise<void> {
  if (!isTauri()) {
    window.alert('App updates are available in the installed Studio app.')
    return
  }

  try {
    const update = await check()

    if (!update) {
      window.alert('OrdiFi Studio is up to date.')
      return
    }

    const confirmed = window.confirm(
      `OrdiFi Studio ${update.version} is available.\n\n` +
      'Save your current project before updating.\n' +
      'The application will close during installation.\n\n' +
      'Install update now?'
    )

    if (!confirmed) {
      return
    }

    await update.downloadAndInstall()
  } catch (error) {
    console.error('Studio update failed:', error)

    window.alert(
      error instanceof Error
        ? `Update failed: ${error.message}`
        : 'Update check failed.'
    )
  }
}
