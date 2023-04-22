# Get Started

## Installation

Currently, to use Vergil its repository must be added as a submodule to a monorepo. Then, with pnpm's workspace feature, Vergil can be regarded and used as a package inside the monorepo.

## Styles

Vergil has its own styles sheet that style custom components and the user interface overall look. To import Vergil's styles to the project being worked on, add the following at the beginning of the project's main css file.

```css
@import 'vergil/assets/main.css';
@import url("https://fonts.googleapis.com/icon?family=Material+Icons+Round");
```

The second import is required for icons to display properly.

The theme defined in the imported css file defaults to Vergil's color theme. To customize theme, overwrite [exisintg css variables](https://github.com/8ctavio/vergil/blob/main/packages/core/assets/main.css).

In order to avoid importing fonts that may ultimately not be used, Vergil's font-family css variables value is `initial`. Thus, these variables should always be overwritten with fonts of choice. An example of this is shown next.

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat');
@import url('https://fonts.googleapis.com/css2?family=Montserrat+Alternates');
@import url('https://fonts.googleapis.com/css2?family=Roboto');

:root{
    /* Overwrite css variables */
    --mainFont: 'Montserrat';
    --font1: 'Montserrat Alternates';
    --font2: 'Roboto';
}
```

:::tip
Use Vergil's css variables to style the underlying project Vergil is being used on.
:::