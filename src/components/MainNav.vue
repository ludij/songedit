<template>
<transition name="slide">
    <nav id="main-nav" class="navbar" role="navigation" v-show="showNav">

        <div class="navbar-brand">
            <Logo />

            <a role="button" class="navbar-burger burger" @click="showMenu = !showMenu" :class="{ 'is-active': showMenu }">
                <span></span>
                <span></span>
                <span></span>
            </a>

        </div>

        <div class="navbar-menu" :class="{ 'is-active': showMenu }">

            <div class="navbar-end">

                <a class="navbar-item" @click="exportToFile">
                    Export
                </a>

            </div>
        </div>

    </nav>

</transition>
</template>


<script>
import Logo from "@/components/Logo.vue";

export default {
  name: "mainNav",
  components: {
    Logo
  },
  data: function() {
    return {
      showNav: true,
      showMenu: false,
      lastPosition: 0,
      timer: undefined
    };
  },
  methods: {
    handleScroll() {
      let currentPosition = window.pageYOffset;
      if (currentPosition < this.lastPosition) {
        this.showNav = true;
      }
      if (currentPosition > this.lastPosition) {
        this.showNav = false;
      }
      this.timeoutNavHide();
      this.lastPosition = currentPosition;
    },
    handleMouseMove(e) {
      if (e.clientY < 52) {
        this.showNav = true;
        this.timeoutNavHide();
      }
    },
    timeoutNavHide() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showNav = false;
      }, 5000);
    },
    exportToFile() {
      const title = document.querySelector("input[name=song-title]").value;
      const textareas = document.getElementsByTagName("textarea");
      let lyricsHtml = `<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="utf-8">
                <title>${title}</title>
                </head>
                <body>
                    <h1>${title}</h1>`;

      for (var item of textareas) {
        lyricsHtml += `<br><p>${item.value.replace(/\n/g, "<br>")}</p>`;
      }
      lyricsHtml += `</body></html>`;

      const date = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}_${new Date().getHours()}-${new Date().getMinutes()}`;

      var doc = new jsPDF();
      doc.fromHTML(lyricsHtml, 15, 20, {
        width: 170
      });
      doc.save(`${title}_${date}.pdf`);
    }
  },
  mounted: function() {
    addEventListener("scroll", this.handleScroll);
    addEventListener("mousemove", e => {
      this.handleMouseMove(e);
    });
    this.$root.$on("showNav", data => {
      this.showNav = data;
    });
    this.timeoutNavHide();
  },
  destroyed() {
    removeEventListener("scroll", this.handleScroll);
    removeEventListener("mousemove", this.handleMouseMove);
    clearTimeout(this.timer);
  }
};
</script>

<style>
#main-nav {
  position: fixed;
  z-index: 1000;
  width: 100%;
  top: 0;
  left: 0;
}

.navbar-brand {
  display: flex;
  width: 100%;
  justify-content: center;
}

@media screen and (min-width: 1088px) {
  .navbar-menu {
    margin-left: -100%;
  }
}

.slide-enter-active {
  transition: all 0.5s ease-in-out;
}

.slide-leave-active {
  transition: all 1s ease-in-out;
}

.slide-enter,
.slide-leave-to {
  transform: translateY(-52px);
  opacity: 0;
}
</style>
