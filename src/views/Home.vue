<template>
<section class="section main has-text-centered">
    <input name="song-title" type="text" placeholder="Song Title" id="song-title" class="input is-size-4" />
    <br />
    <br />

    <textarea name="song-lyrics" @click.prevent="checkSelection($event);showNav();" @keyup.prevent="checkSelection($event); checkContent($event); showNav();" placeholder="Start your lyrics here" id="lyrics-area" class="textarea has-fixed-size is-size-5"
        rows="1">
            </textarea>
    <br />

    <template v-for="(textarea, index) in textareas">
        <div class="textarea-wrapper" :key="index">
            <textarea name="song-lyrics" @click.prevent="checkSelection($event);showNav();" @keyup.prevent="checkSelection($event); checkContent($event); showNav();" placeholder="" :id=" 'textarea' + index " class="textarea has-fixed-size is-size-5"
                rows="1">
                </textarea>
            <a class="delete is-small" href="javascript:;" @click="checkTextarea(index)"></a>
            <br />
        </div>

    </template>

    <div @click="addTextarea" class="has-pointer change-margin" :class="{ 'add-margin-bottom' : showSuggestions}">
        <a class="delete is-small plus" href="javascript:;"></a>
    </div>
    <br />
    <br />


    <transition name="slide-suggestions">
        <Suggestions :suggestions="suggestions" :loading="loading" v-show="showSuggestions" />
    </transition>

    <div class="modal">
        <div class="modal-background"></div>
        <div class="modal-content">
        </div>
        <button class="modal-close is-large" aria-label="close"></button>
    </div>

</section>
</template>

<script>
import Suggestions from "@/components/Suggestions.vue";
import axios from "axios";

export default {
  name: "home",
  components: {
    Suggestions
  },
  data: function() {
    return {
      textareas: [],
      showSuggestions: false,
      loading: {
        rhymes: false,
        synonyms: false,
        related: false,
        definitions: false
      },
      suggestions: {
        rhymes: [],
        synonyms: [],
        related: [],
        definitions: []
      },
      lastScrollPosition: 0
    };
  },
  methods: {
    addTextarea() {
      this.textareas.push({});
    },
    checkTextarea(index) {
      const _this = this;
      if (!document.getElementsByTagName("textarea")[index + 1].value.length) {
        _this.textareas.splice(index, 1);
      } else {
        this.confirm(index);
      }
    },
    confirm(index) {
      this.textareas.splice(index, 1);

      this.$dialog.confirm({
        message: "There's still text in this part. Delete anyway?",
        cancelText: "Cancel",
        confirmText: "Delete",
        onConfirm: () => this.textareas.splice(index, 1)
      });
    },
    checkContent($event) {
      this.showSuggestions = false; // false
      $event.target.rows = ($event.target.scrollHeight - 25) / 30;
      $event.target.style.height = $event.target.scrollHeight - 30 + "px";
      $event.target.style.height = $event.target.scrollHeight + "px";
    },
    checkSelection($event) {
      this.lastTextareaPosition = $event.target.scrollTop;
      const _this = this;
      $event.target.oncontextmenu = function() {
        return false;
      };
      if ($event.target.selectionStart != $event.target.selectionEnd) {
        var selectedtext = encodeURIComponent(
          $event.target.value.substring(
            $event.target.selectionStart,
            $event.target.selectionEnd
          )
        );

        _this.getRhymes(selectedtext);
        _this.showSuggestions = true;
      }
    },
    getRhymes(value) {
      const _this = this;

      this.loading.rhymes = true;
      this.loading.synonyms = true;
      this.loading.related = true;
      this.loading.definitions = true;

      Promise.all([
        axios.get(
          `https://api.datamuse.com/words?rel_rhy=${value}&md=dpsf&max=1000`
        ),
        axios.get(
          `https://api.datamuse.com/words?rel_nry=${value}&md=dpsf&max=1000`
        )
      ])
        .then(function(responses) {
          _this.suggestions.rhymes = _this.cleanUpResult(
            responses[1].data.concat(responses[0].data)
          );
          _this.loading.rhymes = false;
          // console.log("success in rhymes!");
        })
        .catch(() => {
          // console.log("error in rhymes: ", error);
          _this.loading.rhymes = false;
        });

      Promise.all([
        axios.get(
          `https://api.datamuse.com/words?rel_syn=${value}&md=dpsf&max=1000`
        ),
        axios.get(
          `https://api.datamuse.com/words?rel_spc=${value}&md=dpsf&max=1000`
        )
      ])
        .then(responses => {
          _this.suggestions.synonyms = _this.cleanUpResult(
            responses[1].data.concat(responses[0].data)
          );
          _this.loading.synonyms = false;
          // console.log("success in synonyms!");
        })
        .catch(() => {
          // console.log("error in synonyms: ", error);
          _this.loading.synonyms = false;
        });

      Promise.all([
        axios.get(
          `https://api.datamuse.com/words?rel_jja=${value}&md=dpsf&max=1000`
        ),
        axios.get(
          `https://api.datamuse.com/words?rel_jjb=${value}&md=dpsf&max=1000`
        ),
        axios.get(
          `https://api.datamuse.com/words?rel_trg=${value}&md=dpsf&max=1000`
        )
      ])
        .then(responses => {
          _this.suggestions.related = _this.cleanUpResult(
            responses[2].data.concat(
              responses[1].data.concat(responses[0].data)
            )
          );
          _this.loading.related = false;
          // console.log("success in related!");
        })
        .catch(() => {
          // console.log("error in related: ", error);
          _this.loading.related = false;
        });

      axios
        .get(`https://api.datamuse.com/words?sp=${value}&md=dpsf&max=1000`)
        .then(response => {
          _this.suggestions.definitions = _this.cleanUpDefs(
            response.data,
            value
          );
          _this.loading.definitions = false;
          // console.log("success in definitons!");
        })
        .catch(() => {
          // console.log("error in definitions: ", error);
          _this.loading.definitions = false;
        });
    },
    cleanUpDefs(apiData, value) {
      if (!apiData.length || !apiData[0].defs) {
        return [];
      }
      return apiData.filter(item => item.word == value)[0].defs.map(item => {
        let newDefs = {
          sort: "",
          def: ""
        };
        if (item.startsWith("v")) {
          newDefs.sort = "Verb";
          newDefs.def =
            item
              .substring(2)
              .charAt(0)
              .toUpperCase() + item.slice(3);
        }
        if (item.startsWith("n")) {
          newDefs.sort = "Noun";
          newDefs.def =
            item
              .substring(2)
              .charAt(0)
              .toUpperCase() + item.slice(3);
        }
        if (item.startsWith("adj")) {
          newDefs.sort = "Adj.";
          newDefs.def =
            item
              .substring(2)
              .charAt(0)
              .toUpperCase() + item.slice(3);
        }
        if (item.startsWith("adv")) {
          newDefs.sort = "Adv.";
          newDefs.def =
            item
              .substring(2)
              .charAt(0)
              .toUpperCase() + item.slice(3);
        }
        return newDefs;
      });
    },
    cleanUpResult(apiData) {
      return apiData.map(item => {
        let newDefs;
        let newTags;
        let newPop = "";
        if (item.defs) {
          newDefs = item.defs
            .map(def => {
              if (def.startsWith("v")) {
                def = `Verb: ${def.substring(2)}`;
              }
              if (def.startsWith("n")) {
                def = `Noun: ${def.substring(2)}`;
              }
              if (def.startsWith("adj")) {
                def = `Adj.: ${def.substring(4)}`;
              }
              if (def.startsWith("adv")) {
                def = `Adv.: ${def.substring(4)}`;
              }
              return def;
            })
            .join(" | ");
        }
        if (item.tags) {
          newTags = item.tags
            .map(tag => {
              if (tag.startsWith("adj")) {
                return (tag = "Adj.");
              }
              if (tag.startsWith("adv")) {
                return (tag = "Adv.");
              }
              if (tag.startsWith("n")) {
                return (tag = "Noun");
              }
              if (tag.startsWith("v")) {
                return (tag = "Verb");
              }
            })
            .filter(tag => tag);
          newPop = Math.round(
            parseFloat(
              item.tags
                .filter(tag => {
                  if (tag.startsWith("f")) {
                    return tag;
                  }
                })[0]
                .substring(2)
            ) / 5
          );
        }
        if (!item.score) {
          item = {
            ...item,
            score: "0"
          };
        }
        return (item = {
          ...item,
          defs: newDefs,
          tags: newTags,
          pop: newPop
        });
      });
    },
    showNav() {
      this.$root.$emit("showNav", false);
    }
  },
  mounted: function() {
    this.$root.$on("loading", data => {
      this.loading = {
        ...this.loading,
        ...data
      };
    });
  }
};
</script>

<style>
.main {
  max-width: 100%;
  width: 768px;
  margin: auto;
  padding-top: 80px;
}

.textarea-wrapper {
  position: relative;
}

.textarea-wrapper:focus .delete,
.textarea-wrapper:hover .delete {
  opacity: 1;
}

.textarea-wrapper .delete {
  opacity: 0;
  display: inline-block;
  position: absolute;
  right: 0.625rem;
  top: 0.625rem;
  transition: all 500ms ease-in-out;
}

.plus {
  transform: rotate(45deg);
  margin: auto;
}

.has-pointer {
  cursor: pointer;
}

.has-pointer:hover a {
  background-color: rgba(10, 10, 10, 0.3);
}

.slide-suggestions-enter-active {
  transition: all 0.5s ease-in-out;
}

.slide-suggestions-leave-active {
  transition: all 1s ease-in-out;
}

.slide-suggestions-enter,
.slide-suggestions-leave-to {
  transform: translateY(50vh);
  opacity: 0;
}

.change-margin {
  margin-bottom: 0;
  transition: all 1s ease-in-out;
}

.add-margin-bottom {
  transition: all 0.5s ease-in-out;
  margin-bottom: 50vh;
}
</style>
