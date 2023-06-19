import { unstable_dev } from 'wrangler'
import type { UnstableDevWorker } from 'wrangler'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { type IRequest } from 'itty-router'
import { handleHelloWorld } from './index'

describe('handleHelloWorld', () => {
  function buildRequestLike (origin: string): IRequest {
    const request = new Request(origin + '/')
    return Object.assign(request, {
      route: '*',
      params: {},
      query: {}
    })
  }
  it('should return Hello World!', async () => {
    const resp = await handleHelloWorld(buildRequestLike('https://test.com'))
    expect(resp).toBeInstanceOf(Response)
  })
})

describe('Worker', () => {
  let worker: UnstableDevWorker

  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts', {
      experimental: { disableExperimentalWarning: true }
    })
  })

  afterAll(async () => {
    await worker.stop()
  })

  it('should return Hello World', async () => {
    const resp = await worker.fetch()
    if (resp instanceof Response) {
      const text = await resp.text()
      expect(text).toMatchInlineSnapshot('"Hello World!"')
    }
  })
})
