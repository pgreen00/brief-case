import createApp from '~/app.js'

export const port = 27132

let serverStarted = false

export async function startServer() {
  if (serverStarted) return
  return new Promise<void>(async resolve => {
    const app = await createApp()
    app.listen(port, () => {
      serverStarted = true
      setTimeout(resolve, 500)
    })
  })
}
