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
      {
        title: '17.渲染器设置',
        key: '1-17',
        isLeaf: true,
      },
      {
        title: '18.Gui使用',
        key: '1-18',
        isLeaf: true,
      },
    ],
  },
  {
    title: '02、Geometry',
    key: '2',
    children: [
      {
        title: '01.几何体顶点位置数据',
        key: '2-01',
        isLeaf: true,
      },
      {
        title: '04.构建一个矩形平面',
        key: '2-04',
        isLeaf: true,
      },
      {
        title: '06.顶点法线数据',
        key: '2-06',
        isLeaf: true,
      },
      {
        title: '08.旋转、缩放、平移',
        key: '2-08',
        isLeaf: true,
      },
    ],
  },
  {
    title: '03、模型对象',
    key: '3',
    children: [
      {
        title: '03.模型材质颜色',
        key: '3-03',
        isLeaf: true,
      },
    ],
  },
  {
    title: '04、层级模型',
    key: '4',
    children: [
      {
        title: '01.组对象Group',
        key: '4-01',
        isLeaf: true,
      },
      {
        title: '03.本地坐标和世界坐标',
        key: '4-03',
        isLeaf: true,
      },
      {
        title: '05.Group移除对象',
        key: '4-05',
        isLeaf: true,
      },
    ],
  },
  {
    title: '05、纹理贴图',
    key: '5',
    children: [
      {
        title: '01.创建纹理贴图',
        key: '5-01',
        isLeaf: true,
      },
      {
        title: '02.自定义UV坐标',
        key: '5-02',
        isLeaf: true,
      },
      {
        title: '03.圆形平面设置纹理贴图',
        key: '5-03',
        isLeaf: true,
      },
      {
        title: '04.纹理对象瓷砖阵列',
        key: '5-04',
        isLeaf: true,
      },
      {
        title: '05.透明图片贴图',
        key: '5-05',
        isLeaf: true,
      },
      {
        title: '06.UV动画(offset偏移)',
        key: '5-06',
        isLeaf: true,
      },
    ],
  },
  {
    title: '06、外部模型',
    key: '6',
    children: [
      {
        title: '03.加载外部三维模型(gltf)(**)',
        key: '6-03',
        isLeaf: true,
      },
    ],
  },
  {
    title: '07、PBR材质与贴图',
    key: '7',
    children: [
      {
        title: '02.PBR材质金属度和粗糙度',
        key: '7-02',
        isLeaf: true,
      },
      {
        title: '03.环境贴图',
        key: '7-03',
        isLeaf: true,
      },
      {
        title: '05.MeshPhysicalMaterial清漆层',
        key: '7-05',
        isLeaf: true,
      },
    ],
  },
  {
    title: '08、渲染器',
    key: '8',
    children: [
      {
        title: '05.渲染结果保存为图片',
        key: '8-05',
        isLeaf: true,
      },
      {
        title: '06.深度冲突',
        key: '8-06',
        isLeaf: true,
      },
    ],
  },
  {
    title: '其他',
    key: '9',
    children: [
      {
        title: '后处理器',
        key: '9-01',
        isLeaf: true,
      },
      {
        title: '选择物体',
        key: '9-02',
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
