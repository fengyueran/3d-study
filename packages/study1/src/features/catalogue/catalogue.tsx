import { Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import styled from 'styled-components';

// import { chapter1 } from './chapters';

const { DirectoryTree } = Tree;

const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const treeData: DataNode[] = [
  {
    title: '01、认识three.js与开发环境搭建',
    key: '0-0',
    children: [
      {
        title: '05.使用three.js渲染第一个场景和物体',
        key: '0-0-5',
        isLeaf: true,
      },
      {
        title: '06.轨道控制器查看物体',
        key: '0-0-6',
        isLeaf: true,
      },
    ],
  },
  {
    title: '02、Three.js开发入门与调试设置',
    key: '0-1',
  },
];

export const Catalogue = () => {
  return (
    <DirectoryTree
      multiple
      defaultExpandAll
      // onSelect={onSelect}
      // onExpand={onExpand}
      treeData={treeData}
    />
  );
};
