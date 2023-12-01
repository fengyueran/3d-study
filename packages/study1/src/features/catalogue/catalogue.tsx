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
