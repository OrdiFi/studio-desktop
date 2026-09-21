const DB_NAME =
  'ordifi-studio-assets'

const DB_VERSION = 2
const STORE_NAME = 'assets'

export type StudioAssetRecord = {
  key: string
  mime: string
  version: string
  blob: Blob
  updatedAt: number
}

function openDb():
  Promise<IDBDatabase> {
  return new Promise(
    (resolve, reject) => {
      const request =
        indexedDB.open(
          DB_NAME,
          DB_VERSION,
        )

      request.onupgradeneeded =
        () => {
          const db =
            request.result

          /*
           * v1 was development-only and used
           * a thumbnail-specific store before
           * Studio sync existed.
           */
          if (
            db.objectStoreNames
              .contains('thumbnails')
          ) {
            db.deleteObjectStore(
              'thumbnails',
            )
          }

          if (
            !db.objectStoreNames
              .contains(STORE_NAME)
          ) {
            db.createObjectStore(
              STORE_NAME,
              {
                keyPath: 'key',
              },
            )
          }
        }

      request.onsuccess =
        () => {
          resolve(request.result)
        }

      request.onerror =
        () => {
          reject(
            request.error ??
              new Error(
                'Failed to open Studio asset database.',
              ),
          )
        }
    },
  )
}

export async function getStudioAsset(
  key: string,
): Promise<
  StudioAssetRecord | null
> {
  const db = await openDb()

  try {
    return await new Promise(
      (resolve, reject) => {
        const tx =
          db.transaction(
            STORE_NAME,
            'readonly',
          )

        const request =
          tx.objectStore(
            STORE_NAME,
          ).get(key)

        request.onsuccess =
          () => {
            resolve(
              (
                request.result as
                  | StudioAssetRecord
                  | undefined
              ) ?? null,
            )
          }

        request.onerror =
          () => {
            reject(
              request.error ??
                new Error(
                  'Failed to read Studio asset.',
                ),
            )
          }
      },
    )
  } finally {
    db.close()
  }
}

export async function setStudioAsset(
  record: StudioAssetRecord,
): Promise<void> {
  const db = await openDb()

  try {
    await new Promise<void>(
      (resolve, reject) => {
        const tx =
          db.transaction(
            STORE_NAME,
            'readwrite',
          )

        tx.objectStore(
          STORE_NAME,
        ).put(record)

        tx.oncomplete =
          () => resolve()

        tx.onerror =
          () => {
            reject(
              tx.error ??
                new Error(
                  'Failed to store Studio asset.',
                ),
            )
          }

        tx.onabort =
          () => {
            reject(
              tx.error ??
                new Error(
                  'Studio asset transaction aborted.',
                ),
            )
          }
      },
    )
  } finally {
    db.close()
  }
}

export async function deleteStudioAsset(
  key: string,
): Promise<void> {
  const db = await openDb()

  try {
    await new Promise<void>(
      (resolve, reject) => {
        const tx =
          db.transaction(
            STORE_NAME,
            'readwrite',
          )

        tx.objectStore(
          STORE_NAME,
        ).delete(key)

        tx.oncomplete =
          () => resolve()

        tx.onerror =
          () => {
            reject(
              tx.error ??
                new Error(
                  'Failed to delete Studio asset.',
                ),
            )
          }
      },
    )
  } finally {
    db.close()
  }
}

export async function clearStudioAssets():
  Promise<void> {
  const db = await openDb()

  try {
    await new Promise<void>(
      (resolve, reject) => {
        const tx =
          db.transaction(
            STORE_NAME,
            'readwrite',
          )

        tx.objectStore(
          STORE_NAME,
        ).clear()

        tx.oncomplete =
          () => resolve()

        tx.onerror =
          () => {
            reject(
              tx.error ??
                new Error(
                  'Failed to clear Studio assets.',
                ),
            )
          }
      },
    )
  } finally {
    db.close()
  }
}
