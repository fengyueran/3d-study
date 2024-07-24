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
  {
    title: '04、正交投影相机',
    key: '4',
    isLeaf: true,
  },
  {
    title: '05、透视投影相机',
    key: '5',
    isLeaf: true,
  },
  {
    title: '06、波浪效果',
    key: '6',
    isLeaf: true,
  },
  {
    title: '07、渐变颜色',
    key: '7',
    isLeaf: true,
  },
  {
    title: '08、物体充满视图(透视投影)',
    key: '8',
    isLeaf: true,
  },
  {
    title: '09、物体充满视图(正交投影)',
    key: '9',
    isLeaf: true,
  },
  {
    title: '10、自定义坐标轴',
    key: '10',
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
