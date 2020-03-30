/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import LayoutHeader from '@/components/LayoutHeader.vue';
import LayoutContent from '@/components/LayoutContent.vue';
import LayoutFooter from '@/components/LayoutFooter.vue';

storiesOf('Page', module)
  .add('default', () => ({
    components: { LayoutHeader, LayoutContent, LayoutFooter },
    data() {
      return {
        isCartOpened: true,
      };
    },
    template: `
      <div>
        <LayoutHeader
          projectName="Test"
        />
      
        <LayoutContent :isCartOpened="isCartOpened">
          <div slot="cart" style="height: 200px">111</div>
          <div slot="form" style="height: 200px">222</div>
        </LayoutContent>
      
        <LayoutFooter />
      </div>
    `,
  }))
  .add('longProjectName', () => ({
    components: { LayoutHeader, LayoutContent, LayoutFooter },
    data() {
      return {
        isCartOpened: true,
      };
    },
    template: `
      <div>
        <LayoutHeader
          projectName="ProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProjectProject"
        />
      
        <LayoutContent :isCartOpened="isCartOpened">
          <div slot="cart" style="height: 200px">111</div>
          <div slot="form" style="height: 200px">222</div>
        </LayoutContent>
      
        <LayoutFooter />
      </div>
    `,
  }))
  .add('loading', () => ({
    components: { LayoutHeader, LayoutContent, LayoutFooter },
    data() {
      return {
        isCartOpened: true,
      };
    },
    template: `
      <div>
        <LayoutHeader
          projectName="Test"
          :isLoading="true"
        />
      
        <LayoutContent :isLoading="true">
          <div slot="cart" style="height: 200px">111</div>
          <div slot="form" style="height: 200px">222</div>
        </LayoutContent>
      
        <LayoutFooter :isLoading="true" />
      </div>
    `,
  }))
  .add('cart open', () => ({
    components: { LayoutHeader, LayoutContent, LayoutFooter },
    data() {
      return {
        isCartOpened: true,
      };
    },
    template: `
      <div>
        <LayoutHeader
          projectName="Test"
          :isCartOpened="isCartOpened"
          @toggleCart="isCartOpened = !isCartOpened"
        />
      
        <LayoutContent :isCartOpened="isCartOpened">
          <div slot="cart" style="height: 200px">111</div>
          <div slot="form" style="height: 200px">222</div>
        </LayoutContent>
      
        <LayoutFooter />
      </div>
    `,
  }));
