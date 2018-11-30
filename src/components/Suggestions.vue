<template>
<b-tabs class="suggestions" position="is-centered">

    <b-tab-item label="Rhymes" position="is-centered">
        <template slot="header" @click="this.scrollToTop">
            Rhymes
            <b-tag v-if="suggestions.rhymes && suggestions.rhymes.length" rounded>
                {{suggestions.rhymes.length}}
            </b-tag>
            <b-tag v-else rounded>
                0
            </b-tag>
        </template>

        <SuggestionsContent category="rhymes" :data="suggestions.rhymes" :loading="loading.rhymes" />

    </b-tab-item>

    <b-tab-item label="Synonyms" position="is-centered">
        <template slot="header">
            Synonyms
            <b-tag v-if="suggestions.synonyms && suggestions.synonyms.length" rounded>
                {{suggestions.synonyms.length}}
            </b-tag>
            <b-tag v-else rounded>
                0
            </b-tag>
        </template>

        <SuggestionsContent category="synonyms" :data="suggestions.synonyms" :loading="loading.synonyms" />

    </b-tab-item>

    <b-tab-item label="Related" position="is-centered">
        <template slot="header">
            Related
            <b-tag v-if="suggestions.related && suggestions.related.length" rounded>
                {{suggestions.related.length}}
            </b-tag>
            <b-tag v-else rounded>
                0
            </b-tag>
        </template>

        <SuggestionsContent category="related" :data="suggestions.related" :loading="loading.related" />

    </b-tab-item>

    <b-tab-item label="Definitions" position="is-centered">
        <template slot="header">
            Definitions
            <b-tag v-if="suggestions.definitions && suggestions.definitions.length" rounded>
                <!-- <b-loading :active.sync="this.loading.definitions"></b-loading> -->
                {{suggestions.definitions.length}}
            </b-tag>
            <b-tag v-else rounded>
                0
            </b-tag>
        </template>

        <SuggestionsDefinitions category="definitions" :data="suggestions.definitions" :loading="loading.definitions" />

    </b-tab-item>
</b-tabs>
</template>

<script>
import SuggestionsContent from "@/components/SuggestionsContent.vue";
import SuggestionsDefinitions from "@/components/SuggestionsDefinitions.vue";

export default {
  name: "suggestions",
  components: {
    SuggestionsContent,
    SuggestionsDefinitions
  },
  props: {
    suggestions: {
      type: Object,
      required: false
    },
    loading: {
      type: Object,
      required: false
    }
  },
  updated: function() {
    this.scrollToTop();
  },
  methods: {
    scrollToTop: function() {
      for (let item of document.getElementsByClassName("tab-content")) {
        item.scrollTop = 0;
      }
    }
  }
};
</script>

<style>
.b-tabs.suggestions {
  position: fixed;
  bottom: 0px;
  height: auto;
  max-height: 50vh;
  overflow: hidden;
  margin: auto;
  width: calc(100% - 48px);
  max-width: 720px;
  padding: 0;
  background-color: #f7f7f7;
  padding-top: 0.625em;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.b-tabs.suggestions .tabs {
  margin: 0 0.625em;
}

.b-tabs.suggestions .tabs li {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.b-tabs.suggestions .b-table .table {
  overflow: hidden !important;
  height: 105%;
}

.b-tabs.suggestions .tab-content {
  padding: 0.625rem;
  height: calc(50vh - 6.25em);
  overflow: scroll;
}

.b-tabs.suggestions .table thead td,
.b-tabs.suggestions .table thead th {
  border-bottom-width: 1px;
}

.b-tabs.suggestions .b-table .table th.is-current-sort {
  border-color: #2c4c5b;
}

.b-tabs.suggestions .b-table .table.has-mobile-cards tr:not([class*="is-"]) {
  background-color: #ffffff;
}

.b-tabs.suggestions li.is-active {
  background-color: white;
}

.b-tabs.suggestions th,
.b-tabs.suggestions .b-table .table th,
.b-tabs.suggestions .b-table .table th.is-current-sort {
  font-weight: 400;
}

.b-tabs.suggestions .b-table .table th .th-wrap {
  display: flex;
  justify-content: space-between;
}
</style>
