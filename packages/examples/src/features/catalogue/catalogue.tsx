import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { Key } from 'react';

const { DirectoryTree } = Tree;

const treeData: DataNode[] = [
  {
    title: '01、粒子动效',
    key: '1',
    isLeaf: true,
  },
  {
    title: '02、加载PDB分子文件',
    key: '2',
    isLeaf: true,
  },
  {
    title: '03、分子粒子特效',
    key: '3',
    isLeaf: true,
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
