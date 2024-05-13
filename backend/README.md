# KitsCon 24.1 backend

A REST API built on [Cloudflare workers](https://developers.cloudflare.com/workers/), using [Hono](https://hono.dev/) for routing. It demos use of [Workers AI](https://developers.cloudflare.com/workers-ai/), [KV](https://developers.cloudflare.com/kv/), [D1](https://developers.cloudflare.com/d1/) and service bindings (both [HTTP](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/http/) and [RPC](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/rpc/)).

The worker is automatically deployed when a commit is pushed to master. See this [workflow](../.github/workflows/deploy-backend.yml), or look at [this page](https://developers.cloudflare.com/workers/wrangler/ci-cd/) for more info on how to setup a basic github action.
