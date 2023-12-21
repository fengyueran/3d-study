import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { Key } from 'react';

const { DirectoryTree } = Tree;

const treeData: DataNode[] = [
  {
    title: '01、认识three.js与开发环境搭建',
    key: '0',
    children: [
      {
        title: '05.使用three.js渲染第一个场景和物体',
        key: '0-5',
        isLeaf: true,
      },
      {
        title: '06.轨道控制器查看物体',
        key: '0-6',
        isLeaf: true,
      },
    ],
  },
  {
    title: '07、精通粒子特效',
    key: '7',
    children: [
      {
        title: '01.初识Points与点材质',
        key: '7-1',
        isLeaf: true,
      },
      {
        title: '02.Points材质属性',
        key: '7-2',
        isLeaf: true,
      },
      {
        title: '03.应用顶点着色打造绚丽多彩的天空',
        key: '7-3',
        isLeaf: true,
      },
      {
        title: '04.实现漫天飞舞的雪花',
        key: '7-4',
        isLeaf: true,
      },
      {
        title: '05.运用数学知识打造星系',
        key: '7-5',
        isLeaf: true,
      },
    ],
  },
];

interface Props {
  onSelect: (nodes: Key[]) => void;
}

export const Catalogue = (props: Props) => {
  const { onSelect } = props;

  return (
    <DirectoryTree
      multiple
      defaultExpandAll
      onSelect={onSelect}
      treeData={treeData}
    />
  );
};
