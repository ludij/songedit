<template>
<div class="b-table" data-v-0b9f3ffb="">
    <b-loading :active.sync="this.loading"></b-loading>

    <div class="table-wrapper">

        <table class="table is-narrow is-hoverable">
            <thead>

                <tr>
                    <th @click="sort($event, 'sort')" class="has-pointer" :class="[{'is-current-sort' : currentSort == 'sort' }, 'th-sort-' + this.category]">
                        <div class="th-wrap">
                            Sort <span class="icon is-small" :class=" 'is-' + currentSortDir "><i class="mdi mdi-arrow-down"></i></span>
                        </div>
                    </th>
                    <th @click="sort($event, 'def')" class="has-pointer" :class="[{'is-current-sort' : currentSort == 'def' }, 'th-def-' + this.category]">
                        <div class="th-wrap">
                            Definition <span class="icon is-small" :class=" 'is-' + currentSortDir " style="display: none;"><i class="mdi mdi-arrow-down"></i></span>
                        </div>
                    </th>
                </tr>
            </thead>

            <tbody>

                <tr v-if="!sortedResults.length && !this.loading">
                    <td colspan="2" class="has-text-centered">
                        <span>
                            No results
                            <span class="icon is-small"><i class="mdi mdi-emoticon-sad"></i></span>
                        </span>
                    </td>
                </tr>

                <tr else v-for="(item, index) in sortedResults" :key="index">

                    <td>
                        <span class="tag">{{item.sort || "?"}}</span>
                    </td>

                    <td>
                        <span>{{item.def}}</span>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</div>
</template>

<script>
export default {
  name: "suggestionsdefinitions",
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
      currentSort: "sort",
      currentSortDir: "desc"
    };
  },
  methods: {
    handleWindowSizeChange: function() {
      if (window.innerWidth < 768) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    },
    sort: function(e, column) {
      this.loadingChangeTo(true);
      if (column === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      } else {
        document
          .querySelector(`.th-${this.currentSort}-${this.category}`)
          .querySelector("span.icon").style.display =
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
