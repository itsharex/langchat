import { defineStore } from 'pinia';
import {
  add as addConversations,
  del as delConversations,
  getMessages,
  list as getConversations,
  update as updateConversations,
} from '@/api/conversation';
import { ChatState } from './chat';
import { formatToDateTime } from '@/utils/dateUtil';
import { toRaw } from 'vue';

export const useChatStore = defineStore('chat-store', {
  state: (): ChatState =>
    <ChatState>{
      model: 'gpt-4o',
      active: '',
      isEdit: '',
      isGoogleSearch: false,
      siderCollapsed: true,
      sideIsLoading: true,
      chatIsLoading: true,
      conversations: [],
      curConversation: undefined,
      messages: [],
    },

  getters: {},

  actions: {
    setSiderCollapsed(collapsed: boolean) {
      this.siderCollapsed = collapsed;
    },
    async setActive(id: string) {
      this.active = id;
    },
    async setEdit(id: string) {
      this.isEdit = id;
    },

    /**
     * init conversation list and messages
     */
    async loadData() {
      try {
        const data = await getConversations({});
        if (data && data.length > 0) {
          this.conversations = data;
          this.curConversation = data[0];
          await this.selectConversation({ id: data[0].id });
        }
      } finally {
        this.sideIsLoading = false;
        this.chatIsLoading = false;
      }
    },

    /**
     * 选择会话窗口
     */
    async selectConversation(params: any) {
      console.log('选择窗口');
      this.chatIsLoading = true;
      this.messages = [];
      if (params.id == undefined) {
        return;
      }
      if (this.active !== '') {
        getMessages(params.id)
          .then((res: any) => {
            this.messages = res.reverse();
          })
          .finally(() => {
            this.chatIsLoading = false;
          });
      }
      await this.setActive(params.id);
      await this.setEdit('');
      this.curConversation = params;
      this.chatIsLoading = false;
    },

    /**
     * 添加会话窗口
     */
    async addConversation(params: any) {
      await addConversations(params);
      await this.loadData();
    },

    /**
     * 更新会话信息
     */
    async updateConversation(params: any) {
      await updateConversations(toRaw(params));
      await this.setEdit('');
      await this.loadData();
    },

    /**
     * 删除会话窗口
     */
    async delConversation(id: string) {
      await delConversations(id);
      await this.setActive('');
      await this.loadData();
    },

    /**
     * 新增消息
     */
    async addMessage(message: string, role: 'user' | 'assistant' | 'system', chatId: string) {
      const data = {
        chatId,
        conversationId: this.curConversation?.id,
        role: role,
        message,
        model: this.model,
        createTime: formatToDateTime(new Date()),
      };
      this.messages.push(data);
      return data;
    },

    /**
     * 更新消息
     */
    async updateMessage(chatId: string | undefined, message: string, isError?: boolean) {
      const index = this.messages.findIndex((item) => item?.chatId == chatId);
      if (index !== -1) {
        this.messages[index].message = message;
        this.messages[index].isError = isError;
      }
    },

    /**
     * 删除消息
     */
    async delMessage(item: any) {
      this.messages = this.messages.filter((i) => i.chatId !== item.chatId);
    },
  },
});
