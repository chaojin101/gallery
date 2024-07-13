## setup

```sh
bun i
```

## the problem

in `./apps/web/src/api.ts` the `App` type is `any`

but in `./apps/backend/src/exports.ts` the `App` type is not `any`

i can't type the `treaty`
