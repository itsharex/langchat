<!--
  - Copyright (c) 2024 LangChat. TyCoding All Rights Reserved.
  -
  - Licensed under the GNU Affero General Public License, Version 3 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     https://www.gnu.org/licenses/agpl-3.0.html
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<script lang="ts" setup>
  import Editor from '@/components/editor/index.vue';
  import MarkdownIt from 'markdown-it';
  import hljs from 'highlight.js';
  import mila from 'markdown-it-link-attributes';
  import mdKatex from '@traptitech/markdown-it-katex';
  import { ref } from 'vue';
  import { SvgIcon } from '@/components/common';
  import Card from '@/views/modules/write/Card.vue';
  import { genWrite } from '@/api/chat';
  import { useMessage } from 'naive-ui';
  import { useChatStore } from '@/views/modules/chat/store/useChatStore';
  import ModelProvider from '@/views/modules/common/ModelProvider.vue';
  import { isBlank } from '@/utils/is';

  const chatStore = useChatStore();
  const ms = useMessage();
  const editorRef = ref();
  const mdi = new MarkdownIt({
    html: false,
    linkify: true,
    highlight(code, language) {
      return hljs.highlightAuto(code).value;
    },
  });
  mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } });
  mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' });
  const text = ref('');
  const genText = ref('');
  const loading = ref(false);

  async function onGenerate() {
    if (isBlank(text.value)) {
      ms.error('请输入内容');
      return;
    }
    loading.value = true;
    await genWrite(
      {
        message: text.value,
        modelId: chatStore.modelId,
        modelName: chatStore.modelName,
        modelProvider: chatStore.modelProvider,
      },
      ({ event }) => {
        const list = event.target.responseText.split('\n\n');
        let content = '';
        list.forEach((i: any) => {
          if (!i.startsWith('data:{')) {
            return;
          }
          const { done, message } = JSON.parse(i.substring(5, i.length));
          if (done) {
            ms.success('生成结束');
          } else {
            content += message;
            genText.value = mdi.render(content);
          }
        });
      }
    )
      .catch(() => {})
      .finally(() => (loading.value = false));
  }
</script>

<template>
  <div class="flex gap-2 h-full">
    <div class="flex-1">
      <div class="m-2 flex gap-2 items-center">
        <ModelProvider />
        <n-input
          v-model:value="text"
          class="!rounded-3xl px-4 py-1"
          placeholder="请简单描述想要生成的文章内容"
        />
        <n-button
          :loading="loading"
          class="!rounded-3xl"
          size="large"
          type="primary"
          @click="onGenerate"
        >
          <template #icon>
            <SvgIcon icon="mdi:sparkles-outline" />
          </template>
          生成
        </n-button>
      </div>
      <Editor ref="editorRef" :text="genText" class="" />
    </div>
    <div class="w-1/3 h-full border-l">
      <Card />
    </div>
  </div>
</template>

<style lang="less" scoped></style>
