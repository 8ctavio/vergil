# Vergil 💚🪠

Vergil is a Vue Web Application Development Framework that provides components, composables and utility functions aimed to simplify and hasten application development while improving DX and UX.

## Installation

See [Installing a Package](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package)

1. [Authenticate to GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages)

2. In the same directory as the project's package.json file, create or edit an `.npmrc` file to include a line specifying GitHub Packages URL and the namespace where the package is hosted:

```cmd
@8ctavio:registry = https://npm.pkg.github.com
```

3. Install dependency:

```cmd
pnpm add @8ctavio/vergil
```

## Use as submodule

Vergil might be added as a submodule to a pnpm monorepo. With pnpm's workspace feature, Vergil can be regarded and used as a package inside the monorepo.