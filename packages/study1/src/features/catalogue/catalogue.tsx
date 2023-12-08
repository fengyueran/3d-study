import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { Key } from 'react';

const { DirectoryTree } = Tree;

const treeData: DataNode[] = [
  {
    title: '01、认识three.js与开发环境搭建',
    key: '1',
    children: [
      {
        title: '04.创建3D场景',
        key: '1-04',
        isLeaf: true,
      },
      {
        title: '08.光源对物体表面的影响',
        key: '1-08',
        isLeaf: true,
      },
      {
        title: '12.Canvas画布大小变化',
        key: '1-12',
        isLeaf: true,
      },
      {
        title: '13.Stats使用',
        key: '1-13',
        isLeaf: true,
      },
      {
        title: '14.透视相机体验',
        key: '1-14',
        isLeaf: true,
      },
      {
        title: '15.常见几何体',
        key: '1-15',
        isLeaf: true,
      },
      {
        title: '16.高光材质',
        key: '1-16',
        isLeaf: true,
      },
    ],
  },
  {
    title: '02、Three.js开发入门与调试设置',
    key: '2',
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
