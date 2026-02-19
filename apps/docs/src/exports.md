# Internal Exports

Vergil's main API is exposed under three entry points:

- `@vrgl/vergil`
- `@vrgl/vergil/components`
- `@vrgl/vergil/utilities`

In addition, there are `/internal`-scoped entries that expose features internally used by Vergil, which could be useful in some cases:

- `@vrgl/vergil/internal`
- `@vrgl/vergil/internal/components`
- `@vrgl/vergil/internal/utilities`

Internal exports, however, should be used with care since they are not guaranteed to follow SemVer conventions as public exports do. Although breaking changes to internal features in non-major releases are expected to be rare, they could still occur. In general, simpler, more concrete features are less likely to change behavior.

Since internal exports are exposed mainly for convenience, they are not thoroughly documented, and no assumptions should be made about their behavior. Part of the reason some features are "internal" is that they are implemented specifically to address Vergil's requirements and may not meet the needs or expectations of all use cases. Developers should verify that an internal feature's implementation aligns with their specific requirements.

:::tip
In general, exports under [`/src/*/.internal/*`](https://github.com/8ctavio/vergil/tree/main/packages/vergil/src) are exposed in internal entries.
:::