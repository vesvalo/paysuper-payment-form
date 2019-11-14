<script>
import { get, find, reject } from 'lodash-es';
import getCardSystemType from '@/helpers/getCardSystemType';
import PaysystemIcon from '@/components/PaysystemIcon.vue';
import RemoveCountdown from '@/components/RemoveCountdown.vue';

export default {
  name: 'FormSectionSavedCards',

  components: {
    PaysystemIcon,
    RemoveCountdown,
  },

  model: {
    prop: 'selectedCardId',
    event: 'select',
  },

  props: {
    cards: {
      required: true,
      type: Array,
    },
    selectedCardId: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      cardsAboutToDelete: [],
    };
  },

  cssRules() {
    return {
      '.{title}': {
        color: this.$gui.formLabelColor,
      },
      '.{item}': {
        'background-color': this.$gui.savedCardsBackgroundColor,
        color: this.$gui.savedCardsTextColor,
      },
      '.{item}.{_selected}': {
        'background-color': this.$gui.savedCardsSelectedBackgroundColor,
        color: this.$gui.savedCardsSelectedTextColor,
      },
      '.{item}.{_removed}': {
        'background-color': this.$gui.savedCardsDeleteBackgroundColor,
        color: this.$gui.savedCardsDeleteTextColor,
      },
      '.{checkIcon}': {
        fill: this.$gui.savedCardsCheckIconColor,
      },
      '.{trash} > svg': {
        fill: this.$gui.savedCardsDeleteIconColor,
      },
    };
  },

  created() {
    this.$emit('select', this.cards[0].id);
  },

  methods: {
    getCardType({ pan }) {
      return getCardSystemType(pan.slice(0, 4));
    },
    getFormattedPan({ pan }) {
      const value = pan.replace('...', '******');
      let i = 0;
      return '#### #### #### ####'.replace(/#/g, () => {
        const result = value[i];
        i += 1;
        return result;
      });
    },

    selectedCard(id) {
      this.$emit('select', id);
    },

    toggleCardRemove({ id }) {
      const removedCard = find(this.cardsAboutToDelete, { id });
      if (removedCard) {
        clearTimeout(removedCard.timeout);
        this.cardsAboutToDelete = reject(this.cardsAboutToDelete, { id });

        if (!this.selectedCardId) {
          this.selectedCard(id);
        }
        return;
      }

      this.cardsAboutToDelete.push({
        id,
        timeout: setTimeout(() => {
          this.cardsAboutToDelete = reject(this.cardsAboutToDelete, { id });
          this.$emit('remove', id);
        }, 5000),
      });

      const availableCards = this.cards.filter((card) => {
        if (find(this.cardsAboutToDelete, { id: card.id })) {
          return false;
        }
        return true;
      });
      const cardToSelect = get(availableCards, '0.id', '');
      this.selectedCard(cardToSelect);
    },

    checkIsCardRemoved({ id }) {
      return !!find(this.cardsAboutToDelete, { id });
    },
    checkIsCardSelected({ id }) {
      return this.selectedCardId === id;
    },
  },
};
</script>

<template>
<div :class="$style.formSectionSavedCards">
  <div :class="$style.title">
    {{ $t('FormSectionSavedCards.title') }}
  </div>
  <div>
    <div
      v-for="card in cards"
      :key="card.id"
      :class="[$style.item, {
        [$style._selected]: checkIsCardSelected(card),
        [$style._removed]: checkIsCardRemoved(card)
      }]"
      @click="selectedCard(card.id)"
    >
      <div :class="$style.itemInner">
        <span :class="$style.icon">
          <PaysystemIcon
            v-if="!checkIsCardSelected(card) && !checkIsCardRemoved(card) && getCardType(card)"
            :class="$style.cardIcon"
            :type="getCardType(card)"
          />
          <IconCheck
            v-if="checkIsCardSelected(card)"
            :class="$style.checkIcon"
          />
          <RemoveCountdown
            v-if="checkIsCardRemoved(card)"
            :class="$style.removedIcon"
          />
        </span>
        <span :class="$style.text" v-if="checkIsCardRemoved(card)">
          {{ $t('FormSectionSavedCards.deletingCard') }}
        </span>
        <span :class="$style.pan" v-else>
          <span>
            {{ getFormattedPan(card) }}
          </span>
        </span>
      </div>
      <span
        :class="$style.trash"
        @click.stop="toggleCardRemove(card)"
      >
        <span v-if="checkIsCardRemoved(card)">
          {{ $t('FormSectionSavedCards.undo') }}
        </span>
        <IconTrash v-else />
      </span>
    </div>
  </div>
</div>
</template>

<style lang="scss" module>
.formSectionSavedCards {
  width: 100%;
  padding: 3px 0 18px;
}

.title {
  font-size: 13px;
  line-height: 18px;
  margin-bottom: 6px;
}

.item {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'PT Mono';
  font-size: 13px;
  line-height: 20px;

  &._selected {
    opacity: 1;
  }

  &._removed {
    opacity: 1;
  }

  & + & {
    margin-top: 2px;
  }
}

.itemInner {
  height: 100%;
  display: flex;
  align-items: center;
}

.icon {
  width: 38px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding-left: 2px;

  & > svg {
    max-width: 16px;
  }
}

.checkIcon {
  width: 16px;
  height: 16px;
}

.text {
}

.pan {
  direction: ltr;
}

.trash {
  box-sizing: border-box;
  padding: 0 14px;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .item._removed & {
  }
}
</style>
