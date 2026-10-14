## Features

- Display a fixed number of themes as buttons
- Show remaining themes inside a popover
- Highlight active theme
- Mark Pro-only themes with badge / lock
- Optional tooltip support
- Fully controlled component

## Installation / Import

```js
import ThemeSwitcher from "./ThemeSwitcher";
Make sure the following dependencies are available:

@wordpress/components
@wordpress/element
@wordpress/i18n
```

## Basic Usage

```js
<ThemeSwitcher
  themes={toolTipPresets}
  value={theme}
  isPro={isPremium}
  visibleCount={7}
  buttonLabel="More Themes"
  onChange={(val) => {
    // your custom logic here
  }}
/>
```

## Props

| Prop           | Type       | Default         | Description                       |
| -------------- | ---------- | --------------- | --------------------------------- |
| `themes`       | `Array`    | `[]`            | List of available themes          |
| `value`        | `string`   | `"default"`     | Currently selected theme value    |
| `onChange`     | `function` | `() => {}`      | Callback when a theme is selected |
| `visibleCount` | `number`   | `5`             | Number of themes shown as buttons |
| `buttonLabel`  | `string`   | `"More Themes"` | Label for popover trigger         |
| `isPro`        | `boolean`  | `false`         | Whether user has Pro access       |
| `isTooltip`    | `boolean`  | `false`         | Enable tooltip on theme buttons   |

## Theme Object Structure

Each theme must follow this structure:

```js
{
  label: "Theme Name",
  value: "theme1",
  tooltip: "Optional tooltip text",
  isPro: false
}

```

## Theme Object Fields

| Field     | Required | Description                             |
| --------- | -------- | --------------------------------------- |
| `label`   | ✅       | Display name                            |
| `value`   | ✅       | Unique identifier                       |
| `tooltip` | ❌       | Tooltip text (used if `isTooltip=true`) |
| `isPro`   | ❌       | Marks theme as Pro                      |
