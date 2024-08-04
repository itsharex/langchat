/*
 * Copyright (c) 2024 LangChat. TyCoding All Rights Reserved.
 *
 * Licensed under the GNU Affero General Public License, Version 3 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BasicColumn } from '@/components/Table';
import { FormSchema } from '@/components/Form';

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    key: 'name',
    align: 'center',
  },
  {
    title: '角色标识',
    key: 'code',
    align: 'center',
  },
  {
    title: '角色描述',
    key: 'des',
    align: 'center',
  },
];

export const searchSchemas: FormSchema[] = [
  {
    field: 'name',
    component: 'NInput',
    label: '角色名称',
    componentProps: {
      placeholder: '请输入角色名称',
    },
  },
];

export const formSchemas: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'NInput',
    isHidden: true,
  },
  {
    field: 'name',
    label: '角色名称',
    component: 'NInput',
    componentProps: {
      placeholder: '请输入角色名称',
    },
    rules: [{ required: true, message: '请输入角色名称', trigger: ['blur'] }],
  },
  {
    field: 'code',
    label: '角色标识',
    component: 'NInput',
    componentProps: {
      placeholder: '请输入角色标识',
    },
    rules: [{ required: true, message: '请输入角色标识', trigger: ['blur'] }],
  },
  {
    field: 'menuIds',
    label: '菜单权限',
    slot: 'menuSlot',
    component: 'NInput',
  },
  {
    field: 'des',
    component: 'NInput',
    label: '角色描述',
    isFull: true,
    componentProps: {
      isFull: true,
      placeholder: '请输入角色描述',
      type: 'textarea',
      autosize: {
        minRows: 5,
        maxRows: 8,
      },
    },
  },
];
