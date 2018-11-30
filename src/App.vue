<template>
<div id="app" class=is-flex>
    <MainNav />
    <router-view />
</div>
</template>

<script>
import MainNav from "@/components/MainNav.vue";

export default {
  name: "app",
  components: {
    MainNav
  }
};
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

$primary: #2b3849;
$primary-invert: findColorInvert($primary);
$light: #f7f7f7;
$light-invert: findColorInvert($light);
$dark: #3d4756;
$dark-invert: findColorInvert($dark);
$warning: #873b4b;
$warning-invert: findColorInvert($warning);

$colors: (
  "white": (
    $white,
    $black
  ),
  "black": (
    $black,
    $white
  ),
  "light": (
    $light,
    $light-invert
  ),
  "dark": (
    $dark,
    $dark-invert
  ),
  "primary": (
    $primary,
    $primary-invert
  ),
  "info": (
    $info,
    $info-invert
  ),
  "success": (
    $success,
    $success-invert
  ),
  "warning": (
    $warning,
    $warning-invert
  ),
  "danger": (
    $danger,
    $danger-invert
  )
);
$body-background-color: $light;

$link: $dark;
$link-invert: $dark-invert;
$link-hover: $dark;
$link-focus-border: $primary;

$family-primary: "Inconsolata", monospace;
$family-secondary: "Bowlby One SC", cursive;

html {
  height: 100%;
}
body {
  background-image: radial-gradient($light, $white);
  height: auto;
  min-height: 100%;
  width: 100vw;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

#app {
  min-height: 100vh;
}

// Logo stuff
h1 {
  font-family: $family-secondary;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-bottom: 0 !important;
}

.logo-wrapper:hover > h1 {
  color: $link-hover;
}

.logo-wrapper svg.logo {
  margin-right: 0.437em;
  margin-block-start: 0;
  margin-block-end: 0;
}

.logo-wrapper svg.logo path {
  stroke: none;
  fill-rule: nonzero;
  fill: $primary;
  fill-opacity: 1;
}

.logo-wrapper:hover > svg.logo path {
  fill: $dark;
}

.logo-wrapper:hover > svg.logo path:first-child {
  fill: $link-hover;
}

$title-color: $primary;

.logo-wrapper .logo-dot {
  color: $primary-invert !important;
  text-shadow: -2px -2px 0 $primary, 2px -2px 0 $primary, -2px 2px 0 $primary,
    2px 2px 0 $primary;
  transform: translateX(-36px);
}

.logo-wrapper:hover > .logo-dot {
  text-shadow: -2px -2px 0 $dark, 2px -2px 0 $dark, -2px 2px 0 $dark,
    2px 2px 0 $dark;
}

small.logo-space {
  font-size: 0.437em;
}

// Editor stuff
input[name="song-title"],
textarea[name="song-lyrics"] {
  width: 100%;
  border: 0 !important;
  box-shadow: none !important;
  color: $primary;
  background-color: white;
  overflow-y: hidden;
}

input[name="song-title"] {
  font-family: $family-secondary;
}

textarea[name="song-lyrics"] {
  height: auto;
}

input[name="song-title"]:focus,
textarea[name="song-lyrics"]:focus {
  outline: 0;
  box-shadow: none !important;
}

::selection {
  background: $primary;
  color: $white;
}
::-moz-selection {
  background: $primary;
  color: $white;
}

// Suggestions table stuff
.table thead th.is-current-sort {
  color: $link;
}

// Toasts
.notices .toast {
  border-radius: 4px !important;
  padding: 0.625em !important;
  opacity: 1 !important;
}

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
