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
        title: '04.创建3D场景',
        key: '0-4',
        isLeaf: true,
      },
      {
        title: '08.光源对物体表面的影响',
        key: '0-8',
        isLeaf: true,
      },
      {
        title: '12.Canvas画布大小变化',
        key: '0-12',
        isLeaf: true,
      },
    ],
  },
  {
    title: '02、Three.js开发入门与调试设置',
    key: '0-1',
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
