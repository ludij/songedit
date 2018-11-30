<template>
<div class="b-table">

    <b-loading :active="this.loading"></b-loading>

    <div class="table-wrapper">
        <table class="table is-narrow is-hoverable">
            <thead>

                <tr>
                    <th @click="sort($event, 'word')" class="has-pointer" :class="[{'is-current-sort' : currentSort == 'word' }, 'th-word-' + this.category]">
                        <div class="th-wrap">
                            Word <span class="icon is-small" :class=" 'is-' + currentSortDir " style="display: none;"><i class="mdi mdi-arrow-down"></i></span>
                        </div>
                    </th>
                    <th @click="sort($event, 'score')" class="has-pointer" :class="[{'is-current-sort' : currentSort == 'score' }, 'th-score-' + this.category]">
                        <div class="th-wrap">
                            Score <span class="icon is-small" :class=" 'is-' + currentSortDir "><i class="mdi mdi-arrow-down"></i></span>
                        </div>
                    </th>
                    <th @click="sort($event, 'numSyllables')" class="has-pointer" :class="[{'is-current-sort' : currentSort == 'numSyllables' }, 'th-numSyllables-' + this.category]">
                        <div class="th-wrap">
                            Length <span class="icon is-small" :class=" 'is-' + currentSortDir " style="display: none;"><i class="mdi mdi-arrow-down"></i></span>
                        </div>
                    </th>
                    <th @click="sort($event, 'tags')" class="has-pointer" :class="[{'is-current-sort' : currentSort == 'tags' }, 'th-tags-' + this.category]">
                        <div class="th-wrap">
                            Sort <span class="icon is-small" :class=" 'is-' + currentSortDir " style="display: none;"><i class="mdi mdi-arrow-down"></i></span>
                        </div>
                    </th>
                    <th @click="sort($event, 'pop')" class="has-pointer" :class="[{'is-current-sort' : currentSort == 'pop' }, 'th-pop-' + this.category]">
                        <div class="th-wrap">
                            Usage <span class="icon is-small" :class=" 'is-' + currentSortDir " style="display: none;"><i class="mdi mdi-arrow-down"></i></span>
                        </div>
                    </th>
                    <th @click="sort($event, 'defs')" class="has-pointer" :class="[{'is-current-sort' : currentSort == 'defs' }, 'th-defs-' + this.category]">
                        <div class="th-wrap">
                            Definition <span class="icon is-small" :class=" 'is-' + currentSortDir " style="display: none;"><i class="mdi mdi-arrow-down"></i></span>
                        </div>
                    </th>
                </tr>
            </thead>

            <tbody>

                <tr v-if="!sortedResults.length && !this.loading">
                    <td colspan="6" class="has-text-centered">
                        <span>
                            No results
                            <span class="icon is-small"><i class="mdi mdi-emoticon-sad"></i></span>
                        </span>
                    </td>
                </tr>

                    <tr else v-for="(item, index) in sortedResults" :key="index" @click="copyWord">

                        <td>
                            <span class="word has-pointer">{{item.word}}</span>
                        </td>

                        <td>
                            <span class="has-pointer" v-if="isMobile">{{item.score | convertToPercentage}}%</span>
                            <progress v-else class="progress is-small show-value has-pointer" :value="item.score | convertToPercentage" max="100"></progress>

                        </td>

                        <td>
                            <span class="has-pointer">{{item.numSyllables}}</span>
                        </td>

                        <td>
                            <div class="tags">
                                <span class="tag has-pointer" v-for="(item, index) in item.tags" :key="index">{{item}}</span>
                                <span v-if="item.tags.length == 0" class="tag has-pointer">?</span>
                            </div>
                        </td>

                        <td>
                            <span class="has-pointer" v-if="isMobile">{{item.pop | convertToPercentage}}%</span>
                            <progress v-else class="progress is-small show-value has-pointer" :value="item.pop | convertToPercentage" max="100"></progress>

                        </td>

                        <td>
                            <b-tooltip :label="item.defs || 'No definition found'" class="has-pointer" type="is-light" position="is-left" size="is-large" multilined animated>
                                See
                            </b-tooltip>
                        </td>
                    </tr>

            </tbody>
        </table>
    </div>
</div>
</template>

<script>
export default {
  name: "suggestionscontent",
  props: {
    category: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: false
    },
    loading: {
      type: Boolean,
      required: false
    }
  },
  data: function() {
    return {
      isMobile: false,
      currentSort: "score",
      currentSortDir: "desc"
    };
  },
  filters: {
    convertToPercentage: function(value) {
      if (value >= 100) {
        return 100;
      } else {
        return value;
      }
    }
  },
  methods: {
    handleWindowSizeChange: function() {
      if (window.innerWidth < 768) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    },
    copyWord: function(e) {
      var el = document.createElement("textarea");
      el.value = e.target.closest("tr").querySelector("span.word").innerHTML;
      el.style = {
        position: "absolute",
        left: "-9999px"
      };
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      this.$toast.open({
        message: `"${el.value}" copied to clipboard`,
        position: "is-bottom",
        duration: 1000,
        type: "is-white"
      });
    },
    sort: function(e, column) {
      this.loadingChangeTo(true);
      if (column === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      } else {
        document.querySelector(
          `.th-${this.currentSort}-${this.category}`
        ).firstElementChild.firstElementChild.style.display =
          "none";
        e.target.closest("th").querySelector("span.icon").style.display =
          "inherit";
        this.currentSort = column;
      }
      this.loadingChangeTo(false);
    },
    loadingChangeTo(value) {
      let data = {};
      data[this.category] = value;
      this.$root.$emit("loading", data);
    }
  },
  computed: {
    sortedResults: function() {
      return this.data.slice().sort((a, b) => {
        let modifier = 1;
        if (this.currentSortDir === "desc") modifier = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    }
  },
  mounted: function() {
    addEventListener("resize", this.handleWindowSizeChange);
    if (window.innerWidth < 767) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  },
  destroyed() {
    removeEventListener("resize", this.handleWindowSizeChange);
  }
};
</script>

<style scoped>
td * {
  transition: all 500ms ease-in-out;
}

progress.is-small {
  top: 5px;
}

progress.show-value {
  position: relative;
  color: white;
}

progress.show-value:after {
  content: attr(value) "%";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: calc(1rem / 1.5);
  line-height: 1rem;
}

progress.show-value.is-small:after {
  font-size: calc(1.1rem / 1.5);
  line-height: 0.75rem;
}

progress.show-value.is-medium:after {
  font-size: calc(1.25rem / 1.5);
  line-height: 1.25rem;
}

progress.show-value.is-large:after {
  font-size: calc(1.5rem / 1.5);
  line-height: 1.5rem;
}
</style>
